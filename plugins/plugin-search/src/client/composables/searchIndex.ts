/**
 * Search Index Composable for Search Plugin
 *
 * 搜索插件的搜索索引组合式函数
 *
 * @module plugin-search/client/composables/searchIndex
 */
import type { ShallowRef } from 'vue'
import { searchIndex } from '@internal/minisearchIndex'
import { shallowRef } from 'vue'

declare const __VUE_HMR_RUNTIME__: Record<string, any>

/**
 * Type definition for search index data.
 *
 * 搜索索引数据的类型定义。
 *
 * Maps locale paths to functions that load the corresponding search index.
 *
 * 将语言路径映射到加载相应搜索索引的函数。
 */
type SearchIndexData = Record<string, () => Promise<{ default: string }>>

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
 * const localeIndex = await indexData.value['/zh/']()
 */
export function useSearchIndex(): ShallowRef<SearchIndexData> {
  return searchIndexData
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateSearchIndex = (data: SearchIndexData) => {
    searchIndexData.value = data
  }
}
