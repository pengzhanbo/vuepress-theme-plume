import type { Page } from 'vuepress'
import type { ThemeCollectionItem, ThemePageData } from '../../shared'
import { removeLeadingSlash } from '@vuepress/helper'
import { getThemeConfig } from '../loadConfig/index.js'

/**
 * 查找当前页面所属的 collection
 */
export function findCollection(page: Page<ThemePageData>): ThemeCollectionItem | undefined {
  const { collections: fallback, locales } = getThemeConfig()
  const locale = page.pathLocale
  let collections = locales?.[locale]?.collections
  if (!collections && locale === '/')
    collections = fallback

  if (!collections || collections.length === 0)
    return

  const pagePath = page.filePathRelative?.slice(locale.length - 1)
  return collections.find(item =>
    pagePath?.startsWith(removeLeadingSlash(item.dir)),
  )
}
