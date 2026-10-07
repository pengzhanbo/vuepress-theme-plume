import type { AsPlainObject } from 'minisearch'
import MiniSearch from 'minisearch'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createTokenizer } from '../src/shared/index.js'

/**
 * Client-side index loading: shards are fetched in parallel, then merged one at a
 * time and the result is handed to `MiniSearch.loadJSONAsync`.
 *
 * 客户端索引加载：分片并行获取，再逐片合并，最终交给 `MiniSearch.loadJSONAsync`。
 */
const { loadIndexModule } = vi.hoisted(() => ({
  loadIndexModule: vi.fn(),
}))

vi.mock('@internal/minisearchIndex', () => ({
  searchIndex: { '/': loadIndexModule },
}))

// `searchIndex.ts` reads the VuePress global at module scope.
// `searchIndex.ts` 在模块顶层读取 VuePress 全局变量。
vi.stubGlobal('__VUEPRESS_DEV__', false)

const { loadSearchIndexJSON } = await import('../src/client/composables/searchIndex.js')

/** 构造仅包含元数据的序列化索引。 */
function createMeta(): AsPlainObject {
  return {
    documentCount: 1,
    nextId: 2,
    documentIds: { 1: '/a/' },
    fieldIds: { title: 0, titles: 1, text: 2 },
    fieldLength: { 1: [1, 0, 1] },
    averageFieldLength: [1, 0, 1],
    storedFields: { 1: { title: 'A', titles: [] } },
    dirtCount: 0,
    index: [],
    serializationVersion: 2,
  }
}

function createEntries(terms: string[]): AsPlainObject['index'] {
  return terms.map(term => [term, { 2: { 1: 1 } }] as AsPlainObject['index'][number])
}

/** 构造一个索引模块（模块的 `default` 即序列化后的 JSON 字符串）。 */
function createModule(
  meta: AsPlainObject,
  shards: AsPlainObject['index'][] = [],
) {
  return {
    default: JSON.stringify(meta),
    ...(shards.length
      ? {
          shards: shards.map(entries => () =>
            Promise.resolve({ default: JSON.stringify(entries) }),
          ),
        }
      : {}),
  }
}

function termsOf(indexJson: string): string[] {
  return (JSON.parse(indexJson) as AsPlainObject).index.map(([term]) => term)
}

describe('loadSearchIndexJSON', () => {
  beforeEach(() => {
    loadIndexModule.mockReset()
  })

  it('returns undefined when the locale has no index', async () => {
    expect(await loadSearchIndexJSON('/missing/')).toBeUndefined()
    expect(loadIndexModule).not.toHaveBeenCalled()
  })

  it('returns the raw JSON string for a single-file index', async () => {
    const meta = createMeta()
    loadIndexModule.mockResolvedValue(createModule(meta))

    expect(await loadSearchIndexJSON('/')).toBe(JSON.stringify(meta))
  })

  it('merges every shard into the metadata index', async () => {
    loadIndexModule.mockResolvedValue(
      createModule(createMeta(), [
        createEntries(['w0', 'w1']),
        createEntries(['w2']),
      ]),
    )

    const indexJson = await loadSearchIndexJSON('/')

    expect(indexJson).toBeTypeOf('string')
    expect(termsOf(indexJson!)).toEqual(['w0', 'w1', 'w2'])
  })

  it('loads all shards in parallel and merges them in the declared order', async () => {
    const resolved: string[] = []
    const createShard = (name: string, delay: number) => () =>
      new Promise<{ default: string }>((resolve) => {
        setTimeout(() => {
          resolved.push(name)
          resolve({ default: JSON.stringify(createEntries([name])) })
        }, delay)
      })

    loadIndexModule.mockResolvedValue({
      default: JSON.stringify(createMeta()),
      // 第二个分片先返回，但合并顺序仍按数组顺序，保证索引结果确定。
      shards: [createShard('w0', 10), createShard('w1', 0)],
    })

    const indexJson = await loadSearchIndexJSON('/')

    expect(resolved).toEqual(['w1', 'w0'])
    expect(termsOf(indexJson!)).toEqual(['w0', 'w1'])
  })

  it('produces a string that `MiniSearch.loadJSONAsync` can deserialize', async () => {
    loadIndexModule.mockResolvedValue(
      createModule(createMeta(), [createEntries(['w0']), createEntries(['w1'])]),
    )

    const indexJson = await loadSearchIndexJSON('/')
    const index = await MiniSearch.loadJSONAsync(indexJson!, {
      fields: ['title', 'titles', 'text'],
      storeFields: ['title', 'titles'],
      searchOptions: { tokenize: createTokenizer('en') },
    })

    expect(index.search('w1').map(result => result.id)).toEqual(['/a/'])
  })
})
