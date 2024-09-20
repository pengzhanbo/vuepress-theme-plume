import type { App, Page } from 'vuepress/core'
import type { SearchOptions, SearchPluginOptions } from '../shared/index.js'
import MiniSearch from 'minisearch'
import pMap from 'p-map'
import { colors, logger } from 'vuepress/utils'

export interface SearchIndexOptions {
  app: App
  searchOptions: SearchOptions
  isSearchable: SearchPluginOptions['isSearchable']
}

interface IndexObject {
  id: string
  text: string
  title: string
  titles: string[]
}

const SEARCH_INDEX_DIR = 'internal/minisearchIndex/'
const indexByLocales = new Map<string, MiniSearch<IndexObject>>()
const indexCache = new Map<string, IndexObject[]>()

function getIndexByLocale(locale: string, options: SearchIndexOptions['searchOptions']) {
  let index = indexByLocales.get(locale)
  if (!index) {
    index = new MiniSearch<IndexObject>({
      fields: ['title', 'titles', 'text'],
      storeFields: ['title', 'titles'],
      ...options.miniSearch?.options,
    })
    indexByLocales.set(locale, index)
  }
  return index
}

function getIndexCache(filepath: string) {
  let index = indexCache.get(filepath)
  if (!index) {
    index = []
    indexCache.set(filepath, index)
  }
  return index
}

export async function prepareSearchIndex({
  app,
  isSearchable,
  searchOptions,
}: SearchIndexOptions) {
  const start = performance.now()
  const pages = isSearchable ? app.pages.filter(isSearchable) : app.pages
  await pMap(pages, p => indexFile(p, searchOptions), {
    concurrency: 64,
  })
  await writeTemp(app)

  if (app.env.isDebug) {
    logger.info(
      `\n[${colors.green('@vuepress-plume/plugin-search')}] prepare search time spent: ${(performance.now() - start).toFixed(2)}ms`,
    )
  }
}

export async function onSearchIndexUpdated(
  filepath: string,
  {
    app,
    isSearchable,
    searchOptions,
  }: SearchIndexOptions,
) {
  const pages = isSearchable ? app.pages.filter(isSearchable) : app.pages
  if (pages.some(p => p.filePathRelative?.endsWith(filepath))) {
    await indexFile(app.pages.find(p => p.filePathRelative?.endsWith(filepath))!, searchOptions)
    await writeTemp(app)
  }
}

export async function onSearchIndexRemoved(
  filepath: string,
  {
    app,
    isSearchable,
    searchOptions,
  }: SearchIndexOptions,
) {
  const pages = isSearchable ? app.pages.filter(isSearchable) : app.pages
  if (pages.some(p => p.filePathRelative?.endsWith(filepath))) {
    const page = app.pages.find(p => p.filePathRelative?.endsWith(filepath))!
    const fileId = page.path
    const locale = page.pathLocale
    const index = getIndexByLocale(locale, searchOptions)
    const cache = getIndexCache(fileId)
    index.removeAll(cache)
    await writeTemp(app)
  }
}

async function writeTemp(app: App) {
  const records: string[] = []
  for (const [locale] of indexByLocales) {
    const index = indexByLocales.get(locale)!
    const localeName = locale.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'default'
    const filename = `searchBox-${localeName}.js`
    records.push(`${JSON.stringify(locale)}: () => import('@${SEARCH_INDEX_DIR}${filename}')`)
    await app.writeTemp(
      `${SEARCH_INDEX_DIR}${filename}`,
      `export default ${JSON.stringify(
        JSON.stringify(index) ?? {},
      )}`,
    )
  }
  await app.writeTemp(
    `${SEARCH_INDEX_DIR}index.js`,
    `export const searchIndex = {${records.join(',')}}${app.env.isDev ? `\n${genHmrCode('searchIndex')}` : ''}`,
  )
}

async function indexFile(page: Page, options: SearchIndexOptions['searchOptions']) {
  // get file metadata
  const fileId = page.path
  const locale = page.pathLocale
  const index = getIndexByLocale(locale, options)
  const cache = getIndexCache(fileId)
  // retrieve file and split into "sections"
  const html = page.contentRendered
  const sections = splitPageIntoSections(html)

  if (cache && cache.length)
    index.removeAll(cache)

  // add sections to the locale index
  for await (const section of sections) {
    if (!section || !(section.text || section.titles))
      break
    const { anchor, text, titles } = section
    const id = anchor ? [fileId, anchor].join('#') : fileId
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

// eslint-disable-next-line regexp/no-super-linear-backtracking
const headingRegex = /<h(\d*).*?>(<a.*? href="#.*?".*?>.*?<\/a>)<\/h\1>/gi
// eslint-disable-next-line regexp/no-super-linear-backtracking
const headingContentRegex = /<a.*? href="#(.*?)".*?>(.*?)<\/a>/i

/**
 * Splits HTML into sections based on headings
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
    const titles = parentTitles.slice(0, level)
    titles[level] = title
    yield { anchor, titles, text: getSearchableText(content) }
    if (level === 0)
      parentTitles = [title]
    else
      parentTitles[level] = title
  }
}

function getSearchableText(content: string) {
  content = clearHtmlTags(content)
  return content
}

function clearHtmlTags(str: string) {
  return str.replace(/<[^>]*>/g, '')
}

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
