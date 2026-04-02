/**
 * Search Index Preparation Module
 *
 * 搜索索引准备模块
 *
 * This module handles the creation, update, and management of MiniSearch indexes
 * for VuePress pages, supporting multiple locales and hot module replacement.
 *
 * 本模块处理 VuePress 页面的 MiniSearch 索引的创建、更新和管理，
 * 支持多语言和热模块替换。
 *
 * @module plugin-search/node/prepareSearchIndex
 */
import type { App, Page } from 'vuepress/core'
import type { SearchOptions, SearchPluginOptions } from '../shared/index.js'
import MiniSearch from 'minisearch'
import pMap from 'p-map'
import { colors, logger } from 'vuepress/utils'

/**
 * Options for search index preparation.
 *
 * 搜索索引准备的配置选项。
 */
export interface SearchIndexOptions {
  /** VuePress application instance / VuePress 应用实例 */
  app: App
  /** MiniSearch configuration options / MiniSearch 配置选项 */
  searchOptions: SearchOptions
  /** Function to filter searchable pages / 过滤可搜索页面的函数 */
  isSearchable: SearchPluginOptions['isSearchable']
}

interface UpdateSearchIndexOptions extends Omit<SearchIndexOptions, 'app'> {
  /** VuePress page instance / VuePress 页面实例 */
  page: Page
}

/**
 * Internal index object structure for MiniSearch.
 *
 * MiniSearch 的内部索引对象结构。
 */
interface IndexObject {
  /** Unique identifier for the indexed item / 索引项的唯一标识符 */
  id: string
  /** Text content for searching / 用于搜索的文本内容 */
  text: string
  /** Title of the section / 章节标题 */
  title: string
  /** Parent titles hierarchy / 父级标题层级 */
  titles: string[]
}

/** Directory path for storing search index files / 存储搜索索引文件的目录路径 */
const SEARCH_INDEX_DIR = 'internal/minisearchIndex/'

/** Map of locale paths to their MiniSearch instances / 语言路径到 MiniSearch 实例的映射 */
const indexByLocales = new Map<string, MiniSearch<IndexObject>>()

/** Cache for index objects by file path / 按文件路径缓存索引对象 */
const indexCache = new Map<string, IndexObject[]>()

/**
 * Get or create a MiniSearch index for a specific locale.
 *
 * 获取或创建特定语言的 MiniSearch 索引。
 *
 * @param locale - Locale path (e.g., '/', '/zh/') / 语言路径
 * @param lang - Language code for tokenization / 用于分词的语言代码
 * @param options - Search index options / 搜索索引选项
 * @returns MiniSearch instance for the locale / 该语言的 MiniSearch 实例
 */
function getIndexByLocale(locale: string, lang: string, options: SearchIndexOptions['searchOptions']) {
  let index = indexByLocales.get(locale)
  if (!index) {
    const segmenter = new Intl.Segmenter(lang, { granularity: 'word' })
    index = new MiniSearch<IndexObject>({
      fields: ['title', 'titles', 'text'],
      storeFields: ['title', 'titles'],
      tokenize(text) {
        return Array.from(segmenter.segment(text)).map(s => s.segment)
      },
      ...options.miniSearch?.options,
    })
    indexByLocales.set(locale, index)
  }
  return index
}

/**
 * Get or create an index cache for a specific file path.
 *
 * 获取或创建特定文件路径的索引缓存。
 *
 * @param filepath - File path to get cache for / 要获取缓存的文件路径
 * @returns Array of index objects for the file / 该文件的索引对象数组
 */
function getIndexCache(filepath: string) {
  let index = indexCache.get(filepath)
  if (!index) {
    index = []
    indexCache.set(filepath, index)
  }
  return index
}

/**
 * Write a placeholder search index file for development mode.
 *
 * 为开发模式写入占位符搜索索引文件。
 *
 * This is used to provide an empty index before the actual index is prepared,
 * preventing errors when the search component loads before indexing completes.
 *
 * 用于在实际索引准备完成之前提供空索引，
 * 防止搜索组件在索引完成之前加载时出错。
 *
 * @param app - VuePress application instance / VuePress 应用实例
 */
export async function prepareSearchIndexPlaceholder(app: App) {
  await app.writeTemp(`${SEARCH_INDEX_DIR}index.js`, 'export const searchIndex = {}')
}

/**
 * Prepare search indexes for all pages in the VuePress application.
 *
 * 为 VuePress 应用中的所有页面准备搜索索引。
 *
 * This function indexes all pages concurrently, creating separate MiniSearch
 * instances for each locale, and writes the indexes to temporary files.
 *
 * 此函数并发索引所有页面，为每个语言创建独立的 MiniSearch 实例，
 * 并将索引写入临时文件。
 *
 * @param options - Search index preparation options / 搜索索引准备选项
 * @param options.app - VuePress application instance / VuePress 应用实例
 * @param options.isSearchable - Function to filter searchable pages / 过滤可搜索页面的函数
 * @param options.searchOptions - MiniSearch configuration / MiniSearch 配置
 */
