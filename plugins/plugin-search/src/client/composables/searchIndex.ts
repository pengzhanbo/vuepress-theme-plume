import type { ShallowRef } from 'vue'
import { searchIndex } from '@internal/minisearchIndex'
import { shallowRef } from 'vue'

declare const __VUE_HMR_RUNTIME__: Record<string, any>

type SearchIndexData = Record<string, () => Promise<{ default: string }>>

const searchIndexData = shallowRef<SearchIndexData>(searchIndex)

export function useSearchIndex(): ShallowRef<SearchIndexData> {
  return searchIndexData
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateSearchIndex = (data) => {
    searchIndexData.value = data
  }
  __VUE_HMR_RUNTIME__.updateSearchIndex = (data) => {
    searchIndexData.value = data
  }
}
