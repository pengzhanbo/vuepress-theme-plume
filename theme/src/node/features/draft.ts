import type { App } from 'vuepress'
import type {
  ThemeData,
  ThemeNavItem,
  ThemeSidebarItem,
} from '../../shared/index.js'
import type { MarkdownInfo } from './markdown-source.js'
import type { ThemeSidebarLocales } from './sidebar.js'
import { isArray, isPlainObject, isString, objectEntries } from '@pengzhanbo/utils'
import { ensureEndingSlash, removeLeadingSlash } from '@vuepress/helper'
import { inferRoutePath, isLinkWithProtocol } from 'vuepress/shared'
import { getThemeOptions } from '../options.js'
import { logger, normalizeLink } from '../utils/index.js'
import { cleanSidebarItems } from './sidebar.js'

/**
 * The information of a draft page
 *
 * 草稿页面信息
 */
export interface DraftPageInfo {
  /**
   * The path relative to the source directory, always using `/` as separator
   *
   * 相对源目录的路径，始终使用 `/` 作为分隔符
   */
  relativePath: string
  /**
   * The permalink of the page, or the path inferred from the file path
   *
   * 页面的 permalink，未配置时为按文件路径推导的结果
   */
  permalink: string
  /**
   * The canonical route path, used to match sidebar / navbar links
   *
   * 用于匹配 sidebar / navbar 链接的归一化路由路径
   */
  routePath: string
}

const INDEX_FILE_RE = /^(?:README|readme|index)\.md$/

/**
 * 当前构建收集到的草稿页面
 */
const draftPages = new Map<string, DraftPageInfo>()

/**
 * 清空已收集的草稿页面
 */
export function resetDraftPages(): void {
  draftPages.clear()
}

/**
 * 从 markdown 信息中收集草稿页面
 *
 * 它作为 `MarkdownSource` 的 `write` 钩子注册，且必须排在 autoFrontmatter 之后：
 * 用于匹配 sidebar / navbar 链接的 `permalink` 正是在那里生成的。
 */
export function collectDraftPage(info: MarkdownInfo): void {
  if (info.data.draft !== true)
    return

  const permalink = resolveDraftPermalink(info)

  draftPages.set(info.relativePath, {
    relativePath: info.relativePath,
    permalink,
    routePath: toCanonicalRoute(permalink),
  })
}

/**
 * Get the collected draft pages
 *
 * 获取已收集的草稿页面
 */
export function getDraftPages(): DraftPageInfo[] {
  return [...draftPages.values()]
}

/**
 * 将路径归一化为标准的 route path，使 permalink、文件路径与用户手写链接可以
 * 直接比较。
 *
 * @example
 * ```ts
 * toCanonicalRoute('/config/intro/') // '/config/intro'
 * toCanonicalRoute('/config/intro.html') // '/config/intro'
 * toCanonicalRoute('/config/intro#a') // '/config/intro'
 * ```
 */
