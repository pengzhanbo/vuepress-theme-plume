/**
 * Series options resolution
 *
 * 系列配置的归一化与路径解析
 */

import type { SeriesItemOptions, SeriesOptions, SeriesOrder, ThemeOptions } from '../../../shared/index.js'
import { ensureEndingSlash, ensureLeadingSlash, isLinkExternal, removeLeadingSlash } from '@vuepress/helper'
import { normalizePath, withBase } from '../../utils/index.js'

/**
 * Series options with all defaults applied.
 *
 * 已应用全部默认值的系列配置。
 */
export interface ResolvedSeriesOptions {
  page: boolean
  linkPrefix: string
  index: boolean
  autoCreate: boolean
  order: SeriesOrder
  nav: boolean
  items: Record<string, SeriesItemOptions>
}

/**
 * Default path prefix of the landing pages.
 *
 * 落地页的默认路径前缀。
 */
const DEFAULT_LINK_PREFIX = '/series/'

/**
 * Read the series option of a locale.
 *
 * 读取某个语言环境的系列配置。
 *
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 */
export function getLocaleSeriesOptions(
  options: ThemeOptions,
  locale: string,
): boolean | SeriesOptions | undefined {
  return options.locales?.[locale]?.series ?? options.series
}

/**
 * Normalize the raw option value: `true` means "enabled with defaults", `false` or a
 * missing value means "disabled".
 *
 * 归一化配置值：`true` 表示使用默认配置启用，`false` 或缺失表示关闭。
 *
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 * @returns Resolved options, or `null` when the feature is disabled
 *          解析后的配置，未启用时为 `null`
 */
export function resolveSeriesOptions(
  options: ThemeOptions,
  locale: string,
): ResolvedSeriesOptions | null {
  const value = getLocaleSeriesOptions(options, locale)

  if (!value)
    return null

  const raw: SeriesOptions = value === true ? {} : value

  return {
    page: raw.page !== false,
    linkPrefix: raw.linkPrefix || DEFAULT_LINK_PREFIX,
    index: raw.index === true,
    autoCreate: raw.autoCreate !== false,
    order: raw.order ?? 'auto',
    nav: raw.nav !== false,
    items: raw.items ?? {},
  }
}

/**
 * Check whether the series feature is enabled for at least one locale.
 *
 * 判断是否至少有一个语言环境启用了系列功能。
 *
 * @param options - Theme options / 主题配置
 */
export function hasSeriesOptions(options: ThemeOptions): boolean {
  if (options.series)
    return true

  return Object.values(options.locales ?? {}).some(locale => !!locale.series)
}

/**
 * Normalize a raw frontmatter `series` value.
 *
 * 归一化 frontmatter 中的 `series` 值。
 *
 * @param value - Raw value / 原始值
 * @returns Trimmed series id, `undefined` when unusable / 去空格后的系列 id，不可用时为 `undefined`
 */
export function normalizeSeriesId(value: unknown): string | undefined {
  if (typeof value !== 'string')
    return undefined

  const id = value.trim()
  return id || undefined
}

/**
 * Convert a series id into a path compatible slug.
 *
 * CJK characters are kept readable while any other separator is collapsed.
 *
 * 将系列 id 转换为可用于路径的 slug。中文保留可读性，其余分隔符折叠为 `-`。
 *
 * @param id - Series id / 系列 id
 */
export function resolveSeriesSlug(id: string): string {
  const slug = id
    .trim()
    .replace(/[^\w\u4E00-\u9FA5-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  return slug || 'series'
}

/**
 * Resolve the landing page path of a series.
 *
 * `item.link` takes precedence over `linkPrefix + slug`, and the locale prefix is
 * always prepended so that the client can look the series up by route locale.
 *
 * 解析系列落地页路径：`item.link` 优先于 `linkPrefix + slug`，
 * 并始终拼接语言前缀，便于客户端按路由语言反查。
 *
 * @param id - Series id / 系列 id
 * @param item - Series item options / 系列单项配置
 * @param options - Resolved series options / 已归一的系列配置
 * @param locale - Route locale / 路由语言
 */
export function resolveSeriesPagePath(
  id: string,
  item: SeriesItemOptions | undefined,
  options: ResolvedSeriesOptions,
  locale: string,
): string {
  const raw = item?.link
    ? removeLeadingSlash(item.link)
    : `${ensureEndingSlash(options.linkPrefix)}${resolveSeriesSlug(id)}`

  return ensureEndingSlash(withBase(ensureEndingSlash(raw), locale))
}

/**
 * Resolve the path of the series overview page, which is the `linkPrefix` root of a
 * locale (e.g. `/series/`, `/zh/series/`).
 *
 * 解析系列总览页路径，即某个语言下 `linkPrefix` 的根路径（如 `/series/`、`/zh/series/`）。
 *
 * @param options - Resolved series options / 已归一的系列配置
 * @param locale - Route locale / 路由语言
 */
export function resolveSeriesIndexPath(options: ResolvedSeriesOptions, locale: string): string {
  return ensureEndingSlash(
    withBase(ensureEndingSlash(removeLeadingSlash(options.linkPrefix)), locale),
  )
}

/**
 * Resolve a user provided link with the locale prefix.
 *
 * The link is kept as written (including its trailing slash or lack of it), because it
 * points at a page the author maintains: forcing a directory-style path would break
 * links such as `/handmade-series.html`. Only the locale prefix is added.
 *
 * External links are returned before any normalization, because `normalizePath` collapses
 * the `//` of a protocol, turning `https://example.com` into `https:/example.com`.
 *
 * 为用户自定义链接拼接语言前缀。链接保持原样（包括结尾是否有斜杠），
 * 因为它指向作者自己维护的页面，强制补成目录地址会破坏 `/xxx.html` 这类链接。
 *
 * 站外链接在任何路径处理之前就返回：`normalizePath` 会折叠协议里的 `//`，
 * 把 `https://example.com` 改写成 `https:/example.com`。
 *
 * @param link - Raw link / 原始链接
 * @param locale - Route locale / 路由语言
 */
export function resolveSeriesLink(link: string, locale: string): string {
  const trimmed = link.trim()

  // 站外链接与协议相对地址原样返回 / External and protocol-relative links are kept as-is
  if (isLinkExternal(trimmed))
    return trimmed

  const normalized = ensureLeadingSlash(normalizePath(trimmed))

  if (locale === '/' || normalized.startsWith(locale))
    return normalized

  return normalizePath(`${locale}${removeLeadingSlash(normalized)}`)
}
