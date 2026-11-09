import type { App, Page, SiteData } from 'vuepress'
import type {
  FeedAuthor,
  FeedChannelOptions,
  FeedFormat,
  ThemeCollectionItem,
  ThemeOptions,
  ThemePageData,
  ThemePageFrontmatter,
} from '../../../shared/index.js'
import type { ResolvedFeedOptions } from './options.js'
import { removeLeadingSlash } from '@vuepress/helper'
import dayjs from 'dayjs'
import { createMatcher, logger } from '../../utils/index.js'
import { findCollection } from '../collections/index.js'
import { isPublicContentPage } from '../content.js'
import { toAbsoluteUrl } from './format.js'
import { resolveChannelDir, resolveChannelLink, resolveCollectionFeed } from './options.js'
import { sanitizeContent } from './sanitize.js'
import { resolveSummary, toPlainText } from './summary.js'

/**
 * Channel metadata, resolved without scanning the pages.
 *
 * 频道元信息，不依赖页面扫描即可解析。
 */
export interface FeedChannelDescriptor {
  locale: string
  /**
   * Channel home route, with locale prefix and without base, e.g. `/en/blog/`.
   *
   * 频道主页路由，已带 locale 前缀且不含 base。
   */
  link: string
  /**
   * Output directory inside `dist`, e.g. `en/blog` (empty for the root global channel).
   *
   * `dist` 内的输出目录，根语言环境的全局频道为空字符串。
   */
  dir: string
  title: string
  description: string
  language: string
  formats: FeedFormat[]
  limit: number
  content: 'excerpt' | 'full'
  author: FeedAuthor[]
  copyright?: string
  ttl?: number
  icon?: string
  image?: string
  hub?: string
  /**
   * Owning collection, `undefined` for the global channel.
   *
   * 所属集合，全局频道为 `undefined`。
   */
  collection?: ThemeCollectionItem
}

/**
 * A page handled by the feed pipeline.
 *
 * The theme frontmatter is required so that `frontmatter.feed`, `tags` and
 * `createTime` are typed instead of falling back to `unknown` from the
 * default `Page` index signature.
 *
 * Feed 流程处理的页面类型。
 * 使用主题 frontmatter 类型，避免 `frontmatter.feed` 等字段退化为 `unknown`。
 */
export type FeedPage = Page<ThemePageData, ThemePageFrontmatter & Record<string, unknown>>

/**
 * A channel with its pages.
 *
 * 包含页面的频道。
 */
export interface FeedChannel extends FeedChannelDescriptor {
  pages: FeedPage[]
}

/**
 * A page represented in a feed.
 *
 * 一个页面在 feed 中的表示。
 */
export interface FeedEntry {
  page: FeedPage
  title: string
  /** Route path without base / 不含 base 的路由路径 */
  path: string
  /** Absolute URL / 绝对地址 */
  url: string
  /** Absolute id / guid / 绝对唯一标识 */
  id: string
  published: Date
  updated: Date
  summary: string
  /** Only in `full` mode / 仅 `full` 模式 */
  html?: string
  tags: string[]
  categories: string[]
  author: FeedAuthor[]
}

/**
 * Read the collections of a locale, with the root fallback used by
 * `findCollection()`.
 *
 * 读取某个语言环境的集合配置，并沿用 `findCollection()` 的根级回退规则。
 *
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 */
export function getLocaleCollections(options: ThemeOptions, locale: string): ThemeCollectionItem[] {
  const collections = options.locales?.[locale]?.collections
  if (collections?.length)
    return collections

  return locale === '/' ? options.collections ?? [] : collections ?? []
}

function localeSiteTitle(siteData: SiteData, locale: string): string {
  return siteData.locales?.[locale]?.title ?? siteData.title ?? ''
}

function localeSiteDescription(siteData: SiteData, locale: string): string {
  return siteData.locales?.[locale]?.description ?? siteData.description ?? ''
}

function localeLanguage(siteData: SiteData, locale: string): string {
  return siteData.locales?.[locale]?.lang ?? siteData.lang ?? ''
}

function clampLimit(value: number | undefined, fallback: number): number {
  const limit = value ?? fallback
  if (!Number.isFinite(limit))
    return fallback
  return Math.min(Math.max(Math.round(limit), 1), 200)
}

function resolveCollectionLink(collection: ThemeCollectionItem): string {
  if (collection.type === 'post')
    return collection.link ?? `/${collection.dir}/`
  return collection.linkPrefix ?? `/${collection.dir}/`
}

function resolveAuthors(
  options: ThemeOptions,
  locale: string,
  siteData: SiteData,
  channel: FeedChannelOptions,
): FeedAuthor[] {
  const author = channel.author
  const list = Array.isArray(author) ? author : author ? [author] : []
  const valid = list.filter(item => item && (item.name || item.email || item.url))
  if (valid.length)
    return valid

  const profile = options.locales?.[locale]?.profile ?? options.profile
  if (profile?.name)
    return [{ name: profile.name }]

  const title = localeSiteTitle(siteData, locale)
  return title ? [{ name: title }] : []
}

