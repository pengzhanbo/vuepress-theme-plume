import type { FSWatcher } from 'chokidar'
import process from 'node:process'
import { attemptAsync, objectKeys, sleep } from '@pengzhanbo/utils'
import { watch } from 'chokidar'
import matter from 'gray-matter'
import * as yaml from 'js-yaml'
import pMap from 'p-map'
import { fs, hash, path, tinyglobby } from 'vuepress/utils'
import { createFilter, logger, nanoid, normalizePath } from '../utils/index.js'

export type MarkdownData = Record<string, any>

/**
 * The information of a markdown file
 *
 * markdown 文件信息
 */
export interface MarkdownInfo {
  /**
   * The absolute path to the file
   *
   * 文件绝对路径
   */
  filepath: string
  /**
   * The path relative to the source directory, always using `/` as separator
   *
   * 相对源目录的路径，始终使用 `/` 作为分隔符
   */
  relativePath: string

  /**
   * The original file content, including the frontmatter
   *
   * 原始文件内容，包含 frontmatter
   *
   * It is used to detect concurrent modifications before replacing the file.
   *
   * 用于在替换文件前检测并发修改。
   */
  raw: string
  /**
   * The markdown content without frontmatter
   *
   * 不包含 frontmatter 的 markdown 内容
   */
  content: string
  /**
   * The parsed frontmatter data
   *
   * 解析后的 frontmatter 数据
   */
  data: MarkdownData
  /**
   * The line ending of the original file
   *
   * 原始文件的换行符
   */
  eol: string
}

/**
 * The `write` event handler
 *
 * `write` 事件处理器
 *
 * It is called before the file is written, so the final content can be modified
 * according to the markdown info. The handlers are chained: the value returned by
 * a handler is passed to the next one, and `void` keeps the previous content.
 *
 * 在文件写入前调用，因此可以根据 markdown 信息修改最终写入的内容。
 * 多个处理器按注册顺序链式执行：返回值会传递给下一个处理器，返回 `void` 保留上一次的内容。
 *
 * @example
 * ```ts
 * source.onWrite((info) => info.content.replace(/\n{3,}/g, '\n\n'))
 * ```
 */
export type MarkdownWriteHook = (info: MarkdownInfo) => string | void | Promise<string | void>

/**
 * The disposer to remove a registered hook
 *
 * 移除已注册钩子的函数
 */
export type MarkdownHookDisposer = () => void

/**
 * VuePress default page patterns
 *
 * VuePress 默认的页面匹配模式
 */
export const DEFAULT_PAGE_PATTERNS = ['**/*.md', '!.vuepress', '!node_modules']

/**
 * 全量处理的并发上限。每个任务都包含文件 IO 与一次原子重命名，
 * 有界并发能让大站点的文件描述符占用保持可预期，同时减小与编辑器保存竞争的几率。
 */
const MARKDOWN_CONCURRENCY = 16

export interface MarkdownSourceOptions {
  /**
   * The source directory of VuePress, usually `app.dir.source()`
   *
   * VuePress 的源目录，通常为 `app.dir.source()`
   */
  cwd: string
  /**
   * The page patterns used by `glob()` / `match()` / `watch()`
   *
   * `glob()` / `match()` / `watch()` 使用的页面匹配模式
   *
   * @default DEFAULT_PAGE_PATTERNS
   */
  pagePatterns?: string[]
}

/**
 * Write file content atomically
 *
 * 原子写入文件内容。
 */
async function writeFileAtomic(filepath: string, content: string, original: string): Promise<void> {
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
      if (chownError) {
        const [, tempStats] = await attemptAsync(() => fs.promises.stat(tempPath))
        const preserved = tempStats?.uid === stats.uid && tempStats?.gid === stats.gid
        if (!preserved)
          throw chownError
      }
    }

    const current = await fs.promises.readFile(filepath, 'utf-8')
    if (current !== original) {
      throw new Error(
        'the file was modified while generating frontmatter, '
        + 'the write was skipped to avoid overwriting the newer content',
      )
    }

    await fs.promises.rename(tempPath, filepath)
  }
  catch (error) {
    await attemptAsync(() => fs.promises.unlink(tempPath))
    throw error
  }
}

/**
 * Serialize the frontmatter data and the markdown content back to the file content
 *
 * 将 frontmatter 数据与 markdown 内容序列化为文件内容
 */
function serializeMarkdown(info: MarkdownInfo): string {
  const { data, content, eol } = info

  // gray-matter 依赖 `js-yaml@3.x` 的版本
  // 这个版本 stringify 后的内容，值会包裹在 `""` 中，但不符合通常的 yaml 书写格式
  // 而如果通过匹配删除 `""`, 又会导致特殊字符无法正常解析
  // 这些问题在 `js-yaml@4.x` 中已经解决
  const formatted = objectKeys(data).length === 0 ? '' : yaml.dump(data)

  // `yaml.dump` 始终输出 LF，这里将其统一为目标文件的换行符。
  return formatted
    ? `---${eol}${formatted.replace(/\n/g, eol)}---${eol}${content}`
    : content
}

