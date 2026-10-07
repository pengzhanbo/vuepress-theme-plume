/**
 * Search Index Composable for Search Plugin
 *
 * 搜索插件的搜索索引组合式函数
 *
 * @module plugin-search/client/composables/searchIndex
 */
import type { AsPlainObject } from 'minisearch'
import type { ShallowRef } from 'vue'
import { searchIndex } from '@internal/minisearchIndex'
import { shallowRef } from 'vue'

declare const __VUE_HMR_RUNTIME__: Record<string, any>

/**
 * Shape of a dynamically imported index module.
 *
 * 动态导入的索引模块的形状。
 *
 * Large locales are split into shards: the default export then holds the index
 * metadata (with an empty `index`), and `shards` exposes lazy loaders for the
 * remaining term entries.
 *
 * 较大的语言会被拆分为分片：此时默认导出承载索引元数据（`index` 为空），
 * `shards` 则提供其余词元条目的延迟加载函数。
 */
export interface SearchIndexModule {
  /** Serialized index JSON, or the index metadata when sharded / 序列化索引 JSON；分片时为索引元数据 */
  default: string
  /** Lazy loaders of the remaining shards / 其余分片的延迟加载函数 */
  shards?: (() => Promise<{ default: string }>)[]
}

/**
 * Type definition for search index data.
 *
 * 搜索索引数据的类型定义。
 *
 * Maps locale paths to functions that load the corresponding search index module.
 *
 * 将语言路径映射到加载相应搜索索引模块的函数。
 */
export type SearchIndexData = Record<string, () => Promise<SearchIndexModule>>

/**
 * Reactive reference to the search index data.
 *
 * 搜索索引数据的响应式引用。
 */
const searchIndexData = shallowRef<SearchIndexData>(searchIndex)

/**
 * Get the search index data for all locales.
 *
 * 获取所有语言的搜索索引数据。
 *
 * @returns Shallow ref to the search index data / 搜索索引数据的浅层引用
 * @example
 * const indexData = useSearchIndex()
 * const loadModule = indexData.value['/zh/']
 */
export function useSearchIndex(): ShallowRef<SearchIndexData> {
  return searchIndexData
}

/**
 * Yield to the event loop so rendering is not blocked by consecutive parses.
 *
 * 让出事件循环，避免连续解析分片时阻塞渲染。
 */
function yieldToMainThread(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve))
}

/**
 * Load and assemble the JSON-serialized search index of a locale.
 *
 * 加载并组装某个语言的 JSON 序列化搜索索引。
 *
 * The returned string can be passed to `MiniSearch.loadJSONAsync()`, which
 * deserializes the index in batches without blocking the main thread.
 *
 * 返回的字符串可直接交给 `MiniSearch.loadJSONAsync()`，
 * 它会分批反序列化索引，避免阻塞主线程。
 *
 * Sharded indexes are loaded in parallel and then merged one shard at a time,
 * yielding to the main thread between shards. This keeps the first paint and
 * input handling responsive while a large index is being assembled.
 *
 * 分片索引会并行加载，再逐片合并，并在分片之间让出主线程。
 * 这样在组装大索引时仍能保持首屏渲染与输入的响应性。
 *
 * @param locale - Locale path (e.g. `/`, `/zh/`) / 语言路径
 * @returns Serialized index JSON, or `undefined` when the locale has no index /
 *   序列化索引 JSON；该语言没有索引时返回 `undefined`
 */
export async function loadSearchIndexJSON(locale: string): Promise<string | undefined> {
  const loadIndexModule = searchIndexData.value[locale]
  if (!loadIndexModule)
    return undefined

  const indexModule = await loadIndexModule()

  // 未分片时直接复用原始 JSON 字符串，避免多余的解析与再序列化。
  // Reuse the raw JSON string when the index is not sharded, avoiding a redundant
  // parse and re-serialization.
  if (!indexModule.shards?.length)
    return indexModule.default

  const serialized = JSON.parse(indexModule.default) as AsPlainObject
  const shards = await Promise.all(indexModule.shards.map(loadShard => loadShard()))

  for (const shard of shards) {
    const entries = JSON.parse(shard.default) as AsPlainObject['index']
    // 逐个 push 而非展开参数，避免超大分片触发调用栈/参数上限。
    // Push entries one by one instead of spreading, avoiding argument limits on
    // very large shards.
    for (const entry of entries)
      serialized.index.push(entry)
    await yieldToMainThread()
  }

  // `MiniSearch.loadJSONAsync` 只接受 JSON 字符串，因此合并后需要再序列化一次。
  // `MiniSearch.loadJSONAsync` only accepts a JSON string, so the merged index has
  // to be serialized once more.
  return JSON.stringify(serialized)
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateSearchIndex = (data: SearchIndexData) => {
    searchIndexData.value = data
  }
}