function createDescriptor(
  siteData: SiteData,
  themeOptions: ThemeOptions,
  locale: string,
  resolved: ResolvedFeedOptions,
  options: {
    link: string
    title: string
    description: string
    formats?: FeedFormat[]
    limit?: number
    content?: 'excerpt' | 'full'
    collection?: ThemeCollectionItem
  },
): FeedChannelDescriptor {
  const channel = resolved.channel
  const title = options.title || localeSiteTitle(siteData, locale)

  return {
    locale,
    link: options.link,
    dir: resolveChannelDir(options.link),
    title,
    description: options.description || localeSiteDescription(siteData, locale) || title,
    language: channel.language || localeLanguage(siteData, locale),
    formats: options.formats?.length ? options.formats : resolved.formats,
    limit: clampLimit(options.limit, resolved.limit),
    content: options.content ?? resolved.content,
    author: resolveAuthors(themeOptions, locale, siteData, channel),
    copyright: channel.copyright,
    ttl: channel.ttl,
    icon: channel.icon,
    image: channel.image,
    hub: channel.hub,
    collection: options.collection,
  }
}

/**
 * Resolve the channel metadata of a locale.
 *
 * The first descriptor is always the global channel, followed by the collection
 * channels in configuration order. Conflicting output directories are dropped.
 *
 * 解析某个语言环境的频道元信息：第一个始终是全局频道，随后按配置顺序为集合频道；
 * 输出目录冲突的频道会被跳过。
 *
 * @param siteData - Site data / 站点数据
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 * @param resolved - Resolved feed options / 归一化后的 Feed 配置
 */
export function resolveChannelDescriptors(
  siteData: SiteData,
  options: ThemeOptions,
  locale: string,
  resolved: ResolvedFeedOptions,
): FeedChannelDescriptor[] {
  const descriptors: FeedChannelDescriptor[] = []
  const usedDirs = new Set<string>()

  const fallbackLink = locale.endsWith('/') ? locale : `${locale}/`
  let globalLink = resolveChannelLink(resolved.channel.link ?? locale, locale)
  if (!globalLink) {
    logger.warn('[feed] `channel.link` is not a valid site path, the locale root is used instead.')
    globalLink = fallbackLink
  }

  const globalTitle = resolved.channel.title || localeSiteTitle(siteData, locale)
  descriptors.push(createDescriptor(siteData, options, locale, resolved, {
    link: globalLink,
    title: globalTitle,
    description: resolved.channel.description || localeSiteDescription(siteData, locale),
  }))
  usedDirs.add(descriptors[0].dir)

  for (const collection of getLocaleCollections(options, locale)) {
    const config = resolveCollectionFeed(collection, resolved)
    if (!config.include || !config.channel)
      continue

    const link = resolveChannelLink(config.link ?? resolveCollectionLink(collection), locale)
    if (!link) {
      logger.warn(`[feed] invalid link for collection \`${collection.title}\`, its channel is skipped.`)
      continue
    }

    const dir = resolveChannelDir(link)
    if (usedDirs.has(dir)) {
      logger.warn(
        `[feed] channel output path conflict: \`${dir || '/'}\`, the channel of \`${collection.title}\` is skipped. `
        + 'Use `collection.feed.link` to change it.',
      )
      continue
    }
    usedDirs.add(dir)

    const title = config.title || collection.title
    descriptors.push(createDescriptor(siteData, options, locale, resolved, {
      link,
      title,
      description: config.description || resolved.channel.description || localeSiteDescription(siteData, locale),
      formats: config.formats,
      limit: config.limit,
      content: config.content,
      collection,
    }))
  }

  return descriptors
}

/**
 * Check whether a page can be included in feeds.
 *
 * 判断页面是否可以进入 feed。
 *
 * @param page - Page to check / 要检查的页面
 * @param options - Theme options / 主题配置
 */
export function isFeedPage(page: Page<ThemePageData>, options: ThemeOptions): boolean {
  // 单页逃生口，优先级最高 / The page level escape hatch has the highest priority
  if (page.frontmatter.feed === false)
    return false

  return isPublicContentPage(page, options)
}

/**
 * Check whether a page belongs to a collection, honoring `include` / `exclude`.
 *
 * 判断页面是否属于某个集合，并遵循 `include` / `exclude` 规则。
 *
 * @param page - Page / 页面
 * @param collection - Collection / 集合
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 */
export function matchesCollection(
  page: Page<ThemePageData>,
  collection: ThemeCollectionItem,
  options: ThemeOptions,
  locale: string,
): boolean {
  if (findCollection(page, options) !== collection)
    return false

  if (collection.type !== 'post')
    return true

  const { include, exclude } = collection
  if (!include?.length && !exclude?.length)
    return true

  const filePathRelative = page.filePathRelative ?? ''
  const dir = removeLeadingSlash(collection.dir)
  const pagePath = filePathRelative.slice(removeLeadingSlash(locale).length)
  const relative = dir && pagePath.startsWith(dir)
    ? pagePath.slice(dir.length).replace(/^\/+/, '')
    : pagePath

  return createMatcher(include, exclude)(relative)
}

