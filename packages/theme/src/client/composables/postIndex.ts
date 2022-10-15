import { postIndex as postIndexRaw } from '@internal/postIndex'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { PostIndex } from '../../shared/index.js'

const isBoolean = (arg: unknown): boolean => {
  return typeof arg === 'boolean'
}

export type PostIndexRef = Ref<PostIndex>

export const postIndex: PostIndexRef = ref(postIndexRaw)

export const usePostAllIndex = (): PostIndexRef => postIndex

// 在首页文章列表的，默认排除掉 note中的文章，除非显示声明 article
export const usePostIndex = (): PostIndexRef => {
  const postIndexData = [
    ...postIndex.value
      .filter((post) => post.sticky)
      .sort((left, right) => {
        const leftSticky = isBoolean(left.sticky) ? 1 : (left.sticky as number)
        const rightSticky = isBoolean(right.sticky)
          ? 1
          : (right.sticky as number)
        return leftSticky < rightSticky ? 1 : -1
      }),
    ...postIndex.value.filter((post) => !post.sticky),
  ]
  const postList = postIndexData.filter((post) => {
    if (post.isNote) {
      return post.article === true
    } else {
      return post.article !== false
    }
  })
  return ref(postList)
}

export type PostTotalRef = Ref<number>
export const postTotal: PostTotalRef = ref(0)

if (import.meta.hot) {
  __VUE_HMR_RUNTIME__.updatePostIndex = (data: PostIndex) => {
    postIndex.value = data
  }
}
