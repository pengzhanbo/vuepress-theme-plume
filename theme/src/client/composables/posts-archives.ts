import type { ComputedRef } from 'vue'
import type { ThemePostsItem } from '../../shared/index.js'
import { computed } from 'vue'
import { useData } from './data.js'
import { useLocalePostList } from './posts-data.js'
import { useThemeData } from './theme-data.js'

export type ShortPostsItem = Pick<ThemePostsItem, 'title' | 'path' | 'createTime'>

interface ArchiveItem {
  title: string
  label: string
  list: ShortPostsItem[]
}

export function useArchives(): { archives: ComputedRef<ArchiveItem[]> } {
  const themeData = useThemeData()
  const list = useLocalePostList()
  const { theme } = useData()

  const archives = computed<ArchiveItem[]>(() => {
    const archives: { title: string, label: string, list: ShortPostsItem[] }[] = []
    const countLocale = theme.value.archiveTotalText || themeData.value.archiveTotalText

    list.value.forEach((item) => {
      const createTime = item.createTime?.split(/\s|T/)[0] || ''
      const year = createTime.split('/')[0]
      let current = archives.find(archive => archive.title === year)
      if (!current) {
        current = { title: year, list: [], label: '' }
        archives.push(current)
      }
      current.list.push({
        title: item.title,
        path: item.path,
        createTime: createTime.slice(year.length + 1).replace(/\//g, '-'),
      })
    })

    archives.forEach((item) => {
      item.label = countLocale?.replace('{count}', item.list.length.toString()) || ''
    })

    return archives
  })

  return { archives }
}
