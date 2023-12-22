import { blogPostData as blogPostDataRaw } from '@internal/blogData'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { BlogPostData } from '../../shared/index.js'

declare const __VUE_HMR_RUNTIME__: Record<string, any>

export type BlogDataRef<T extends BlogPostData = BlogPostData> = Ref<T>

export const blogPostData: BlogDataRef = ref(blogPostDataRaw)

export const useBlogPostData = <
  T extends BlogPostData = BlogPostData
>(): BlogDataRef<T> => blogPostData as BlogDataRef<T>

if (import.meta.webpackHot || import.meta.hot) {
  __VUE_HMR_RUNTIME__.updateBlogData = (data: BlogPostData) => {
    blogPostData.value = data
  }
}
