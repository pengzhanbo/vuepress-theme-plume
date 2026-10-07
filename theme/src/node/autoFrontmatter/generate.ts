import type { App } from 'vuepress'
import type {
  AutoFrontmatterContext,
  AutoFrontmatterData,
  AutoFrontmatterHandle,
  AutoFrontmatterRule,
} from '../../shared/index.js'
import process from 'node:process'
import { attemptAsync, objectKeys, sleep } from '@pengzhanbo/utils'
import { type FSWatcher, watch } from 'chokidar'
import matter from 'gray-matter'
import * as yaml from 'js-yaml'
import pMap from 'p-map'
import { fs, hash as getHash, path, tinyglobby } from 'vuepress/utils'
import { logger, nanoid } from '../utils/index.js'
import { createFilter } from './createFilter.js'
import { genAutoFrontmatterRules, getRules } from './rules.js'

/**
 * Get markdown info
 */
async function getMarkdownInfo(filepath: string, relativePath: string): Promise<{
  data: AutoFrontmatterData
  context: AutoFrontmatterContext
  eol: string
}> {
  const raw = await fs.promises.readFile(filepath, 'utf-8')
  const { data, content } = matter(raw, {})
  return {
    data: data as AutoFrontmatterData,
    context: {
      filepath,
      relativePath,
      content,
    },
    // Preserve the line endings of the original file. Always emitting LF would leave
    // a CRLF file with mixed line endings, and git would flag the whole file as modified.
    // 保留原文件的换行符。始终输出 LF 会让 CRLF 文件出现混合换行符，导致 git 将整个文件标记为已修改。
    eol: raw.includes('\r\n') ? '\r\n' : '\n',
  }
}

/**
 * Write file content atomically
 *
 * Write to a temporary file in the same directory, then rename it over the target.
 * Renaming within the same file system is atomic, so a concurrent editor save can
 * never observe a partially written file.
 *
 * The target's permissions and owner are preserved, because `rename` swaps in a brand new
 * inode instead of truncating the existing one. ACLs and extended attributes are not
 * carried over.
 *
 * 原子写入文件内容。
 *
 * 先写入同目录下的临时文件，再重命名覆盖目标文件。同一文件系统内的重命名是原子操作，
 * 因此并发的编辑器保存永远不会读到写了一半的文件。
 *
 * 由于 `rename` 换入的是全新的 inode（而非截断原文件），这里会保留目标的权限与属主。
 * ACL 与扩展属性不会被保留。
 */
async function writeFileAtomic(filepath: string, content: string): Promise<void> {
  // Inspect the target's own permission bits instead of relying on `access(W_OK)`: a
  // process able to bypass the file permission checks (e.g. root) would pass the check on
  // a `0444` file, and the rename would silently replace a read-only file.
  // 检查目标文件自身的权限位，而不是依赖 `access(W_OK)`：能够绕过文件权限检查的进程（如 root）
  // 对 `0444` 文件也会通过检查，重命名将静默替换只读文件。
  const stats = await fs.promises.stat(filepath)
  const mode = stats.mode & 0o7777

  if ((mode & 0o222) === 0) {
    const error = new Error('EACCES: permission denied, the file is read-only') as NodeJS.ErrnoException
    error.code = 'EACCES'
    throw error
  }

  const tempPath = path.join(
    path.dirname(filepath),
    `.${path.basename(filepath)}.${nanoid(8)}.tmp`,
  )
  try {
    await fs.promises.writeFile(tempPath, content, { encoding: 'utf-8', mode })
    await fs.promises.chmod(tempPath, mode)

    if (typeof process.getuid === 'function') {
      const [chownError] = await attemptAsync(() => fs.promises.chown(tempPath, stats.uid, stats.gid))
      if (chownError && stats.uid !== process.getuid())
        throw chownError
    }

    await fs.promises.rename(tempPath, filepath)
  }
  catch (error) {
    await attemptAsync(() => fs.promises.unlink(tempPath))
    throw error
  }
}

/**
 * Find rule by filepath, Only return the first
 */
export function findRule(rules: AutoFrontmatterRule[], filepath: string): AutoFrontmatterRule | undefined {
  const rule = rules.find(({ filter }) => createFilter(filter)(filepath))
  return rule
}

