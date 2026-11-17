import type { ThemeSeries, ThemeSeriesData } from '../../shared/index.js'
import { removeEndingSlash } from '@vuepress/helper/client'

/**
 * Whether two route paths point at the same page, ignoring the trailing slash.
 *
 * 判断两个路由路径是否指向同一个页面（忽略结尾斜杠）。
 *
 * @param a - First path / 第一个路径
 * @param b - Second path / 第二个路径
 */
export function isSamePath(a: string, b: string): boolean {
  return a === b || removeEndingSlash(a) === removeEndingSlash(b)
}

/**
 * Find a series of one locale whose landing page path matches the current path.
 *
 * 在某个语言下的系列中，查找落地页路径与当前路径一致的系列。
 *
 * @param locale - Series of one locale / 某个语言下的系列
 * @param path - Current route path / 当前路由路径
 */
function findSeriesByPath(
  locale: Record<string, ThemeSeries> | undefined,
  path: string,
): ThemeSeries | null {
  if (!locale)
    return null

  for (const item of Object.values(locale)) {
    if (item.link && isSamePath(item.link, path))
      return item
  }

  return null
}

/**
 * Resolve the series of the current landing page.
 *
 * The path is resolved before the id, and only inside the current locale first: two
 * locales may declare a series with the same id, and the one of another locale must
 * never win by accident. The global fallback only accepts a candidate whose landing
 * page really matches the current path.
 *
 * 解析当前落地页对应的系列。优先按路径、且只在当前语言内查找：
 * 不同语言可能有同名 id 的系列，其它语言的结果不得抢先返回；
 * 全局回退时也只接受落地页路径确实与当前路径一致的候选项。
 *
 * @param data - Series index of every locale / 所有语言的系列索引
 * @param locale - Route locale of the current page / 当前页面的路由语言
 * @param path - Route path of the current page / 当前页面的路由路径
 * @param id - `frontmatter.seriesId` of the current page / 当前页面的 `frontmatter.seriesId`
 * @returns Series of the landing page, `null` when it cannot be resolved
 *          落地页对应的系列，无法解析时为 `null`
 */
export function resolveSeriesPage(
  data: ThemeSeriesData,
  locale: string,
  path: string,
  id?: unknown,
): ThemeSeries | null {
  const current = data[locale]

  // 1. 当前语言下按落地页路径命中：路径唯一，不会与其它语言的同名系列混淆
  const matched = findSeriesByPath(current, path)

  if (matched)
    return matched

  // 2. 当前语言下按 id 命中
  if (typeof id === 'string' && id && current?.[id])
    return current[id]!

  // 3. 全局回退：只接受落地页路径一致的候选项
  for (const key of Object.keys(data)) {
    if (key === locale)
      continue

    const fallback = findSeriesByPath(data[key], path)

    if (fallback)
      return fallback
  }

  return null
}
