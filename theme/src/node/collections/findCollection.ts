import type { Page } from 'vuepress'
import type { ThemeCollectionItem, ThemeOptions, ThemePageData } from '../../shared'
import { ensureEndingSlash, removeLeadingSlash } from '@vuepress/helper'
import { getThemeConfig } from '../loadConfig/index.js'

/**
 * 查找当前页面所属的 collection
 *
 * @param page - Current page / 当前页面
 * @param options - Theme options, defaults to `getThemeConfig()` / 主题配置，默认从 `getThemeConfig()` 读取
 */
export function findCollection(
  page: Page<ThemePageData>,
  options: ThemeOptions = getThemeConfig(),
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