function createDisposer<T>(hooks: T[], hook: T): MarkdownHookDisposer {
  return () => {
    const index = hooks.indexOf(hook)
    if (index !== -1)
      hooks.splice(index, 1)
  }
}

/**
 * Markdown source reader / writer
 *
 * markdown 源文件读写器
 *
 * 它绑定 VuePress 的源目录与页面匹配模式，且不依赖 VuePress 的 `App`，因此任何功能都可以共享它。
 */
export class MarkdownSource {
  readonly cwd: string
  pagePatterns: string[]

  private writeHooks: MarkdownWriteHook[] = []
  /**
   * 记录正在处理的文件。全量扫描与 watcher `add` 事件可能命中同一文件，
   * 而对同一文件的两次并发读写可能回滚编辑器中的保存，
   * 因此共享进行中的 Promise，使同一文件只被处理一次。
   */
  private pending = new Map<string, Promise<boolean>>()
  /**
   * 处理失败的文件
   */
  private failed = new Map<string, unknown>()

  constructor(options: MarkdownSourceOptions | string) {
    const { cwd, pagePatterns } = typeof options === 'string'
      ? { cwd: options, pagePatterns: DEFAULT_PAGE_PATTERNS }
      : options

    this.cwd = cwd
    this.pagePatterns = pagePatterns ?? DEFAULT_PAGE_PATTERNS
  }

  /**
   * Register the `write` event handler
   *
   * 注册 `write` 事件处理器
   *
   * @returns The disposer to remove the handler / 移除处理器的函数
   */
  onWrite(hook: MarkdownWriteHook): MarkdownHookDisposer {
    this.writeHooks.push(hook)
    return createDisposer(this.writeHooks, hook)
  }

  /**
   * Glob markdown files by the page patterns
   *
   * 根据页面匹配模式枚举 markdown 文件
   *
   * @returns The paths relative to the source directory / 相对源目录的路径
   */
  async glob(pagePatterns: string[] | string = this.pagePatterns): Promise<string[]> {
    const files = await tinyglobby.glob(pagePatterns, { cwd: this.cwd })
    return files.map(file => normalizePath(file))
  }

  /**
   * Whether the relative path matches the page patterns
   *
   * 相对路径是否匹配页面匹配模式
   */
  match(relativePath: string, pagePatterns: string[] | string = this.pagePatterns): boolean {
    return createFilter(pagePatterns)(normalizePath(relativePath))
  }

  /**
   * Read and parse a markdown file, then emit the `read` event
   *
   * 读取并解析 markdown 文件，随后触发 `read` 事件
   */
  async read(filepath: string, relativePath?: string): Promise<MarkdownInfo> {
    const absolutePath = this.resolve(filepath)
    const raw = await fs.promises.readFile(absolutePath, 'utf-8')
    const { data, content } = matter(raw, {})

    const info: MarkdownInfo = {
      filepath: absolutePath,
      relativePath: this.toRelative(relativePath ?? path.relative(this.cwd, absolutePath)),
      raw,
      content,
      data: data as MarkdownData,
      // 保留原文件的换行符
      eol: raw.includes('\r\n') ? '\r\n' : '\n',
    }

    return info
  }

  /**
   * Write the markdown info back to the file, then emit the `write` event
   *
   * 将 markdown 信息写回文件，写入前触发 `write` 事件
   *
   * The write is skipped when:
   * - the frontmatter data is not modified (the original file formatting is kept)
   * - the final content is identical to the original content
   *
   * 以下情况会跳过写入：
   * - frontmatter 数据未被修改（保留原文件的格式）
   * - 最终内容与原始内容一致
   *
   * @returns Whether the file is written / 是否写入了文件
   */
  async write(info: MarkdownInfo): Promise<boolean> {
    const dataHash = hash(info.data)
    const content = info.content
    for (const hook of this.writeHooks)
      info.content = (await hook(info)) ?? info.content

    // 内容、frontmatter 均未发生变更，不做写入处理
    if (info.content === content && hash(info.data) === dataHash)
      return false

    await writeFileAtomic(info.filepath, serializeMarkdown(info), info.raw)
    return true
  }

