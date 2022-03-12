import type { Ref } from 'vue'
import { ref } from 'vue'
import { usePostIndex } from './usePostIndex'

export type TagsItem = {
  tag: string
  count: number
}

export type Tags = TagsItem[]

export type TagsRef = Ref<Tags>

const tagsObj: Record<string, number> = {}
usePostIndex().value.forEach((post) => {
  ;(post.frontmatter.tags || []).forEach((t) => {
    if (!tagsObj[t]) {
      tagsObj[t] = 1
    } else {
      tagsObj[t] += 1
    }
  })
})

const tagsRaw: Tags = Object.keys(tagsObj)
  .map((key) => ({
    tag: key,
    count: tagsObj[key],
  }))
  .sort((left, right) => (left.count <= right.count ? 1 : -1))

export const tags: TagsRef = ref(tagsRaw)

export const useTags = (): TagsRef => tags
