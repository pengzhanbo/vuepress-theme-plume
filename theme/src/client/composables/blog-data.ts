import {
  blogPostData as blogPostDataRaw,
} from '@internal/blogData'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { PlumeThemeBlogPostData } from '../../shared/index.js'

export type BlogDataRef = Ref<PlumeThemeBlogPostData>

export const blogPostData: BlogDataRef = ref(blogPostDataRaw)

export function useBlogPostData(): BlogDataRef {
  return blogPostData as BlogDataRef
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateBlogPostData = (data: PlumeThemeBlogPostData) => {
    blogPostData.value = data
  }
}