export async function prepareSearchIndex({
  app,
  isSearchable,
  searchOptions,
}: SearchIndexOptions): Promise<void> {
  const start = performance.now()
  indexByLocales.clear()
  indexCache.clear()

  await pMap(app.pages, p => indexFile(p, searchOptions, isSearchable), {
    concurrency: 64,
  })

  await writeTemp(app)

  if (app.env.isBuild) {
    indexByLocales.clear()
    indexCache.clear()
  }

  if (app.env.isDebug) {
    logger.info(
      `\n[${colors.green('@vuepress-plume/plugin-search')}] prepare search time spent: ${(performance.now() - start).toFixed(2)}ms`,
    )
  }
}

/**
 * Handle search index update when a page is modified.
 *
 * 当页面被修改时处理搜索索引更新。
 *
 * @param filepath - Path of the modified file relative to project root / 相对于项目根目录的修改文件路径
 * @param options - Search index preparation options / 搜索索引准备选项
 * @param options.app - VuePress application instance / VuePress 应用实例
 * @param options.isSearchable - Function to filter searchable pages / 过滤可搜索页面的函数
 * @param options.searchOptions - MiniSearch configuration / MiniSearch 配置
 */
export async function onSearchIndexUpdated(
  app: App,
  {
    page,
    isSearchable,
    searchOptions,
  }: UpdateSearchIndexOptions,
): Promise<void> {
  if (isSearchable && !isSearchable(page))
    return

  await indexFile(page, searchOptions, isSearchable)
  await writeTemp(app)
}

/**
 * Handle search index update when a page is removed.
 *
 * 当页面被删除时处理搜索索引更新。
 *
 * @param filepath - Path of the removed file relative to project root / 相对于项目根目录的删除文件路径
 * @param options - Search index preparation options / 搜索索引准备选项
 * @param options.app - VuePress application instance / VuePress 应用实例
 * @param options.isSearchable - Function to filter searchable pages / 过滤可搜索页面的函数
 * @param options.searchOptions - MiniSearch configuration / MiniSearch 配置
 */
export async function onSearchIndexRemoved(
  app: App,
  {
    page,
    isSearchable,
    searchOptions,
  }: UpdateSearchIndexOptions,
): Promise<void> {
  if (isSearchable && !isSearchable(page))
    return

  if (page.filePathRelative) {
    const fileId = page.path
    const locale = page.pathLocale
    const lang = page.lang
    const index = getIndexByLocale(locale, lang, searchOptions)
    const cache = getIndexCache(fileId)
    if (cache && cache.length)
      index.removeAll(cache)
    await writeTemp(app)
  }
}

/**
 * Write all search indexes to temporary files.
 *
 * 将所有搜索索引写入临时文件。
 *
 * Creates separate JavaScript files for each locale's search index,
 * enabling lazy loading of indexes in the client.
 *
 * 为每个语言的搜索索引创建独立的 JavaScript 文件，
 * 支持客户端延迟加载索引。
 *
 * @param app - VuePress application instance / VuePress 应用实例
 */
async function writeTemp(app: App) {
  const records: string[] = []
  const promises: Promise<string>[] = []
  for (const [locale] of indexByLocales) {
    const index = indexByLocales.get(locale)!
    const localeName = locale.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'default'
    const filename = `searchBox-${localeName}.js`
    records.push(`${JSON.stringify(locale)}: () => import('@${SEARCH_INDEX_DIR}${filename}')`)
    promises.push(
      app.writeTemp(
        `${SEARCH_INDEX_DIR}${filename}`,
        `export default ${JSON.stringify(
          JSON.stringify(index) ?? {},
        )}`,
      ),
    )
  }
  promises.push(
    app.writeTemp(
      `${SEARCH_INDEX_DIR}index.js`,
      `export const searchIndex = {${records.join(',')}}${app.env.isDev ? `\n${genHmrCode('searchIndex')}` : ''}`,
    ),
  )
  await Promise.all(promises)
}

/**
 * Index a single page for search.
 *
 * 为单个页面建立搜索索引。
 *
 * Extracts content from the page, splits it into sections based on headings,
 * and adds each section to the appropriate locale's MiniSearch index.
 *
 * 从页面提取内容，根据标题将其分割为章节，
 * 并将每个章节添加到相应语言的 MiniSearch 索引中。
 *
 * @param page - VuePress page object / VuePress 页面对象
 * @param options - MiniSearch options / MiniSearch 选项
 * @param isSearchable - Function to check if page should be indexed / 检查页面是否应被索引的函数
 */
