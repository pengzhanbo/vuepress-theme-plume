import type { ComputedRef, Ref } from 'vue'
import type { ThemePosts } from '../../shared/index.js'
import { postsData as postsDataRaw } from '@internal/postsData'
import { computed, ref } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { ensureEndingSlash, removeLeadingSlash } from 'vuepress/shared'
import { normalizeLink } from '../utils/resolveNavLink.js'
import { useCollection } from './collections.js'

export type PostsDataRef = Ref<Record<string, ThemePosts>>

/**
 * Posts data ref
 *
 * 文章数据引用，包含所有语言环境的文章列表
 */
export const postsData: PostsDataRef = ref(postsDataRaw)

/**
 * Use posts data
 *
 * 获取文章数据
 */
export function usePostsData(): PostsDataRef {
  return postsData as PostsDataRef
}

/**
 * Use locale post list
 *
 * 获取当前语言环境的文章列表
 */
export function useLocalePostList(): ComputedRef<ThemePosts> {
  const collection = useCollection()
  const routeLocale = useRouteLocale()
  return computed(() => {
    if (collection.value) {
      return postsData.value[normalizeLink(routeLocale.value, ensureEndingSlash(removeLeadingSlash(collection.value.dir)))] || []
    }
    return []
  })
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updatePostsData = (data: Record<string, ThemePosts>) => {
    postsData.value = data
  }
}
