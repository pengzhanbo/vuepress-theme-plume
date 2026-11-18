import type { App, Page } from 'vuepress'
import type {
  FeedFormat,
  SeriesItemOptions,
  ThemeOptions,
  ThemePageData,
} from '../../../shared/index.js'
import type { ResolvedSeries } from '../series/collect.js'
import type { FeedChannel, FeedPage } from './collect.js'
import type { ResolvedFeedOptions } from './options.js'
import { clampInteger, logger } from '../../utils/index.js'
import { collectSeries } from '../series/collect.js'
import { hasSeriesOptions, resolveSeriesOptions, resolveSeriesPagePath } from '../series/options.js'
import { collectOccupiedPaths } from '../series/pages.js'
import { buildEntries, createChannelDescriptor, isFeedPage } from './collect.js'
import { normalizeFormats, resolveChannelDir, resolveChannelLink } from './options.js'

/**
 * Max entries of a series channel when `limit` is configured.
 *
 * 配置 `limit` 时系列频道的条目上限。
 */
const MAX_SERIES_LIMIT = 200

/**
 * Resolved series level feed configuration.
 *
 * 归一化后的系列级 Feed 配置。
 *
 * @remarks
 * A series has no `include` switch: its chapters already appear in the global and
 * collection channels, so only the dedicated channel is described here.
 *
 * 系列没有 `include` 开关：章节页本就已进入全局与集合频道，这里只描述独立频道。
 */
export interface ResolvedSeriesFeed {
  channel: boolean
  link?: string
  title?: string
  description?: string
  limit?: number
  content?: 'excerpt' | 'full'
  formats?: FeedFormat[]
}

/**
 * Resolve the feed configuration of a series.
 *
 * `undefined` follows `feed.perSeries`, `false` disables the channel and any object
 * (including `true`) opts in explicitly.
 *
 * 解析某个系列的 Feed 配置：`undefined` 跟随 `feed.perSeries`，
 * `false` 关闭频道，`true` / `{}` 显式开启。
 *
 * @param item - Series item options / 系列单项配置
 * @param resolved - Resolved theme level options / 归一化后的主题级配置
 */
export function resolveSeriesFeed(
  item: SeriesItemOptions | undefined,
  resolved: ResolvedFeedOptions,
): ResolvedSeriesFeed {
  const value = item?.feed

  if (value === false)
    return { channel: false }

  if (value === undefined)
    return { channel: resolved.perSeries }

  const options = value === true ? {} : value
  const limit = typeof options.limit === 'number' && Number.isFinite(options.limit)
    ? clampInteger(options.limit, 1, MAX_SERIES_LIMIT)
    : undefined

  return {
    channel: true,
    link: options.link,
    title: options.title,
    description: options.description,
    limit,
    content: options.content === 'full' ? 'full' : options.content === 'excerpt' ? 'excerpt' : undefined,
    formats: options.formats ? normalizeFormats(options.formats) : undefined,
  }
}

/**
 * Collect the series that may own a feed channel.
 *
 * Unlike the landing page pass, a single chapter series is kept: it still gets a
 * feed channel, whose home link falls back to the canonical landing path.
 *
 * 收集可能拥有订阅频道的系列。与落地页阶段不同，单篇系列也会保留：
 * 它依然有频道，主页链接回退到规范落地页路径。
 *
 * @param app - VuePress app / VuePress 应用实例
 * @param options - Theme options / 主题配置
 */
export function resolveFeedSeries(app: App, options: ThemeOptions): ResolvedSeries[] {
  if (!hasSeriesOptions(options))
    return []

  const pages = app.pages as Page<ThemePageData>[]

  return collectSeries(pages, options, {
    isBuild: app.env.isBuild,
    occupiedPaths: collectOccupiedPaths(pages),
    // 告警由 `prepareSeries` 统一输出，频道阶段保持静默
    // Warnings are reported by `prepareSeries`, keep this pass silent
    quiet: true,
  })
}

interface SeriesChannelLink {
  link: string
  /** The link is not declared by the author / 该链接不是作者声明的 */
  fallback: boolean
}

