import type { Ref } from 'vue'
import { ref } from 'vue'
import { getColor } from '../utils'
import { usePostAllIndex } from './postIndex'

export interface TagItem {
  tag: string
  color: string
}
export type TagRaw = TagItem[]

export type TagRef = Ref<TagRaw>

export const tagList: TagRef = ref([])

export const useTagList = (): TagRef => {
  const postList = usePostAllIndex().value
  let list: string[] = []
  postList.forEach((post) => {
    list.push(...post.tags)
  })
  list = Array.from(new Set(list))
  tagList.value = list.map((tag) => ({ tag, color: getColor() }))
  return tagList
}
