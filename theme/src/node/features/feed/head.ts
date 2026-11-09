import type { Page, SiteData } from 'vuepress'
import type { FeedFormat, ThemeOptions, ThemePageData } from '../../../shared/index.js'
import type { FeedChannelDescriptor } from './collect.js'
import type { ResolvedFeedOptions } from './options.js'
import { getThemeOptions } from '../../options.js'
import { findCollection } from '../collections/index.js'
import { getLocaleCollections, isFeedPage, matchesCollection, resolveChannelDescriptors } from './collect.js'
import { toAbsoluteUrl } from './format.js'
import { resolveCollectionFeed, resolveHostname, resolveLocaleFeedOptions } from './options.js'

/**
 * MIME type of every feed format.
 *
 * 每种 feed 格式的 MIME 类型。
 */
const FEED_MIME: Record<FeedFormat, string> = {
  rss: 'application/rss+xml',
  atom: 'application/atom+xml',
  json: 'application/feed+json',
}

/**
 * Cache shared by every `extendsPage` call, keyed by the theme options object.
 *
 * 每个 `extendsPage` 调用共享的缓存，以主题配置对象为键。
 */
interface FeedInjectCache {
  /** Resolved locale options / 已解析的语言环境配置 */
  resolved: Map<string, ResolvedFeedOptions | null>
  /** Channel descriptors per locale / 各语言环境的频道元信息 */
  descriptors: Map<string, FeedChannelDescriptor[]>
  /** Resolved hostname / 已解析的站点源 */
  hostname?: { value: string | undefined }
}

const injectCache = new WeakMap<ThemeOptions, FeedInjectCache>()

function getInjectCache(options: ThemeOptions): FeedInjectCache {
  let cache = injectCache.get(options)
  if (!cache) {
    cache = { resolved: new Map(), descriptors: new Map() }
    injectCache.set(options, cache)
  }
  return cache
}

function resolveCachedFeedOptions(options: ThemeOptions, locale: string): ResolvedFeedOptions | null {
  const cache = getInjectCache(options)
  if (!cache.resolved.has(locale))
    cache.resolved.set(locale, resolveLocaleFeedOptions(options, locale))
  return cache.resolved.get(locale)!
}

function resolveCachedHostname(options: ThemeOptions): string | undefined {
  const cache = getInjectCache(options)
  if (!cache.hostname)
    cache.hostname = { value: resolveHostname(options.hostname) }
  return cache.hostname.value
}

function resolveCachedDescriptors(
  env: ExtendsPageEnv,
  options: ThemeOptions,
  locale: string,
  resolved: ResolvedFeedOptions,
): FeedChannelDescriptor[] {
  const cache = getInjectCache(options)
  let descriptors = cache.descriptors.get(locale)
  if (!descriptors) {
    descriptors = resolveChannelDescriptors(env.siteData, options, locale, resolved)
    cache.descriptors.set(locale, descriptors)
  }
  return descriptors
}

/**
 * Environment passed from the theme hooks into `extendsPageData`.
 *
 * 由主题钩子传入 `extendsPageData` 的环境信息。
 */
export interface ExtendsPageEnv {
  /** App base path / 应用基础路径 */
  base: string
  /** Whether the app is building for production / 是否处于生产构建 */
  isBuild: boolean
  /** Site data / 站点数据 */
  siteData: SiteData
}

/**
 * Inject `<link rel="alternate">` tags for the feeds a page belongs to.
 *
 * Only runs in build mode, because feeds are not generated in dev.
 *
 * 为页面所归属的频道注入 `<link rel="alternate">`。仅在构建模式下执行。
 *
 * @param page - Page / 页面
 * @param env - Extends page environment / 页面扩展环境
 */
export function injectFeedLinks(page: Page<ThemePageData>, env: ExtendsPageEnv): void {
  if (!env.isBuild)
    return

  const options = getThemeOptions()
  const locale = page.pathLocale
  const resolved = resolveCachedFeedOptions(options, locale)
  if (!resolved?.linkTag)
    return

  const hostname = resolveCachedHostname(options)
  if (!hostname)
    return

  if (!isFeedPage(page, options))
    return

  const collections = getLocaleCollections(options, locale)
  const collection = findCollection(page, options)

  if (!collection) {
    if (collections.length)
      return
  }
  else {
    if (!resolveCollectionFeed(collection, resolved).include || !matchesCollection(page, collection, options, locale))
      return
  }

  const descriptors = resolveCachedDescriptors(env, options, locale, resolved)
  let channel = collection
    ? descriptors.find(item => item.collection === collection)
    : descriptors[0]

  // 集合未生成独立频道（如未开启 `perCollection`）时，回退到全局频道
  // Fall back to the global channel when the collection has no dedicated channel.
  if (!channel && collection)
    channel = descriptors[0]

  if (!channel)
    return

  const head = page.frontmatter.head ??= []

  for (const format of channel.formats) {
    const type = FEED_MIME[format]
    if (head.some(([tag, attrs]) => tag === 'link' && attrs?.rel === 'alternate' && attrs?.type === type))
      continue

    const filename = resolved.filename[format]
    head.push(['link', {
      rel: 'alternate',
      type,
      title: channel.title,
      href: toAbsoluteUrl(hostname, env.base, channel.dir ? `${channel.dir}/${filename}` : filename),
    }])
  }
}
