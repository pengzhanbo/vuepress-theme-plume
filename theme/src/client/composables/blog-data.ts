import type { ComputedRef, Ref } from 'vue'
import type { ThemeBlogPostList } from '../../shared/index.js'
import {
  blogPostData as blogPostDataRaw,
} from '@internal/blogData'
import { computed, ref } from 'vue'
import { usePageLang } from 'vuepress/client'

export type BlogDataRef = Ref<ThemeBlogPostList>

export const blogPostData: BlogDataRef = ref(blogPostDataRaw)

export function usePostList(): BlogDataRef {
  return blogPostData as BlogDataRef
}

export function useLocalePostList(): ComputedRef<ThemeBlogPostList> {
  const locale = usePageLang()
  return computed(() => blogPostData.value.filter(item => item.lang === locale.value))
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateBlogPostData = (data: ThemeBlogPostList) => {
    blogPostData.value = data
  }
}
