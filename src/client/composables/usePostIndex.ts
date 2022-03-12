import { postIndex as postListRaw } from '@internal/postIndex.js'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { PostIndex } from '../../shared'

export type PostIndexRef = Ref<PostIndex>

export const postIndex: PostIndexRef = ref(postListRaw)

export const usePostIndex = (): PostIndexRef => postIndex

if ((import.meta as any).hot) {
  __VUE_HMR_RUNTIME__.updatePostIndex = (data: PostIndex) => {
    postIndex.value = data
  }
}