/**
 * Files whose frontmatter could not be generated, e.g. read-only files (`EACCES`).
 * A single `logger.error` per file is easy to miss, so the failures are collected and
 * reported as an aggregated error once the batch finishes: a page without the generated
 * frontmatter silently loses its `permalink` / `title`.
 *
 * frontmatter 生成失败的文件，例如只读文件（`EACCES`）。
 * 逐条 `logger.error` 很容易被忽略，因此先收集，待批次结束后汇总报错：
 * 页面缺少生成的 frontmatter 会静默丢失 `permalink` / `title`。
 */
const failedFiles = new Map<string, unknown>()

function reportFailedFiles(): void {
  if (failedFiles.size === 0)
    return

  const details = [...failedFiles]
    .map(([file, error]) => `  - ${file}${error instanceof Error ? `: ${error.message}` : ''}`)
    .join('\n')

  logger.error(
    `Failed to generate frontmatter for ${failedFiles.size} file(s), `
    + `the generated permalink / title may be missing:\n${details}`,
  )

  failedFiles.clear()
}

/**
 * Tracks the files currently being processed. The full scan and the watcher `add` event
 * may hit the same file, and two concurrent read/write cycles on one file could roll
 * back an editor save, so the in-flight promise is shared and the file is handled once.
 *
 * 记录正在处理的文件。全量扫描与 watcher `add` 事件可能命中同一文件，
 * 而对同一文件的两次并发读写可能回滚编辑器中的保存，
 * 因此共享进行中的 Promise，使同一文件只被处理一次。
 */
const pendingFiles = new Map<string, Promise<void>>()

/**
 * Generate frontmatter for a single Markdown file
 *
 * @param filepath - Absolute path of the Markdown file / Markdown 文件的绝对路径
 * @param relativePath - Path relative to the source directory, used in logs / 相对源目录的路径，用于日志
 * @param handle - Rule handler that resolves the frontmatter / 解析 frontmatter 的规则处理器
 */
async function doGenerateFileFrontmatter(
  filepath: string,
  relativePath: string,
  handle: AutoFrontmatterHandle,
): Promise<void> {
  try {
    // Writing follows symbolic links, so a linked markdown file could cause the theme
    // to modify a file outside of the source directory. Such files are skipped.
    // 写入会跟随符号链接，符号链接的 markdown 文件可能导致主题改写源目录之外的文件，因此跳过这类文件。
    const fileStats = await fs.promises.lstat(filepath)
    if (fileStats.isSymbolicLink()) {
      logger.warn(`Skipped generating frontmatter for the symbolic link: ${relativePath}`)
      return
    }

    const { data, context, eol } = await getMarkdownInfo(filepath, relativePath)
    const beforeHash = getHash(data)
    const result = await handle(data, context)
    const afterHash = getHash(result)

    // data not changed, skip writing
    if (beforeHash === afterHash)
      return

    // `gray-matter` depends on version `js-yaml@3.x`
    // The content after stringification in this version will be wrapped in `""`, which does not conform to the usual YAML writing format
    // However, removing `""` through matching would cause special characters to fail parsing correctly
    // These issues have been resolved in `js-yaml@4.x`
    //
    // gray-matter 依赖 `js-yaml@3.x` 的版本
    // 这个版本 stringify 后的内容，值会包裹在 `""` 中，但不符合通常的 yaml 书写格式
    // 而如果通过匹配删除 `""`, 又会导致特殊字符无法正常解析
    // 这些问题在 `js-yaml@4.x` 中已经解决
    const formatted = objectKeys(result).length === 0 ? '' : yaml.dump(result)

    // `yaml.dump` always emits LF, normalize it to the line ending of the target file.
    // `yaml.dump` 始终输出 LF，这里将其统一为目标文件的换行符。
    const content = formatted
      ? `---${eol}${formatted.replace(/\n/g, eol)}---${eol}${context.content}`
      : context.content

    await writeFileAtomic(filepath, content)
  }
  catch (e) {
    // Collected and reported as an aggregated error once the batch finishes:
    // otherwise a page silently loses its generated `permalink` / `title`.
    // 先收集，待批次结束后汇总报错：否则页面会静默丢失生成的 `permalink` / `title`。
    failedFiles.set(relativePath, e)
  }
}

