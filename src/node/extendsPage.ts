import type { Page } from '@vuepress/core'
import type { PlumeThemePageData } from '../shared'
import { pageFilter } from './utils/pageFilter'

let uuid = 100
export const extendsPage = (page: Page<PlumeThemePageData>): void => {
  if (!pageFilter(page)) return
  const pagePath = page.filePathRelative
  const category = pagePath
    ?.split('/')
    .slice(0, -1)
    .map((category) => {
      const match = category.match(/^(\d+?)?(?:\.?)([^]+)$/) || []
      return {
        type: Number(match[1]) || uuid++,
        name: match[2],
      }
    })
  page.data.category = category || []
  page.data.sort = parseInt(page.slug.split('.')[0]) || -1
  page.data.isPost = true
  page.slug = page.slug?.replace(/^\d+\./, '')
}
