import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useData } from './data.js'

const postLayouts = ['posts', 'posts-archives', 'posts-tags', 'posts-categories']

/**
 * Use posts page data
 *
 * 获取文章页面数据，判断当前页面是否为文章类型或文章列表布局
 */
export function usePostsPageData(): {
  isPosts: ComputedRef<boolean>
  isPostsLayout: ComputedRef<boolean>
} {
  const { collection, page } = useData<'page', 'post'>()

  const isPosts = computed(() => collection.value?.type === 'post')

  const isPostsLayout = computed(() => postLayouts.includes(page.value.type))

  return {
    isPosts,
    isPostsLayout,
  }
}
