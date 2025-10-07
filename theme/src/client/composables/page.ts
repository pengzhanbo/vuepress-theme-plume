import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useData } from './data.js'

export function usePostsPageData(): {
  isPosts: ComputedRef<boolean>
  isPostsLayout: ComputedRef<boolean>
} {
  const { collection, page } = useData<'page', 'post'>()

  const isPosts = computed(() => collection.value?.type === 'post')

  const isPostsLayout = computed(() => {
    const type = page.value.type
    return type === 'posts' || type === 'posts-archives' || type === 'posts-tags' || type === 'posts-categories'
  })

  return {
    isPosts,
    isPostsLayout,
  }
}