/**
 * Generate frontmatter for a single Markdown file
 *
 * A file matched by both the full scan and the watcher `add` event is only handled once,
 * sharing the in-flight promise.
 *
 * 为单个 Markdown 文件生成 frontmatter。
 *
 * 同时被全量扫描与 watcher `add` 事件命中的文件只会被处理一次，两者共享进行中的 Promise。
 */
export async function generateFileFrontmatter(filepath: string, cwd: string, handle: AutoFrontmatterHandle): Promise<void> {
  // Resolve to an absolute path first, so that different relative forms of the same
  // file always map to the same in-flight entry.
  // 先解析为绝对路径，使同一文件的不同相对路径写法总能命中同一个进行中的条目。
  const targetPath = path.join(cwd, filepath)
  const pending = pendingFiles.get(targetPath)
  if (pending)
    return pending

  const task = doGenerateFileFrontmatter(targetPath, filepath, handle)
    .finally(() => pendingFiles.delete(targetPath))
  pendingFiles.set(targetPath, task)
  return task
}

type Task = readonly [string, AutoFrontmatterHandle]

/**
 * Concurrency for the full frontmatter scan. Each task performs file IO plus an atomic
 * rename, so a bounded value keeps file descriptor usage predictable on large sites, and
 * a smaller in-flight set reduces the chance of racing with an editor save.
 *
 * 全量 frontmatter 扫描的并发上限。每个任务都包含文件 IO 与一次原子重命名，
 * 有界并发能让大站点的文件描述符占用保持可预期，同时减小与编辑器保存竞争的几率。
 */
const FRONTMATTER_CONCURRENCY = 16

/**
 * Generate frontmatter for all Markdown files
 */
export async function generateFileListFrontmatter(app: App): Promise<void> {
  const { pagePatterns = ['**/*.md', '!.vuepress', '!node_modules'] }
    = app.options
  const cwd = app.dir.source()

  genAutoFrontmatterRules()
  const rules = getRules()
  const tasks: Task[] = []
  const fileList = await tinyglobby.glob(pagePatterns, { cwd })

  for (const filepath of fileList) {
    const rule = findRule(rules, filepath)
    if (rule) {
      tasks.push([filepath, rule.handle])
    }
  }

  if (tasks.length) {
    // Limit the number of concurrent tasks
    await pMap(
      tasks,
      async ([filepath, handle]) => await generateFileFrontmatter(filepath, cwd, handle),
      { concurrency: FRONTMATTER_CONCURRENCY },
    )

    // i/o performance
    await sleep(100)
  }

  // Report the files whose frontmatter could not be written instead of failing silently.
  // 汇总报告未能写入 frontmatter 的文件，而不是静默失败。
  reportFailedFiles()
}

export function watchAutoFrontmatter(app: App, watchers: FSWatcher[]): void {
  const { pagePatterns = ['**/*.md', '!.vuepress', '!node_modules'] }
    = app.options
  const cwd = app.dir.source()
  const filter = createFilter(pagePatterns)
  const watcher = watch('.', {
    cwd,
    ignoreInitial: true,
    ignored: (filepath, stats) => {
      const isFile = Boolean(stats?.isFile())
      if (
        filepath.includes('.vuepress')
        || (isFile && !filepath.endsWith('.md'))
      ) {
        return true
      }
      return isFile && !filter(path.relative(cwd, filepath))
    },
  })
  /**
   * Only need to focus on the newly added files
   * 只需要关注新增的文件
   */
  watcher.on('add', (filepath) => {
    const relativePath = path.join(filepath) // normalize path
    const rule = findRule(getRules(), relativePath)
    if (rule) {
      // There is no batch here, so report the failure as soon as the file is processed.
      // 这里没有批次概念，文件处理完成后立即汇报失败。
      void generateFileFrontmatter(relativePath, cwd, rule.handle)
        .then(() => reportFailedFiles())
    }
  })

  watchers.push(watcher)
}