export function toCanonicalRoute(pathname: string, base = '/'): string {
  let path = pathname.split(/[?#]/)[0]
  if (base && base !== '/' && path.startsWith(base))
    path = path.slice(base.length)

  if (!path.startsWith('/'))
    path = `/${path}`

  return inferRoutePath(path).replace(/\.html$/, '').replace(/\/$/, '')
}

/**
 * 从生产构建中排除已收集的草稿页面
 *
 * 在 VuePress 解析页面之前，将草稿文件以负模式追加到 `app.options.pagePatterns`，
 * 这些文件因此不会被创建，也不会出现在任何产物中。
 */
export function excludeDraftPages(app: App): void {
  if (!app.env.isBuild)
    return

  const drafts = [...draftPages.values()]
  if (!drafts.length)
    return

  const patterns = [...(app.options.pagePatterns ?? [])]
  for (const draft of drafts) {
    const pattern = `!${draft.relativePath}`
    if (!patterns.includes(pattern))
      patterns.push(pattern)
  }
  app.options.pagePatterns = patterns

  logger.info(
    `Excluded ${drafts.length} draft page(s) from the build:\n${
      drafts.map(draft => `  - ${draft.relativePath}  →  ${draft.permalink}`).join('\n')}`,
  )

  warnDirectoryIndexDrafts(drafts)
}

/**
 * 从已解析的侧边栏配置中移除草稿项
 *
 * @param locales - The sidebar config returned by `getAllSidebar()` / `getAllSidebar()` 返回的侧边栏配置
 * @param base - The base of the site / 站点的基础路径
 */
export function filterDraftSidebar(locales: ThemeSidebarLocales, base = '/'): void {
  const routes = resolveDraftRoutes()
  if (!routes.size)
    return

  for (const [, sidebar] of objectEntries(locales)) {
    if (!isPlainObject(sidebar))
      continue

    for (const [, config] of objectEntries(sidebar)) {
      if (!config || config.items === 'auto' || !isArray(config.items))
        continue

      config.items = cleanSidebarItems(
        filterSidebarItems(config.items, ensureEndingSlash(config.prefix || '/'), routes, base),
      )
    }
  }
}

/**
 * 从写入客户端的主题数据中移除草稿导航项
 *
 * @param themeData - The theme data returned by `resolveThemeData()` / `resolveThemeData()` 返回的主题数据
 * @param base - The base of the site / 站点的基础路径
 */
export function filterDraftNavbar(themeData: ThemeData, base = '/'): void {
  const routes = resolveDraftRoutes()
  if (!routes.size)
    return

  for (const [, localeData] of objectEntries(themeData.locales || {})) {
    if (!localeData || !isArray(localeData.navbar))
      continue

    localeData.navbar = filterNavbarItems(localeData.navbar, '', routes, base)
  }
}

function resolveDraftPermalink(info: MarkdownInfo): string {
  const { data, relativePath } = info
  if (isString(data.permalink))
    return data.permalink

  return inferRoutePath(`/${relativePath}`)
}

function resolveDraftRoutes(): Set<string> {
  return new Set([...draftPages.values()].map(draft => draft.routePath))
}

function isDraftRoute(link: string, routes: Set<string>, base: string): boolean {
  if (!link || isLinkWithProtocol(link))
    return false

  return routes.has(toCanonicalRoute(link))
    || (base !== '/' && routes.has(toCanonicalRoute(link, base)))
}

function filterSidebarItems(
  items: (string | ThemeSidebarItem)[],
  prefix: string,
  routes: Set<string>,
  base: string,
): (string | ThemeSidebarItem)[] {
  const filtered: (string | ThemeSidebarItem)[] = []

  for (const item of items) {
    if (isString(item)) {
      if (!isDraftRoute(normalizeLink(prefix, item), routes, base))
        filtered.push(item)
      continue
    }

    if (!isPlainObject(item))
      continue

    const next: ThemeSidebarItem = { ...item }
    const nextPrefix = ensureEndingSlash(normalizeLink(prefix, next.prefix || next.dir))

    if (isArray(next.items))
      next.items = filterSidebarItems(next.items, nextPrefix, routes, base)

    // `---` 是分隔符链接，不参与匹配
    if (isString(next.link) && !next.link.startsWith('---')) {
      const link = normalizeLink(prefix, next.link)
      if (isDraftRoute(link, routes, base)) {
        // 分组自身的链接指向草稿时，只移除链接，保留子项
        if (isArray(next.items) && next.items.length) {
          logger.warn(`Removed the sidebar group link pointing to the draft page: ${link}`)
          delete next.link
        }
        else {
          continue
        }
      }
    }

    if (isArray(next.items) && next.items.length === 0) {
      if (!next.link)
        continue
      delete next.items
    }

    filtered.push(next)
  }

  return filtered
}

function filterNavbarItems(
  items: ThemeNavItem[],
  prefix: string,
  routes: Set<string>,
  base: string,
): ThemeNavItem[] {
  const filtered: ThemeNavItem[] = []

  for (const item of items) {
    if (isString(item)) {
      if (!isDraftRoute(normalizeLink(prefix, item), routes, base))
        filtered.push(item)
      continue
    }

    if (!isPlainObject(item))
      continue

    const next: Record<string, any> = { ...item }
    const hasItems = isArray(next.items)

    if (hasItems)
      next.items = filterNavbarItems(next.items, normalizeLink(prefix, next.prefix), routes, base)

    if (isString(next.link)) {
      const link = normalizeLink(prefix, next.link)
      if (isDraftRoute(link, routes, base)) {
        if (hasItems && next.items.length) {
          logger.warn(`Removed the navbar group link pointing to the draft page: ${link}`)
          delete next.link
        }
        else {
          continue
        }
      }
    }

    if (hasItems && next.items.length === 0) {
      if (!next.link)
        continue
      delete next.items
    }

    filtered.push(next as ThemeNavItem)
  }

  return filtered
}

function warnDirectoryIndexDrafts(drafts: DraftPageInfo[]): void {
  const localePaths = resolveLocalePaths()

  for (const draft of drafts) {
    const pagePath = resolvePagePathInLocale(draft.relativePath, localePaths)
    if (!pagePath || !INDEX_FILE_RE.test(pagePath.split('/').pop()!))
      continue

    logger.warn(
      `The draft page ${draft.relativePath} is a directory index page, `
      + 'the links to it (such as sidebar group links or collection links) will be broken in the build.',
    )
  }
}

function resolveLocalePaths(): string[] {
  const list = Object.keys(getThemeOptions()?.locales || {}).map(locale => removeLeadingSlash(locale))
  return list.length ? list : ['']
}

function resolvePagePathInLocale(relativePath: string, localePaths: string[]): string | undefined {
  // 优先匹配更长的 locale 前缀，避免 `/zh/` 与 `/` 同时命中。
  const localePath = [...localePaths]
    .sort((a, b) => b.length - a.length)
    .find(path => !path || relativePath.startsWith(path))

  return relativePath.slice(localePath?.length ?? 0)
}
