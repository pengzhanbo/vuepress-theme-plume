import type { AsPlainObject } from 'minisearch'
import type { App, Page } from 'vuepress/core'
import MiniSearch from 'minisearch'
import { describe, expect, it, vi } from 'vitest'
import { logger } from 'vuepress/utils'
import {
  buildIndexFiles,
  clearHtmlTags,
  createPageSectionItems,
  onSearchIndexRemoved,
  onSearchIndexUpdated,
  prepareSearchIndex,
  prepareSearchIndexInBackground,
  splitPageIntoSections,
  splitSearchIndex,
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
function createFakeApp(pages: Page[] = [], failWritesFor: Set<string> = new Set()) {
  const files = new Map<string, string>()
  /** 记录成功写入的顺序，用于断言写放大优化是否生效。 */
  const writes: string[] = []
  const app = {
    pages,
    env: { isBuild: false, isDev: true, isProd: false, isDebug: false },
    writeTemp: async (filePath: string, content: string) => {
      if (failWritesFor.has(filePath))
        throw new Error(`failed to write ${filePath}`)
      writes.push(filePath)
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

  return { app, readIndex, readIndexJSON, writes, failWritesFor, files }
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

  it('drops stale ancestors when heading levels jump back and forth', () => {
    const html = [
      '<h1><a href="#"><span>Page</span></a></h1>',
      '<h2><a href="#a"><span>A</span></a></h2>',
      '<h3><a href="#b"><span>B</span></a></h3>',
      '<h2><a href="#a2"><span>A2</span></a></h2>',
      '<h5><a href="#e"><span>E</span></a></h5>',
      '<p>content e</p>',
    ].join('\n')

    // h5 的祖先链不应残留上一个分支的 h3 "B"。
    expect([...splitPageIntoSections(html)].map(s => s.titles)).toEqual([
      ['Page'],
      ['Page', 'A'],
      ['Page', 'A', 'B'],
      ['Page', 'A2'],
      ['Page', 'A2', 'E'],
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

describe('searchable text truncation', () => {
  it('drops content beyond the maximum indexed length', async () => {
    const { app, readIndexJSON } = createFakeApp([
      makePage({
        path: '/long/',
        // 前半段在阈值内，末尾的 tailword 超出 8000 字符边界。
        contentRendered: `<p>headword ${'lorem '.repeat(1600)}tailword</p>`,
      }),
    ])

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    const index = MiniSearch.loadJSON(readIndexJSON('searchBox-default.js'), {
      fields: ['title', 'titles', 'text'],
      storeFields: ['title', 'titles'],
      searchOptions: { tokenize: createTokenizer('en') },
    })

    expect(index.search('headword').map(result => result.id)).toEqual(['/long/'])
    expect(index.search('tailword')).toEqual([])
  })
})

describe('dev write amplification', () => {
  it('only rewrites the changed locale file and keeps index.js untouched', async () => {
    const { app, writes } = createFakeApp([
      makePage({ path: '/a/', filePathRelative: 'docs/a.md', contentRendered: '<p>hello</p>' }),
    ])
    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })
    writes.length = 0

    const updated = makePage({ path: '/a/', filePathRelative: 'docs/a.md', contentRendered: '<p>hello world</p>' })
    await onSearchIndexUpdated(app, { page: updated, searchOptions: {}, isSearchable: undefined })

    // 仅内容变化的 locale 文件被重写；index.js 的映射未变，无需重写。
    expect(writes).toEqual([`${INDEX_DIR}searchBox-default.js`])
  })

  it('retries a write when the previous attempt failed', async () => {
    const { app, writes, failWritesFor } = createFakeApp([
      makePage({ path: '/a/', filePathRelative: 'docs/a.md', contentRendered: '<p>hello</p>' }),
    ])
    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })
    writes.length = 0

    const updated = makePage({ path: '/a/', filePathRelative: 'docs/a.md', contentRendered: '<p>hello world</p>' })
    const localeFile = `${INDEX_DIR}searchBox-default.js`

    // 写入失败时不得提交指纹，否则后续相同内容会被误判为已写入。
    failWritesFor.add(localeFile)
    await expect(
      onSearchIndexUpdated(app, { page: updated, searchOptions: {}, isSearchable: undefined }),
    ).rejects.toThrow()
    expect(writes).toEqual([])

    // 恢复写入后，相同内容应被重新写入而不是跳过。
    failWritesFor.clear()
    await onSearchIndexUpdated(app, { page: updated, searchOptions: {}, isSearchable: undefined })
    expect(writes).toEqual([localeFile])
  })
})

describe('index preparation options', () => {
  it('logs the elapsed time in debug mode', async () => {
    const { app } = createFakeApp([makePage({ contentRendered: '<p>hello</p>' })])
    app.env.isDebug = true
    const info = vi.spyOn(logger, 'info').mockImplementation(() => {})

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    expect(info).toHaveBeenCalledWith(expect.stringContaining('prepare search time spent'))
    info.mockRestore()
  })

  it('clears the in-memory caches after a build', async () => {
    const { app } = createFakeApp([makePage({ contentRendered: '<p>hello</p>' })])
    app.env.isBuild = true

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    // 构建完成后缓存被清空，再次构建仍能正确重建索引。
    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })
  })

  it('does not emit the HMR helper outside dev mode', async () => {
    const { app, files } = createFakeApp([makePage({ contentRendered: '<p>hello</p>' })])
    app.env.isDev = false

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    expect(files.get(`${INDEX_DIR}index.js`)).not.toContain('import.meta.hot')
  })

  it('skips pages that cannot be indexed', async () => {
    const { app, writes } = createFakeApp([
      makePage({ path: '/no-file/', filePath: undefined, contentRendered: '<p>a</p>' }),
      makePage({ path: '/hidden/', filePathRelative: 'hidden.md', frontmatter: { search: false }, contentRendered: '<p>b</p>' }),
      makePage({ path: '/excluded/', filePathRelative: 'excluded.md', contentRendered: '<p>c</p>' }),
    ])

    await prepareSearchIndex({
      app,
      searchOptions: {},
      isSearchable: page => page.path !== '/excluded/',
    })

    // 没有任何可索引页面时不会产生 locale 索引文件。
    expect(writes.some(file => file.endsWith('index.js'))).toBe(true)
    expect(writes.some(file => file.includes('searchBox-'))).toBe(false)
  })

  it('indexes a page without a relative path using its permalink', async () => {
    const { app, readIndex } = createFakeApp([
      makePage({ path: '/norel/', filePathRelative: undefined, contentRendered: '<p>hello</p>' }),
    ])

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    // 缺乏相对路径时以 permalink 作为缓存键，索引仍能建立。
    expect(readIndex('searchBox-default.js').documentCount).toBe(1)
  })
})

describe('incremental update guards', () => {
  it('skips updating an unsearchable page', async () => {
    const { app, readIndex } = createFakeApp([
      makePage({ path: '/a/', filePathRelative: 'a.md', contentRendered: '<p>hello</p>' }),
    ])
    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    await onSearchIndexUpdated(app, {
      page: makePage({ path: '/a/', filePathRelative: 'a.md', frontmatter: { search: false }, contentRendered: '<p>changed</p>' }),
      searchOptions: {},
      isSearchable: page => page.frontmatter.search !== false,
    })

    // 变为不可搜索的页面不应被重新写入索引。
    expect(readIndex('searchBox-default.js').documentCount).toBe(1)
  })

  it('skips removing an unsearchable page', async () => {
    const { app, readIndex } = createFakeApp([
      makePage({ path: '/a/', filePathRelative: 'a.md', contentRendered: '<p>hello</p>' }),
    ])
    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    await onSearchIndexRemoved(app, {
      page: makePage({ path: '/a/', filePathRelative: 'a.md', frontmatter: { search: false } }),
      searchOptions: {},
      isSearchable: page => page.frontmatter.search !== false,
    })

    expect(readIndex('searchBox-default.js').documentCount).toBe(1)
  })

  it('skips removing a page without a relative path', async () => {
    const { app } = createFakeApp()

    await onSearchIndexRemoved(app, {
      page: makePage({ filePathRelative: undefined }),
      searchOptions: {},
      isSearchable: undefined,
    })
  })

  it('skips removal when there is no cached index for the file', async () => {
    const { app } = createFakeApp()

    await onSearchIndexRemoved(app, {
      page: makePage({ filePathRelative: 'never-indexed.md' }),
      searchOptions: {},
      isSearchable: undefined,
    })
  })
})

describe('index error handling', () => {
  it('logs an error when the background preparation fails', async () => {
    const { app } = createFakeApp(
      [makePage({ contentRendered: '<p>hello</p>' })],
      new Set([`${INDEX_DIR}index.js`]),
    )
    const error = vi.spyOn(logger, 'error').mockImplementation(() => {})

    prepareSearchIndexInBackground({ app, searchOptions: {}, isSearchable: undefined })

    await vi.waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('failed to prepare search index'),
        expect.anything(),
      )
    })
    error.mockRestore()
  })

  it('warns about duplicate permalinks and heading anchors', async () => {
    const { app } = createFakeApp([
      makePage({ path: '/dup/', filePathRelative: 'a.md', contentRendered: '<h2><a href="#sec"><span>Sec</span></a></h2><p>x</p>' }),
      makePage({ path: '/dup/', filePathRelative: 'b.md', contentRendered: '<h2><a href="#sec"><span>Sec</span></a></h2><p>x</p>' }),
    ])
    const error = vi.spyOn(logger, 'error').mockImplementation(() => {})

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    expect(error).toHaveBeenCalledWith(expect.stringContaining('duplicate page permalink'))
    expect(error).toHaveBeenCalledWith(expect.stringContaining('duplicate heading anchor'))
    error.mockRestore()
  })

  it('logs an error when stale entries cannot be removed', async () => {
    const { app } = createFakeApp([
      makePage({ path: '/en/x/', pathLocale: '/', lang: 'en', filePathRelative: 'x.md', contentRendered: '<p>x</p>' }),
      makePage({ path: '/zh/x/', pathLocale: '/zh/', lang: 'zh', filePathRelative: 'x.md', contentRendered: '<p>x</p>' }),
    ])
    const error = vi.spyOn(logger, 'error').mockImplementation(() => {})

    await prepareSearchIndex({ app, searchOptions: {}, isSearchable: undefined })

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('failed to remove stale index entries'),
      expect.anything(),
    )
    error.mockRestore()
  })
})

