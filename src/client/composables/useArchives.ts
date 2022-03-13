import { ref } from 'vue'
import type { Ref } from 'vue'
import type { PostItemIndex } from '../../shared'
import { dayjs } from '../utils/dayjs'
import { usePostIndex } from './usePostIndex'

export interface ArchivesItem {
  label: string | number
  postList: PostItemIndex[]
}

export type Archives = ArchivesItem[]

export type ArchivesRef = Ref<Archives>

const ArchivesListRaw: Archives = []

usePostIndex().value.forEach((post) => {
  const createTime = dayjs(post.frontmatter.createTime)
  const year = createTime.year()
  let current = ArchivesListRaw.find((arch) => arch.label === year)
  if (!current) {
    current = {
      label: year,
      postList: [],
    }
    ArchivesListRaw.push(current)
  }
  current.postList.push(post)
})

export const archivesList: ArchivesRef = ref(ArchivesListRaw)

export const useArchivesList = (): ArchivesRef => archivesList
