import type { PlumeThemeBlogPostItem } from '../../shared/index.js'
import { computed } from 'vue'
import { useLocalePostList } from './blog-data.js'

export type ShortPostItem = Pick<PlumeThemeBlogPostItem, 'title' | 'path' | 'createTime'>

export function useArchives() {
  const list = useLocalePostList()
  const archives = computed(() => {
    const archives: { label: string, list: ShortPostItem[] }[] = []

    list.value.forEach((item) => {
      const createTime = item.createTime?.split(/\s|T/)[0] || ''
      const year = createTime.split('/')[0]
      let current = archives.find(archive => archive.label === year)
      if (!current) {
        current = { label: year, list: [] }
        archives.push(current)
      }
      current.list.push({
        title: item.title,
        path: item.path,
        createTime: createTime.slice(year.length + 1).replace(/\//g, '-'),
      })
    })

    return archives
  })

  return { archives }
}
