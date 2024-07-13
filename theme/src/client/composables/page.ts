import { computed } from 'vue'
import { useData } from './data.js'
import { usePostList } from './blog-data.js'

export function useBlogPost() {
  const { page } = useData()
  const postList = usePostList()

  const isBlogPost = computed(() => {
    return postList.value.some(item => item.path === page.value.path)
  })

  return {
    isBlogPost,
  }
}
