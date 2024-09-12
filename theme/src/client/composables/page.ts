import { computed } from 'vue'
import { usePostList } from './blog-data.js'
import { useData } from './data.js'

export function useBlogPageData() {
  const { page } = useData()
  const postList = usePostList()

  const isBlogPost = computed(() => {
    return postList.value.some(item => item.path === page.value.path)
  })

  const isBlogLayout = computed(() => {
    const type = page.value.type
    return type === 'blog' || type === 'blog-archives' || type === 'blog-tags' || type === 'blog-categories'
  })

  return {
    isBlogPost,
    isBlogLayout,
  }
}
