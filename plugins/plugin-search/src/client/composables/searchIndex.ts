import { searchIndex } from '@internal/minisearchIndex'
import { shallowRef } from 'vue'

declare const __VUE_HMR_RUNTIME__: Record<string, any>

const searchIndexData = shallowRef(searchIndex)

export function useSearchIndex() {
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