async function indexFile(page: Page, options: SearchIndexOptions['searchOptions'], isSearchable: SearchPluginOptions['isSearchable']) {
  if (!page.filePath || page.frontmatter?.search === false)
    return

  if (isSearchable && !isSearchable(page))
    return

  // get file metadata
  const fileId = page.path
  const locale = page.pathLocale
  const lang = page.lang
  const index = getIndexByLocale(locale, lang, options)
  const cache = getIndexCache(fileId)
  // retrieve file and split into "sections"
  const html = `<h1><a href="#"><span>${page.frontmatter.title || page.title}</span></a></h1>
${page.contentRendered}`
  const sections = splitPageIntoSections(html)

  if (cache && cache.length)
    index.removeAll(cache)

  // add sections to the locale index
  for await (const section of sections) {
    if (!section || !(section.text || section.titles))
      break
    const { anchor, text, titles } = section
    const id = anchor ? [fileId, anchor].join('#') : fileId

    if (index.has(id)) {
      if (anchor) {
        logger.error(`${colors.green('[@vuepress-plume/plugin-search]')} duplicate heading anchor : ${colors.cyan(titles.join(' >> '))} \n at ${colors.cyan(fileId)}`)
      }
      else {
        logger.error(`${colors.green('[@vuepress-plume/plugin-search]')} duplicate page permalink : ${colors.cyan(fileId)}`)
      }
    }
    else {
      const item = {
        id,
        text,
        title: titles.at(-1)!,
        titles: titles.slice(0, -1),
      }
      index.add(item)
      cache.push(item)
    }
  }
}

/** Regex pattern for matching heading tags / 匹配标题标签的正则表达式 */
// eslint-disable-next-line regexp/no-super-linear-backtracking
const headingRegex = /<h(\d*).*?>(<a.*? href="#.*?".*?>[\s\S]*?<\/a>)<\/h\1>/gi
/** Regex pattern for extracting heading content / 提取标题内容的正则表达式 */
// eslint-disable-next-line regexp/no-super-linear-backtracking
const headingContentRegex = /<a.*? href="#(.*?)".*?><span>([\s\S]*?)<\/span><\/a>/i
/** Regex pattern for ignoring template content / 忽略模板内容的正则表达式 */
const ignoreHeadingRegex = /<template[^>]*>[\s\S]*<\/template>/gi

/**
 * Split HTML content into sections based on heading elements.
 *
 * 根据标题元素将 HTML 内容分割为章节。
 *
 * This generator function parses HTML content and yields section objects
 * containing anchor, titles hierarchy, and searchable text.
 *
 * 此生成器函数解析 HTML 内容并生成包含锚点、标题层级和可搜索文本的章节对象。
 *
 * @param html - HTML content to split / 要分割的 HTML 内容
 * @yields Section objects with anchor, titles, and text / 包含锚点、标题和文本的章节对象
 */
function* splitPageIntoSections(html: string) {
  const result = html.split(headingRegex)
  result.shift()
  let parentTitles: string[] = []
  for (let i = 0; i < result.length; i += 3) {
    const level = Number.parseInt(result[i]) - 1
    const heading = result[i + 1]
    const headingResult = headingContentRegex.exec(heading)
    const title = clearHtmlTags(headingResult?.[2] ?? '').trim()
    const anchor = headingResult?.[1] ?? ''
    const content = result[i + 2]
    if (!title || !content)
      continue

    if (level === 0)
      parentTitles = [title]
    else
      parentTitles[level] = title

    let titles = parentTitles.slice(0, level)
    titles[level] = title
    titles = titles.filter(Boolean)
    yield { anchor, titles, text: getSearchableText(content) }
  }
}

/**
 * Extract searchable text from HTML content by removing tags.
 *
 * 通过移除标签从 HTML 内容中提取可搜索文本。
 *
 * @param content - HTML content / HTML 内容
 * @returns Plain text content / 纯文本内容
 */
function getSearchableText(content: string) {
  content = clearHtmlTags(content)
  return content
}

/**
 * Remove all HTML tags from a string.
 *
 * 移除字符串中的所有 HTML 标签。
 *
 * @param str - String containing HTML / 包含 HTML 的字符串
 * @returns String with HTML tags removed / 移除 HTML 标签后的字符串
 */
function clearHtmlTags(str: string) {
  str = str.replace(ignoreHeadingRegex, '')
  // 移除其他所有HTML标签
  return str.replace(/<[^>]*>/g, '')
}

/**
 * Generate HMR (Hot Module Replacement) code for the search index.
 *
 * 为搜索索引生成 HMR（热模块替换）代码。
 *
 * @param m - Module name / 模块名称
 * @returns HMR code string / HMR 代码字符串
 */
function genHmrCode(m: string) {
  const func = `update${m[0].toUpperCase()}${m.slice(1)}`
  return `
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.${m}) {
    __VUE_HMR_RUNTIME__.${func}(${m})
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ ${m} }) => {
    __VUE_HMR_RUNTIME__.${func}(${m})
  })
}
`
}
