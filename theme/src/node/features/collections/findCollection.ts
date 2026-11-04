import type { Page } from 'vuepress'
import type { ThemeCollectionItem, ThemeOptions, ThemePageData } from '../../../shared'
import { ensureEndingSlash, removeLeadingSlash } from '@vuepress/helper'
import { getThemeOptions } from '../../options.js'

/**
 * 查找当前页面所属的 collection
 *
 * @param page - Current page / 当前页面
 * @param options - Theme options / 主题配置
 */
export function findCollection(
  page: Page<ThemePageData>,
  options: ThemeOptions = getThemeOptions(),
): ThemeCollectionItem | undefined {
  const { collections: fallback, locales } = options
  const locale = page.pathLocale
  let collections = locales?.[locale]?.collections
  if (!collections && locale === '/')
    collections = fallback

  if (!collections || collections.length === 0)
    return

  const pagePath = page.filePathRelative?.slice(removeLeadingSlash(locale).length)

  return [...collections]
    .sort((a, b) => removeLeadingSlash(b.dir).length - removeLeadingSlash(a.dir).length)
    .find((item) => {
      const dir = removeLeadingSlash(item.dir)
      return pagePath?.startsWith(dir ? ensureEndingSlash(dir) : '')
    })
}
