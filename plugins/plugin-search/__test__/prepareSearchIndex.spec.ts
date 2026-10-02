import type { App, Page } from 'vuepress/core'
import MiniSearch from 'minisearch'
import { describe, expect, it } from 'vitest'
import {
  clearHtmlTags,
  createPageSectionItems,
  onSearchIndexRemoved,
  onSearchIndexUpdated,
  prepareSearchIndex,
  splitPageIntoSections,
} from '../src/node/prepareSearchIndex.js'
import { createTokenizer } from '../src/shared/index.js'

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

  function readIndexJSON(filename: string) {
    const raw = files.get(`${INDEX_DIR}${filename}`)
    if (!raw)
      throw new Error(`missing index file: ${filename}`)
    // 生成的内容形如 `export default "<json>"`，取回其中的 JSON 字符串。
    return JSON.parse(raw.slice('export default '.length)) as string
  }

  function readIndex(filename: string) {
    return JSON.parse(readIndexJSON(filename))
  }

  return { app, readIndex, readIndexJSON }
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

describe('tokenizer filtering regression', () => {
  it('does not return documents that only match whitespace tokens', async () => {
    const { app, readIndexJSON } = createFakeApp([
      makePage({ path: '/a/', filePathRelative: 'docs/a.md', contentRendered: '<p>hello world foo</p>' }),
      makePage({ path: '/b/', filePathRelative: 'docs/b.md', contentRendered: '<p>再见 bar baz</p>' }),
    ])

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    const index = MiniSearch.loadJSON(readIndexJSON('searchBox-default.js'), {
      fields: ['title', 'titles', 'text'],
      storeFields: ['title', 'titles'],
      searchOptions: { tokenize: createTokenizer('en') },
    })

    // 回归：查询词包含空格时，只命中真正含 "hello"/"world" 的文档。
    expect(index.search('hello world').map(result => result.id)).toEqual(['/a/'])
    // 纯空格查询不应命中任何文档。
    expect(index.search(' ')).toEqual([])
  })

  it.skipIf(typeof Intl.Segmenter !== 'function')('matches Chinese words and ignores CJK punctuation', async () => {
    const { app, readIndexJSON } = createFakeApp([
      makePage({
        path: '/zh/a/',
        pathLocale: '/zh/',
        lang: 'zh',
        filePathRelative: 'docs/zh/a.md',
        title: '指南',
        contentRendered: '<p>你好，世界！欢迎使用。</p>',
      }),
      makePage({
        path: '/zh/b/',
        pathLocale: '/zh/',
        lang: 'zh',
        filePathRelative: 'docs/zh/b.md',
        title: '指南',
        contentRendered: '<p>hello world</p>',
      }),
    ])

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    const index = MiniSearch.loadJSON(readIndexJSON('searchBox-zh.js'), {
      fields: ['title', 'titles', 'text'],
      storeFields: ['title', 'titles'],
      searchOptions: { tokenize: createTokenizer('zh') },
    })

    // 中文整词查询命中包含该词的中文文档。
    expect(index.search('你好').map(result => result.id)).toEqual(['/zh/a/'])
    expect(index.search('欢迎').map(result => result.id)).toEqual(['/zh/a/'])
    // 中文标点查询不应命中任何文档（修复前会因标点词元产生假阳性）。
    expect(index.search('，')).toEqual([])
    expect(index.search('！')).toEqual([])
    // 英文查询命中英文文档，不与中文文档混淆。
    expect(index.search('hello').map(result => result.id)).toEqual(['/zh/b/'])
  })
})
