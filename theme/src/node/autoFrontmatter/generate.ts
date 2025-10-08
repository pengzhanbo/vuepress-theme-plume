import type { App } from 'vuepress'
import type {
  AutoFrontmatterContext,
  AutoFrontmatterData,
  AutoFrontmatterHandle,
  AutoFrontmatterRule,
} from '../../shared/index.js'
import { sleep } from '@pengzhanbo/utils'
import { type FSWatcher, watch } from 'chokidar'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import pMap from 'p-map'
import { fs, hash as getHash, globby, path } from 'vuepress/utils'
import { logger } from '../utils/index.js'
import { createFilter } from './createFilter.js'
import { genAutoFrontmatterRules, getRules } from './rules.js'

/**
 * Get markdown info
 */
async function getMarkdownInfo(relativePath: string, cwd: string): Promise<{
  data: AutoFrontmatterData
  context: AutoFrontmatterContext
}> {
  const filepath = path.join(cwd, relativePath)
  const raw = await fs.promises.readFile(filepath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    data,
    context: {
      filepath,
      relativePath,
      content,
    },
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
 * Generate frontmatter for a single Markdown file
 */
export async function generateFileFrontmatter(filepath: string, cwd: string, handle: AutoFrontmatterHandle): Promise<void> {
  try {
    const { data, context } = await getMarkdownInfo(filepath, cwd)
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
    const formatted = Object.keys(result).length === 0 ? '' : yaml.dump(result)

    await fs.promises.writeFile(
      context.filepath,
      formatted ? `---\n${formatted}---\n${context.content}` : context.content,
      'utf-8',
    )
  }
  catch (e) {
    logger.error(`Failed to generate frontmatter for ${filepath}`, e)
  }
}

type Task = readonly [string, AutoFrontmatterHandle]

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
  const fileList = await globby(pagePatterns, { cwd })

  for (const filepath of fileList) {
    const rule = findRule(rules, filepath)
    if (rule) {
      tasks.push([filepath, rule.handle])
    }
  }

  if (tasks.length === 0)
    return

  // Limit the number of concurrent tasks
  await pMap(
    tasks,
    async ([filepath, handle]) => await generateFileFrontmatter(filepath, cwd, handle),
    { concurrency: 64 },
  )
  // i/o performance
  await sleep(100)
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
    if (rule)
      generateFileFrontmatter(relativePath, cwd, rule.handle)
  })

  watchers.push(watcher)
}
