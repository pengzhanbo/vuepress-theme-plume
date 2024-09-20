import type { Ref } from 'vue'
import type { PlumeThemeBlogPostData } from '../../shared/index.js'
import {
  blogPostData as blogPostDataRaw,
} from '@internal/blogData'
import { computed, ref } from 'vue'
import { usePageLang } from 'vuepress/client'

export type BlogDataRef = Ref<PlumeThemeBlogPostData>

export const blogPostData: BlogDataRef = ref(blogPostDataRaw)

export function usePostList(): BlogDataRef {
  return blogPostData as BlogDataRef
}

export function useLocalePostList() {
  const locale = usePageLang()
  return computed(() => blogPostData.value.filter(item => item.lang === locale.value))
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateBlogPostData = (data: PlumeThemeBlogPostData) => {
    blogPostData.value = data
  }
}
