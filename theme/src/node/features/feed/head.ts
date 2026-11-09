import type { Page, SiteData } from 'vuepress'
import type { FeedFormat, ThemeOptions, ThemePageData } from '../../../shared/index.js'
import type { FeedChannelDescriptor } from './collect.js'
import type { ResolvedFeedOptions } from './options.js'
import { getThemeOptions } from '../../options.js'
import { findCollection } from '../collections/index.js'
import { getLocaleCollections, isFeedPage, resolveChannelDescriptors } from './collect.js'
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
 * Channel descriptor cache, keyed by theme options and locale.
 *
 * `extendsPage` runs once per page; resolving the descriptors on every page
 * would repeat the same work and the same conflict warnings.
 *
 * 频道元信息缓存，按主题配置与语言环境缓存。
 * `extendsPage` 会为每个页面执行一次，重复解析会产生无意义的重复计算与重复警告。
 */
const descriptorCache = new WeakMap<ThemeOptions, Map<string, FeedChannelDescriptor[]>>()

function resolveCachedDescriptors(
  env: ExtendsPageEnv,
  options: ThemeOptions,
  locale: string,
  resolved: ResolvedFeedOptions,
): FeedChannelDescriptor[] {
  let cache = descriptorCache.get(options)
  if (!cache) {
    cache = new Map()
    descriptorCache.set(options, cache)
  }

  let descriptors = cache.get(locale)
  if (!descriptors) {
    descriptors = resolveChannelDescriptors(env.siteData, options, locale, resolved)
    cache.set(locale, descriptors)
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
  const resolved = resolveLocaleFeedOptions(options, page.pathLocale)
  if (!resolved?.linkTag)
    return

  const hostname = resolveHostname(options.hostname)
  if (!hostname)
    return

  if (!isFeedPage(page, options))
    return

  const locale = page.pathLocale
  const collections = getLocaleCollections(options, locale)
  const collection = findCollection(page, options)

  // 页面不属于任何集合，而站点配置了集合时，该页面不在任何 feed 中
  // A page outside every collection is not part of any feed.
  if (!collection && collections.length)
    return

  const descriptors = resolveCachedDescriptors(env, options, locale, resolved)
  let channel = collection
    ? descriptors.find(item => item.collection === collection)
    : descriptors[0]

  // 集合未生成独立频道，但其页面被纳入 feed 时，回退到全局频道
  // Fall back to the global channel when the collection has no dedicated channel.
  if (!channel && collection && resolveCollectionFeed(collection, resolved).include)
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
