import type { PlumeThemeBlogPostItem } from '../../shared/index.js'
import { computed } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { useLocalePostList } from './blog-data.js'
import { getPresetLocaleData } from './preset-locales.js'

export type ShortPostItem = Pick<PlumeThemeBlogPostItem, 'title' | 'path' | 'createTime'>

export function useArchives() {
  const locale = useRouteLocale()
  const list = useLocalePostList()

  const archives = computed(() => {
    const archives: { title: string, label: string, list: ShortPostItem[] }[] = []
    const countLocale = getPresetLocaleData(locale.value, 'archiveTotal')

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
      item.label = countLocale.replace('{count}', item.list.length.toString())
    })

    return archives
  })

  return { archives }
}