describe('section splitting boundaries', () => {
  it('skips a heading whose anchor has no title span', () => {
    const html = '<h2><a href="#x">X</a></h2><p>y</p><h2><a href="#z"><span>Z</span></a></h2><p>z</p>'

    expect([...splitPageIntoSections(html)].map(section => section.anchor)).toEqual(['z'])
  })

  it('skips a heading with no title or no content', () => {
    const html = [
      '<h2><a href="#a"><span></span></a></h2><p>a</p>',
      '<h2><a href="#b"><span>B</span></a></h2>',
    ].join('')

    // 空标题与末尾无内容的章节都应被跳过，且不终止后续解析。
    expect([...splitPageIntoSections(html)]).toEqual([])
  })
})

describe('createPageSectionItems title fallbacks', () => {
  it('prefers the frontmatter title', () => {
    const page = makePage({ title: 'Page', frontmatter: { title: 'FM' }, contentRendered: '<p>x</p>' })

    expect([...createPageSectionItems(page)][0].title).toBe('FM')
  })

  it('handles a page without any title information', () => {
    const page = makePage({ title: '', filePathRelative: undefined, frontmatter: {} })

    // 所有标题来源都缺失时不应抛错，也不产生章节项。
    expect([...createPageSectionItems(page)]).toEqual([])
  })
})

