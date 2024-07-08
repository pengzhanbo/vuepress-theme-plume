import { articleTagColors } from '@internal/articleTagColors'
import { type Ref, ref } from 'vue'

export type TagColors = Record<string, string>

export type TagColorsRef = Ref<TagColors>

const tagColorsRef: TagColorsRef = ref(articleTagColors)

export const useTagColors = (): TagColorsRef => tagColorsRef

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateArticleTagColors = (data: TagColors) => {
    tagColorsRef.value = data
  }
}