function parseDate(value: unknown): Date | undefined {
  if (!value || value === '0000-00-00')
    return undefined

  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? undefined : value

  if (typeof value !== 'string' && typeof value !== 'number')
    return undefined

  const date = dayjs(value)
  return date.isValid() ? date.toDate() : undefined
}

/**
 * Resolve the published and updated date of a page.
 *
 * 解析页面的发布时间与更新时间；没有任何日期时返回 `undefined`。
 *
 * @param page - Page / 页面
 */
export function resolveEntryDates(page: Page<ThemePageData>): { published: Date, updated: Date } | undefined {
  const git = page.data.git

  const published = parseDate(page.frontmatter.createTime)
    ?? parseDate(page.frontmatter.date)
    ?? parseDate(git?.createdTime)
    ?? parseDate(git?.updatedTime)

  if (!published)
    return undefined

  return {
    published,
    updated: parseDate(git?.updatedTime) ?? published,
  }
}

function resolveStringArray(value: unknown): string[] {
  if (!Array.isArray(value))
    return []
  return value.filter((item): item is string => typeof item === 'string' && !!item)
}

function resolveEntryId(
  guid: string | undefined,
  url: string,
  hostname: string,
  base: string,
): string {
  if (!guid)
    return url

  const value = guid.trim()
  if (!value)
    return url

  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//'))
    return value

  if (value.startsWith('/'))
    return toAbsoluteUrl(hostname, base, value)

  try {
    return new URL(value, url).toString()
  }
  catch {
    return value
  }
}

/**
 * Build the entries of a channel.
 *
 * 构建频道的条目：解析日期、标题、摘要与正文，按发布时间降序、路径升序排序后截断。
 *
 * @param channel - Channel / 频道
 * @param app - VuePress app / VuePress 应用实例
 * @param resolved - Resolved feed options / 归一化后的 Feed 配置
 * @param hostname - Site origin / 站点源
 */
export function buildEntries(
  channel: FeedChannel,
  app: App,
  resolved: ResolvedFeedOptions,
  hostname: string,
): { entries: FeedEntry[], skipped: number } {
  const entries: FeedEntry[] = []
  let skipped = 0

  for (const page of channel.pages) {
    const dates = resolveEntryDates(page)
    if (!dates) {
      skipped++
      continue
    }

    const feed = page.frontmatter.feed
    // YAML 中 `feed:` 留空会解析为 `null`，需要显式排除
    // An empty `feed:` key in YAML resolves to `null`, exclude it explicitly.
    const override = typeof feed === 'object' && feed !== null ? feed : undefined
    const url = toAbsoluteUrl(hostname, app.options.base, page.path)
    const title = toPlainText(override?.title || page.title || page.path)
    const tags = resolveStringArray(page.frontmatter.tags)
    const categories = (page.data.categoryList ?? []).map(item => item.name)

    entries.push({
      page,
      title,
      path: page.path,
      url,
      id: resolveEntryId(override?.guid, url, hostname, app.options.base),
      published: dates.published,
      updated: dates.updated,
      summary: resolveSummary(
        page,
        resolved.excerptLength,
        override?.summary ?? override?.description,
      ),
      html: channel.content === 'full'
        ? sanitizeContent(page.contentRendered ?? '', { url, hostname, base: app.options.base })
        : undefined,
      tags,
      categories,
      author: channel.author,
    })
  }

  entries.sort((a, b) =>
    b.published.getTime() - a.published.getTime()
    || a.path.localeCompare(b.path),
  )

  return { entries: entries.slice(0, channel.limit), skipped }
}

/**
 * Resolve all channels of a locale with their pages.
 *
 * 解析某个语言环境的全部频道及其页面。
 *
 * @param app - VuePress app / VuePress 应用实例
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 * @param resolved - Resolved feed options / 归一化后的 Feed 配置
 */
export function resolveFeedChannels(
  app: App,
  options: ThemeOptions,
  locale: string,
  resolved: ResolvedFeedOptions,
): FeedChannel[] {
  const descriptors = resolveChannelDescriptors(app.siteData, options, locale, resolved)
  const collections = getLocaleCollections(options, locale)
  const included = new Set(
    collections.filter(collection => resolveCollectionFeed(collection, resolved).include),
  )
  const pages = (app.pages as FeedPage[]).filter(page =>
    page.pathLocale === locale && isFeedPage(page, options),
  )

  return descriptors.map((descriptor) => {
    let channelPages: FeedPage[]

    if (descriptor.collection) {
      channelPages = pages.filter(page =>
        matchesCollection(page, descriptor.collection!, options, locale),
      )
    }
    else if (collections.length) {
      channelPages = pages.filter((page) => {
        const collection = findCollection(page, options)
        return !!collection && included.has(collection)
      })
    }
    else {
      // 纯文档站没有集合配置，全局频道回退为所有内容页
      channelPages = pages
    }

    return { ...descriptor, pages: channelPages }
  })
}
