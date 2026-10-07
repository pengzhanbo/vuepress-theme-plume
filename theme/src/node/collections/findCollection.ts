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

  const pagePath = page.filePathRelative?.slice(locale.length - 1)
  // Resolve to the collection with the longest `dir`, so that nested collections
  // (e.g. `blog` and `blog/sub`) always belong to the most specific one, instead of
  // being determined by the declaration order in the config.
  // A collection with `dir: ''` or `'/'` has the shortest `dir`, so it naturally
  // acts as the fallback and never swallows pages belonging to other collections.
  //
  // 归属到 `dir` 最长的集合，使嵌套集合（如 `blog` 与 `blog/sub`）始终归属于最具体的那个，
  // 而不是由配置中的声明顺序决定。
  // `dir` 为 `''` 或 `'/'` 的集合 `dir` 最短，会自然作为兜底，不会吞掉其它集合的页面。
  return [...collections]
    .sort((a, b) => removeLeadingSlash(b.dir).length - removeLeadingSlash(a.dir).length)
    .find((item) => {
      const dir = removeLeadingSlash(item.dir)
      return pagePath?.startsWith(dir ? ensureEndingSlash(dir) : '')
    })
}