/** 构造一个可直接交给 MiniSearch 反序列化的最小索引对象。 */
function createSerializedIndex(termCount: number): AsPlainObject {
  return {
    documentCount: 1,
    nextId: 2,
    documentIds: { 1: '/a/' },
    fieldIds: { title: 0, titles: 1, text: 2 },
    fieldLength: { 1: [1, 0, 1] },
    averageFieldLength: [1, 0, 1],
    storedFields: { 1: { title: 'A', titles: [] } },
    dirtCount: 0,
    index: Array.from({ length: termCount }, (_, i) => [
      `w${i}`,
      { 2: { 1: 1 } },
    ]) as AsPlainObject['index'],
    serializationVersion: 2,
  }
}

/** 取出 `export default "<json>"` 文件中的 JSON 字符串并解析两层。 */
function parseDefaultExport(content: string) {
  const [defaultLine] = content.split('\n')
  return JSON.parse(JSON.parse(defaultLine.slice('export default '.length)))
}

describe('search index sharding', () => {
  it('keeps a small index in a single file', () => {
    const serialized = createSerializedIndex(5)
    const { meta, shards } = splitSearchIndex(serialized, 5)

    // 未超过阈值时不分片，且元数据就是原索引本身（保持旧格式）。
    expect(shards).toEqual([])
    expect(meta).toBe(serialized)
    expect(Object.keys(buildIndexFiles('default', serialized, 5)))
      .toEqual(['searchBox-default.js'])
  })

  it('does not shard for a non-positive shard size', () => {
    expect(splitSearchIndex(createSerializedIndex(50), 0).shards).toEqual([])
    expect(splitSearchIndex(createSerializedIndex(50), -1).shards).toEqual([])
  })

  it('splits a large index into shard files and moves entries out of the metadata file', () => {
    const serialized = createSerializedIndex(25)
    const files = buildIndexFiles('zh', serialized, 10)

    expect(Object.keys(files).sort()).toEqual([
      'searchBox-zh-0.js',
      'searchBox-zh-1.js',
      'searchBox-zh-2.js',
      'searchBox-zh.js',
    ])

    // 元数据文件保留文档信息，但词元条目全部移入分片。
    const meta = parseDefaultExport(files['searchBox-zh.js'])
    expect(meta.index).toEqual([])
    expect(meta.documentCount).toBe(1)

    // 客户端依靠导出的 `shards` 数组按需加载各分片。
    expect(files['searchBox-zh.js']).toContain(
      `export const shards = [() => import('@internal/minisearchIndex/searchBox-zh-0.js'), () => import('@internal/minisearchIndex/searchBox-zh-1.js'), () => import('@internal/minisearchIndex/searchBox-zh-2.js')]`,
    )

    expect(parseDefaultExport(files['searchBox-zh-0.js'])).toHaveLength(10)
    expect(parseDefaultExport(files['searchBox-zh-2.js'])).toHaveLength(5)
  })

  it('rebuilds an equivalent index by concatenating the shards', () => {
    const serialized = createSerializedIndex(25)
    const files = buildIndexFiles('zh', serialized, 10)

    const meta = parseDefaultExport(files['searchBox-zh.js']) as AsPlainObject
    for (const name of ['searchBox-zh-0.js', 'searchBox-zh-1.js', 'searchBox-zh-2.js'])
      meta.index.push(...parseDefaultExport(files[name]) as AsPlainObject['index'])

    // 分片顺序拼接后与原始词元条目完全一致，索引行为不变。
    expect(meta.index).toEqual(serialized.index)

    const index = MiniSearch.loadJS(meta, {
      fields: ['title', 'titles', 'text'],
      storeFields: ['title', 'titles'],
      searchOptions: { tokenize: createTokenizer('en') },
    })
    expect(index.search('w3').map(result => result.id)).toEqual(['/a/'])
    expect(index.search('w24').map(result => result.id)).toEqual(['/a/'])
  })

  it('normalizes the locale name into the shard file names', () => {
    const files = buildIndexFiles('zh-CN_guide', createSerializedIndex(4), 2)

    expect(Object.keys(files).sort()).toEqual([
      'searchBox-zh-CN_guide-0.js',
      'searchBox-zh-CN_guide-1.js',
      'searchBox-zh-CN_guide.js',
    ])
  })
})
