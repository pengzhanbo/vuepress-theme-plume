import type { ComputedRef, Ref } from 'vue'
import type { ThemePosts } from '../../shared/index.js'
import { postsData as blogPostDataRaw } from '@internal/postsData'
import { computed, ref } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { removeLeadingSlash } from 'vuepress/shared'
import { normalizeLink } from '../utils/resolveNavLink.js'
import { useCollection } from './collections.js'

export type PostsDataRef = Ref<Record<string, ThemePosts>>

export const postsData: PostsDataRef = ref(blogPostDataRaw)

export function usePostsData(): PostsDataRef {
  return postsData as PostsDataRef
}

export function useLocalePostList(): ComputedRef<ThemePosts> {
  const collection = useCollection()
  const routeLocale = useRouteLocale()
  return computed(() => {
    if (collection.value) {
      return postsData.value[normalizeLink(routeLocale.value, removeLeadingSlash(collection.value.dir))] || []
    }
    return []
  })
}

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updatePostsData = (data: Record<string, ThemePosts>) => {
    postsData.value = data
  }
}
