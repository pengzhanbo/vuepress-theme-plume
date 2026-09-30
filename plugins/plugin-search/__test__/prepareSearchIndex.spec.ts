import type { App, Page } from 'vuepress/core'
import { describe, expect, it } from 'vitest'
import {
  clearHtmlTags,
  createPageSectionItems,
  onSearchIndexRemoved,
  onSearchIndexUpdated,
  prepareSearchIndex,
  splitPageIntoSections,
} from '../src/node/prepareSearchIndex.js'

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

/**
 * 构造一个仅用于建索引的伪 VuePress 应用，
 * 将 app.writeTemp 写入的内容保存在内存中以便断言。
 */
function createFakeApp(pages: Page[] = []) {
  const files = new Map<string, string>()
  const app = {
    pages,
    env: { isBuild: false, isDev: true, isProd: false, isDebug: false },
    writeTemp: async (filePath: string, content: string) => {
      files.set(filePath, content)
    },
  } as unknown as App

  function readIndex(filename: string) {
    const raw = files.get(`${INDEX_DIR}${filename}`)
    if (!raw)
      throw new Error(`missing index file: ${filename}`)
    // 生成的内容形如 `export default "<json>"`，需要解析两次才能得到索引对象。
    return JSON.parse(JSON.parse(raw.slice('export default '.length)))
  }

  return { app, readIndex }
}

describe('splitPageIntoSections', () => {
  it('parses anchors and builds the title hierarchy', () => {
    const html = [
      '<h1><a href="#"><span>Page</span></a></h1>',
      '<h2><a href="#a"><span>A</span></a></h2>',
      '<p>content a</p>',
      '<h3><a href="#b"><span>B</span></a></h3>',
      '<p>content b</p>',
    ].join('\n')

    const sections = [...splitPageIntoSections(html)]
    expect(sections.map(s => s.anchor)).toEqual(['', 'a', 'b'])
    expect(sections.map(s => s.titles)).toEqual([
      ['Page'],
      ['Page', 'A'],
      ['Page', 'A', 'B'],
    ])
  })

  it('continues after a section whose content strips to no text', () => {
    const html = [
      '<h2><a href="#a"><span>A</span></a></h2>',
      '<div></div>',
      '<h2><a href="#b"><span>B</span></a></h2>',
      '<p>content b</p>',
    ].join('\n')

    expect([...splitPageIntoSections(html)].map(s => s.titles.at(-1)))
      .toEqual(['A', 'B'])
  })
})

describe('clearHtmlTags', () => {
  it('removes html tags while keeping the text', () => {
    expect(clearHtmlTags('<p>hello <b>world</b></p>')).toBe('hello world')
  })

  it('removes template blocks', () => {
    expect(clearHtmlTags('<template><div>x</div></template>visible')).toBe('visible')
  })
})

describe('createPageSectionItems', () => {
  it('falls back to the file path when the page has no title', () => {
    const items = [...createPageSectionItems(makePage({ title: '', frontmatter: {} }))]

    expect(items[0].title).toBe('docs/guide.md')
    expect(items.every(item => item.title !== 'undefined')).toBe(true)
  })

  it('indexes every heading section of the page', () => {
    const page = makePage({
      title: 'Page',
      contentRendered: [
        '<h2><a href="#a"><span>A</span></a></h2>',
        '<div></div>',
        '<h2><a href="#b"><span>B</span></a></h2>',
        '<p>content b</p>',
      ].join('\n'),
    })
    const items = [...createPageSectionItems(page)]

    expect(items.map(item => item.title)).toEqual(['Page', 'A', 'B'])
    expect(items.map(item => item.id)).toEqual(['/guide/', '/guide/#a', '/guide/#b'])
  })
})

describe('incremental index updates', () => {
  it('replaces old entries when the page path changes and removes them on delete', async () => {
    const { app, readIndex } = createFakeApp([
      makePage({ path: '/a/', contentRendered: '<p>hello</p>' }),
    ])

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })
    expect(readIndex('searchBox-default.js').documentCount).toBe(1)

    // 同一文件 permalink 变更：旧条目应被清理，而不是残留为死链。
    const updated = makePage({ path: '/b/', contentRendered: '<p>hello</p>' })
    await onSearchIndexUpdated(app, { page: updated, searchOptions: {}, isSearchable: undefined })
    expect(readIndex('searchBox-default.js').documentCount).toBe(1)

    await onSearchIndexRemoved(app, { page: updated, searchOptions: {}, isSearchable: undefined })
    expect(readIndex('searchBox-default.js').documentCount).toBe(0)
  })
})
