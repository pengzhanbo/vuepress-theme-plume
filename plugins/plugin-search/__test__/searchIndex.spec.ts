import type { AsPlainObject } from 'minisearch'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Client-side index loading: shards are fetched in parallel, then parsed one at a
 * time and merged back into a single serialized index.
 *
 * 客户端索引加载：分片并行获取，再逐片解析并合并为同一个序列化索引。
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

const { loadSearchIndex } = await import('../src/client/composables/searchIndex.js')

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

describe('loadSearchIndex', () => {
  beforeEach(() => {
    loadIndexModule.mockReset()
  })

  it('returns undefined when the locale has no index', async () => {
    expect(await loadSearchIndex('/missing/')).toBeUndefined()
    expect(loadIndexModule).not.toHaveBeenCalled()
  })

  it('parses a single-file index without shards', async () => {
    const meta = createMeta()
    loadIndexModule.mockResolvedValue(createModule(meta))

    expect(await loadSearchIndex('/')).toEqual(meta)
  })

  it('merges every shard into the metadata index', async () => {
    loadIndexModule.mockResolvedValue(
      createModule(createMeta(), [
        createEntries(['w0', 'w1']),
        createEntries(['w2']),
      ]),
    )

    const serialized = await loadSearchIndex('/')

    expect(serialized?.index.map(([term]) => term)).toEqual(['w0', 'w1', 'w2'])
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

    const serialized = await loadSearchIndex('/')

    expect(resolved).toEqual(['w1', 'w0'])
    expect(serialized?.index.map(([term]) => term)).toEqual(['w0', 'w1'])
  })
})
