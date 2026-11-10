import type { Page } from 'vuepress'
import type { ThemeCollectionItem, ThemeOptions, ThemePageData } from '../../../shared'
import { ensureEndingSlash, removeLeadingSlash } from '@vuepress/helper'
import { getThemeOptions } from '../../options.js'

/**
 * 读取某个语言环境的集合配置
 *
 * 语言级配置优先，根语言环境未声明时回退到主题级 `collections`。
 *
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 */
export function getLocaleCollections(
  options: ThemeOptions = getThemeOptions(),
  locale = '/',
): ThemeCollectionItem[] {
  const { collections, locales } = options
  const localeCollections = locales?.[locale]?.collections

  if (localeCollections)
    return localeCollections

  return locale === '/' ? collections ?? [] : []
}

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
  const locale = page.pathLocale
  const collections = getLocaleCollections(options, locale)

  if (!collections.length)
    return

  const pagePath = page.filePathRelative?.slice(removeLeadingSlash(locale).length)

  return [...collections]
    .sort((a, b) => removeLeadingSlash(b.dir).length - removeLeadingSlash(a.dir).length)
    .find((item) => {
      const dir = removeLeadingSlash(item.dir)
      return pagePath?.startsWith(dir ? ensureEndingSlash(dir) : '')
    })
}
