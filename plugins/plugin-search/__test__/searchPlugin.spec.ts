import type { App, Page, PluginFunction } from 'vuepress/core'
import { describe, expect, it } from 'vitest'
import { prepareSearchIndex } from '../src/node/prepareSearchIndex.js'
import { searchPlugin } from '../src/node/searchPlugin.js'

/** 索引输出目录，与 prepareSearchIndex.ts 内部常量保持一致。 */
const INDEX_DIR = 'internal/minisearchIndex/'

function makePage(overrides: Partial<Page> = {}): Page {
  return {
    filePath: '/src/docs/guide.md',
    filePathRelative: 'docs/guide.md',
    path: '/guide/',
    pathLocale: '/',
    lang: 'en',
    title: 'Guide',
    frontmatter: {},
    contentRendered: '',
    ...overrides,
  } as unknown as Page
}

/** 构造仅用于建索引的伪 VuePress 应用，保存 app.writeTemp 写入的内容。 */
function createFakeApp(pages: Page[] = []) {
  const files = new Map<string, string>()
  const app = {
    pages,
    env: { isBuild: false, isDev: true, isProd: false, isDebug: false },
    dir: {
      source: (...args: string[]) => ['/src', ...args].join('/'),
      temp: (...args: string[]) => ['/.temp', ...args].join('/'),
    },
    options: { locales: {}, lang: 'en-US' },
    writeTemp: async (filePath: string, content: string) => {
      files.set(filePath, content)
    },
  } as unknown as App

  function readIndex(filename: string) {
    const raw = files.get(`${INDEX_DIR}${filename}`)
    if (!raw)
      throw new Error(`missing index file: ${filename}`)
    return JSON.parse(JSON.parse(raw.slice('export default '.length)))
  }

  return { app, readIndex }
}

describe('searchPlugin > onPageUpdated', () => {
  it('removes the index when a page turns unsearchable', async () => {
    const isSearchable = (page: Page) => page.frontmatter.search !== false
    const { app, readIndex } = createFakeApp([
      makePage({ path: '/guide/', contentRendered: '<p>content</p>' }),
    ])

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable })
    expect(readIndex('searchBox-default.js').documentCount).toBe(1)

    const hooks = (searchPlugin({ isSearchable }) as PluginFunction)(app)
    const pageOld = makePage({ path: '/guide/', contentRendered: '<p>content</p>' })
    const pageNew = makePage({ path: '/guide/', frontmatter: { search: false }, contentRendered: '<p>content</p>' })

    await hooks.onPageUpdated!(app, 'update', pageNew, pageOld)

    expect(readIndex('searchBox-default.js').documentCount).toBe(0)
  })

  it('keeps indexing a page that is still searchable', async () => {
    const isSearchable = (page: Page) => page.frontmatter.search !== false
    const { app, readIndex } = createFakeApp([
      makePage({ path: '/guide/', contentRendered: '<p>old</p>' }),
    ])

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable })

    const hooks = (searchPlugin({ isSearchable }) as PluginFunction)(app)
    const pageOld = makePage({ path: '/guide/', contentRendered: '<p>old</p>' })
    const pageNew = makePage({ path: '/guide/', contentRendered: '<p>new</p>' })

    await hooks.onPageUpdated!(app, 'update', pageNew, pageOld)

    expect(readIndex('searchBox-default.js').documentCount).toBe(1)
  })
})