  /**
   * Read then write a markdown file. Concurrent requests of the same file share one task.
   *
   * 读取并写入一个 markdown 文件。同一文件的并发请求共享同一个任务。
   *
   * @returns Whether the file is written / 是否写入了文件
   */
  async process(filepath: string, relativePath?: string): Promise<boolean> {
    const absolutePath = this.resolve(filepath)
    const pending = this.pending.get(absolutePath)
    if (pending)
      return pending

    const task = this.doProcess(
      absolutePath,
      this.toRelative(relativePath ?? path.relative(this.cwd, absolutePath)),
    ).finally(() => this.pending.delete(absolutePath))

    this.pending.set(absolutePath, task)
    return task
  }

  /**
   * Run `read` → `write` for all markdown files matched by the page patterns.
   *
   * 对所有匹配页面模式的 markdown 文件依次执行 `read` → `write`。
   *
   * The failed files are reported together after the whole batch, so that they
   * will not be ignored as scattered logs.
   *
   * 失败的文件会在整个批次结束后汇总上报，避免逐条日志被忽略。
   */
  async run(pagePatterns: string[] | string = this.pagePatterns): Promise<void> {
    const fileList = await this.glob(pagePatterns)

    if (fileList.length) {
      await pMap(
        fileList,
        async (filepath) => {
          try {
            await this.process(filepath)
          }
          catch (error) {
            this.failed.set(filepath, error)
          }
        },
        { concurrency: MARKDOWN_CONCURRENCY },
      )

      // i/o performance
      await sleep(100)
    }

    this.reportFailed()
  }

  /**
   * Watch the source directory, and process newly added markdown files with
   * `read` → `write` events.
   *
   * 监听源目录，并对新增的 markdown 文件依次触发 `read` → `write` 事件。
   */
  watch(watchers: FSWatcher[]): FSWatcher {
    const watcher = watch('.', {
      cwd: this.cwd,
      ignoreInitial: true,
      ignored: (filepath, stats) => {
        const isFile = Boolean(stats?.isFile())
        if (
          filepath.includes('.vuepress')
          || (isFile && !filepath.endsWith('.md'))
        ) {
          return true
        }
        return isFile && !this.match(path.relative(this.cwd, filepath))
      },
    })

    /**
     * 只需要关注新增的文件
     */
    watcher.on('add', (filepath) => {
      const relativePath = this.toRelative(filepath)
      if (this.isIgnored(relativePath))
        return

      void this.process(relativePath)
        .catch(error => logger.error(`Failed to process the markdown file ${relativePath}`, error))
    })

    watchers.push(watcher)
    return watcher
  }

  private reportFailed(): void {
    if (this.failed.size === 0)
      return

    const details = [...this.failed]
      .map(([file, error]) => `  - ${file}${error instanceof Error ? `: ${error.message}` : ''}`)
      .join('\n')

    logger.error(`Failed to write ${this.failed.size} markdown file(s):\n${details}`)

    this.failed.clear()
  }

  private async doProcess(filepath: string, relativePath: string): Promise<boolean> {
    // 写入会跟随符号链接，符号链接的 markdown 文件可能导致主题改写源目录之外的文件，因此跳过这类文件。
    const stats = await fs.promises.lstat(filepath)
    if (stats.isSymbolicLink()) {
      logger.warn(`Skipped writing the symbolic link: ${relativePath}`)
      return false
    }

    return this.write(await this.read(filepath, relativePath))
  }

  private isIgnored(relativePath: string): boolean {
    return relativePath.includes('.vuepress')
      || relativePath.startsWith('..')
      || !relativePath.endsWith('.md')
      || !this.match(relativePath)
  }

  private resolve(filepath: string): string {
    return path.isAbsolute(filepath) ? filepath : path.join(this.cwd, filepath)
  }

  private toRelative(filepath: string): string {
    return normalizePath(path.isAbsolute(filepath) ? path.relative(this.cwd, filepath) : filepath)
  }
}

let markdownSource: MarkdownSource | undefined

/**
 * Initialize the global markdown source instance
 *
 * 初始化全局 markdown 源实例
 *
 * When the source directory is unchanged, the existing instance is reused so that
 * the registered hooks are kept.
 *
 * 当源目录未变化时复用已有实例，以保留已注册的钩子。
 */
export function initMarkdownSource(options: MarkdownSourceOptions | string): MarkdownSource {
  const { cwd, pagePatterns } = typeof options === 'string'
    ? { cwd: options, pagePatterns: undefined }
    : options

  if (markdownSource && markdownSource.cwd === cwd) {
    if (pagePatterns)
      markdownSource.pagePatterns = pagePatterns
    return markdownSource
  }

  markdownSource = new MarkdownSource({ cwd, pagePatterns })
  return markdownSource
}

/**
 * Get the global markdown source instance
 *
 * 获取全局 markdown 源实例
 */
export function getMarkdownSource(): MarkdownSource {
  if (!markdownSource)
    throw new Error('getMarkdownSource() is called without initialization.')
  return markdownSource
}
