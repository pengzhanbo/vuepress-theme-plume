import { ref } from 'vue'
import type { Ref } from 'vue'
import { usePostAllIndex } from './postIndex'

export interface ArchiveItem {
  year: string
  children: ArchiveChild[]
}

export interface ArchiveChild {
  date: string
  text: string
  link: string
}

export type ArchiveData = ArchiveItem[]

export type ArchiveListRef = Ref<ArchiveData>

export const useArchive = (): ArchiveListRef => {
  let archiveList: ArchiveData = []
  const postList = usePostAllIndex().value
  postList.forEach((post) => {
    const [year, month, day] = post.createTime.split('-')
    let current = archiveList.find((arch) => arch.year === year)
    if (!current) {
      current = { year, children: [] }
      archiveList.push(current)
    }
    current.children.push({
      date: `${month}-${day}`,
      text: post.title,
      link: post.path,
    })
  })

  archiveList = archiveList.sort((left, right) => {
    return left.year > right.year ? 1 : -1
  })

  return ref(archiveList)
}
