import type { ComputedRef } from 'vue'
import type { ThemeBlogPostItem } from '../../shared/index.js'
import { computed } from 'vue'
import { useLocalePostList } from './blog-data.js'
import { useData } from './data.js'
import { useThemeData } from './theme-data.js'

export type ShortPostItem = Pick<ThemeBlogPostItem, 'title' | 'path' | 'createTime'>

interface ArchiveItem {
  title: string
  label: string
  list: ShortPostItem[]
}

export function useArchives(): { archives: ComputedRef<ArchiveItem[]> } {
  const themeData = useThemeData()
  const list = useLocalePostList()
  const { theme } = useData()

  const archives = computed<ArchiveItem[]>(() => {
    const archives: { title: string, label: string, list: ShortPostItem[] }[] = []
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