/**
 * Resolve the home link (and therefore the output directory) of a series channel.
 *
 * The series link is followed so that the feed sits next to its landing page; when
 * it is missing, external or unusable, the canonical landing path is used.
 *
 * 解析系列频道的主页链接（同时决定输出目录）。优先跟随系列链接，使 feed
 * 与其落地页处于同一目录；缺失、站外或不可用时回退到规范落地页路径。
 *
 * @param series - Series / 系列
 * @param item - Series item options / 系列单项配置
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 */
function resolveSeriesChannelLink(
  series: ResolvedSeries,
  item: SeriesItemOptions | undefined,
  options: ThemeOptions,
  locale: string,
): SeriesChannelLink | undefined {
  const feed = item?.feed
  const explicit = typeof feed === 'object' && feed !== null ? feed.link : undefined
  const candidates = [explicit, series.link].filter((link): link is string => !!link)
  let unusable = false

  for (const candidate of candidates) {
    const link = resolveChannelLink(candidate, locale)
    if (link)
      return { link, fallback: false }
    unusable = true
  }

  const seriesOptions = resolveSeriesOptions(options, locale)
  if (!seriesOptions)
    return undefined

  // 回退路径只看 `linkPrefix`：`item.link` 要么已被上面的候选覆盖，要么不是站内路径
  // The fallback only uses `linkPrefix`: `item.link` is either already tried or not a site path
  const canonicalItem = item ? { ...item, link: undefined } : undefined
  const canonical = resolveChannelLink(resolveSeriesPagePath(series.id, canonicalItem, seriesOptions, locale), locale)
  if (!canonical)
    return undefined

  if (unusable) {
    logger.warn(
      `[feed] series "${series.id}" (${locale}) link is not a site path, `
      + 'the canonical landing path is used instead.',
    )
  }

  return { link: canonical, fallback: true }
}

/**
 * Resolve the series channels of a locale.
 *
 * Chapter pages keep the series order, so a column reader follows the chapters.
 *
 * 解析某个语言环境的系列频道。章节页保持系列的篇目顺序，专栏读者因此可以顺序阅读。
 *
 * @param app - VuePress app / VuePress 应用实例
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 * @param resolved - Resolved feed options / 归一化后的 Feed 配置
 * @param usedDirs - Output directories already taken / 已占用的输出目录
 * @param series - Precomputed series / 预先收集的系列
 */
export function resolveLocaleSeriesChannels(
  app: App,
  options: ThemeOptions,
  locale: string,
  resolved: ResolvedFeedOptions,
  usedDirs: Set<string>,
  series: ResolvedSeries[] = resolveFeedSeries(app, options),
): FeedChannel[] {
  const seriesOptions = resolveSeriesOptions(options, locale)
  if (!seriesOptions || !series.length)
    return []

  const channels: FeedChannel[] = []

  for (const item of series) {
    if (item.locale !== locale)
      continue

    const seriesItem = seriesOptions.items[item.id]
    const config = resolveSeriesFeed(seriesItem, resolved)
    if (!config.channel)
      continue

    const target = resolveSeriesChannelLink(item, seriesItem, options, locale)
    if (!target) {
      logger.warn(`[feed] invalid link for series \`${item.title}\`, its channel is skipped.`)
      continue
    }

    const dir = resolveChannelDir(target.link)
    if (usedDirs.has(dir)) {
      logger.warn(
        `[feed] channel output path conflict: \`${dir || '/'}\`, the channel of series \`${item.title}\` is skipped. `
        + `Use \`series.items['${item.id}'].feed.link\` to change it.`,
      )
      continue
    }
    usedDirs.add(dir)

    const descriptor = createChannelDescriptor(app.siteData, options, locale, resolved, {
      link: target.link,
      title: config.title || item.title,
      description: config.description || item.description || resolved.channel.description || '',
      formats: config.formats,
      limit: config.limit,
      content: config.content,
      series: item.id,
    })

    // 系列默认不截断：专栏是有限集合，订阅方期待完整的目录
    // Series are not truncated by default: a column is a closed set
    if (config.limit === undefined)
      descriptor.limit = Number.POSITIVE_INFINITY

    const pages = item.chapters
      .map(chapter => chapter.page as FeedPage)
      .filter(page => isFeedPage(page, options))

    channels.push({ ...descriptor, pages })
  }

  return channels
}

/**
 * Build the entries of a series channel, in series order.
 *
 * 以系列篇目顺序构建系列频道的条目。
 *
 * @param channel - Series channel / 系列频道
 * @param app - VuePress app / VuePress 应用实例
 * @param resolved - Resolved feed options / 归一化后的 Feed 配置
 * @param hostname - Site origin / 站点源
 */
export function buildSeriesEntries(
  channel: FeedChannel,
  app: App,
  resolved: ResolvedFeedOptions,
  hostname: string,
): ReturnType<typeof buildEntries> {
  return buildEntries(channel, app, resolved, hostname, { order: 'preserve' })
}
