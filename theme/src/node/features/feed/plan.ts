import type { App } from 'vuepress'
import type { FeedFormat, ThemeOptions } from '../../../shared/index.js'
import type { FeedChannel, FeedPage } from './collect.js'
import type { ResolvedFeedOptions } from './options.js'
import { objectKeys } from '@pengzhanbo/utils'
import { getThemeOptions } from '../../options.js'
import { logger } from '../../utils/index.js'
import { hasSeriesOptions, normalizeSeriesId } from '../series/options.js'
import { isFeedPage, resolveFeedChannels } from './collect.js'
import { FEED_MIME, normalizeBase, resolveFeedFilePath, toAbsoluteUrl } from './format.js'
import { resolveHostname, resolveLocaleFeedOptions } from './options.js'
import { resolveFeedSeries, resolveLocaleSeriesChannels } from './series.js'

/**
 * A feed file that will really be written.
 *
 * 真正会被写出的 feed 文件。
 */
export interface PlannedFeedFile {
  format: FeedFormat
  /** Path relative to `dist` / 相对于 `dist` 的路径 */
  filepath: string
}

/**
 * A channel and the files it owns after output arbitration.
 *
 * 经过输出仲裁后的频道及其实际拥有的文件。
 */
export interface FeedChannelPlan {
  locale: string
  resolved: ResolvedFeedOptions
  channel: FeedChannel
  /**
   * Written files. A format is dropped when its output path is already claimed
   * by an earlier channel or by an earlier format of the same channel, so a
   * skipped file is never advertised.
   *
   * 实际写出的文件。输出路径已被前序频道或同频道前序格式占用时该格式被丢弃，
   * 从而不会公布指向被跳过文件的链接。
   */
  files: PlannedFeedFile[]
}

/**
 * Plans keyed by the app, invalidated when the theme options object changes.
 *
 * 以应用实例为键的缓存，主题配置对象变化时失效。
 */
const planCache = new WeakMap<App, { options: ThemeOptions, plans: FeedChannelPlan[] }>()

/**
 * Plan every feed channel of the site and arbitrate output paths globally.
 *
 * The arbitration order is the generation order: locales, then within a locale the
 * global / collection channels, then the series channels, then the formats of each
 * channel. The first claim wins, exactly like the files on disk.
 *
 * A series channel keeps its chapter order, so plans can be consumed by the file
 * generation, the subscription URLs and the `<head>` injection alike.
 *
 * 规划全站 feed 频道并全局仲裁输出路径。仲裁顺序与生成顺序一致：
 * 语言 → 该语言内的全局/集合频道 → 系列频道 → 每个频道的格式，先到先得，
 * 与磁盘上的实际结果一致。
 *
 * 系列频道保持篇目顺序，因此文件生成、订阅地址与 `<head>` 注入可以共享同一份结果。
 *
 * @param app - VuePress app / VuePress 应用实例
 * @param options - Theme options / 主题配置
 */
export function planFeedChannels(app: App, options: ThemeOptions): FeedChannelPlan[] {
  const cached = planCache.get(app)
  if (cached?.options === options)
    return cached.plans

  const plans = resolvePlans(app, options)
  planCache.set(app, { options, plans })

  return plans
}

function resolvePlans(app: App, options: ThemeOptions): FeedChannelPlan[] {
  const plans: FeedChannelPlan[] = []
  const written = new Set<string>()
  // 系列只收集一次，供全部语言环境复用 / Collect series once for every locale
  const series = hasSeriesOptions(options) ? resolveFeedSeries(app, options) : []

  for (const locale of objectKeys(options.locales ?? {})) {
    const resolved = resolveLocaleFeedOptions(options, locale)
    if (!resolved)
      continue

    const channels = resolveFeedChannels(app, options, locale, resolved)
    channels.push(...resolveLocaleSeriesChannels(
      app,
      options,
      locale,
      resolved,
      new Set(channels.map(channel => channel.dir)),
      series,
    ))

    for (const channel of channels) {
      const files: PlannedFeedFile[] = []

      for (const format of channel.formats) {
        const filepath = resolveFeedFilePath(channel.dir, resolved.filename[format])

        if (written.has(filepath)) {
          logger.warn(
            `[feed] output conflict: \`${filepath}\`, the ${format} feed of \`${channel.title}\` is skipped.`,
          )
          continue
        }

        written.add(filepath)
        files.push({ format, filepath })
      }

      plans.push({ locale, resolved, channel, files })
    }
  }

  return plans
}

/**
 * Check whether the feed can be produced at all.
 *
 * 判断订阅是否具备生成条件（生产构建、未全站加密、有 hostname）。
 *
 * @param app - VuePress app / VuePress 应用实例
 * @param options - Theme options / 主题配置
 */
function canGenerate(app: App, options: ThemeOptions): boolean {
  return app.env.isBuild && !options.encrypt?.global && !!resolveHostname(options.hostname)
}

/**
 * Resolve the subscription URL of every series channel.
 *
 * The URL points at the first file the channel really owns, so a channel whose
 * output path was taken over by another one is never advertised. URLs are site
 * relative and prefixed with `base`, ready for the client.
 *
 * 解析每个系列频道的订阅地址。地址指向该频道实际拥有的第一个文件，
 * 输出路径被其它频道占用时不会被公布。地址为站点相对路径并已拼接 `base`。
 *
 * @param app - VuePress app / VuePress 应用实例
 * @param options - Theme options / 主题配置
 */
export function resolveSeriesFeedUrls(app: App, options: ThemeOptions): Map<string, string> {
  const urls = new Map<string, string>()

  if (!canGenerate(app, options) || !hasSeriesOptions(options))
    return urls

  const base = normalizeBase(app.options.base || '/')

  for (const plan of planFeedChannels(app, options)) {
    const file = plan.files[0]
    if (!file || !plan.channel.series)
      continue

    urls.set(`${plan.locale}::${plan.channel.series}`, `${base}${file.filepath}`)
  }

  return urls
}

/**
 * Inject `<link rel="alternate">` tags for the series channels a page belongs to.
 *
 * Runs after the pages are created and before their data is written, so the series
 * set is complete and the links reach the generated `<head>`. Only planned files are
 * advertised, and the channel is matched by the locale and the id of the page, so a
 * page never receives the link of another locale.
 *
 * A page may carry links injected for its collection channel in `extendsPage`, and
 * those must be preserved. Deduplication therefore compares the whole link, while a
 * same type link that the theme never produces is treated as a user declaration and
 * keeps the page untouched.
 *
 * 为页面所属的系列频道注入 `<link rel="alternate">`。执行时机在页面创建完成之后、
 * 页面数据写盘之前，因此系列集合是完整的，链接也会进入最终的 `<head>`。
 * 只公布实际会写出的文件，并按页面的语言与系列 id 精确匹配，避免注入其它语言的链接。
 *
 * 页面可能已经带有 `extendsPage` 注入的集合频道链接，这些链接必须保留。
 * 因此去重比较完整链接；而同类型、但并非主题产物的链接被视为作者自行声明，
 * 此时不再改动该页。
 *
 * @param app - VuePress app / VuePress 应用实例
 * @param options - Theme options / 主题配置
 */
export function injectSeriesFeedLinks(app: App, options: ThemeOptions = getThemeOptions()): void {
  if (!canGenerate(app, options) || !hasSeriesOptions(options))
    return

  const plans = planFeedChannels(app, options)
  if (!plans.length)
    return

  const hostname = resolveHostname(options.hostname)!
  const base = app.options.base || '/'
  const channels = new Map<string, FeedChannelPlan>()
  const themeHrefs = new Set<string>()

  for (const plan of plans) {
    for (const file of plan.files)
      themeHrefs.add(toAbsoluteUrl(hostname, base, file.filepath))

    if (plan.resolved.linkTag && plan.channel.series && plan.files.length)
      channels.set(`${plan.locale}::${plan.channel.series}`, plan)
  }

  if (!channels.size)
    return

  for (const page of app.pages as FeedPage[]) {
    const id = normalizeSeriesId(page.frontmatter.series)
    if (!id || !isFeedPage(page, options))
      continue

    // 按语言精确匹配，不做跨语言回退 / Exact locale match, no cross locale fallback
    const plan = channels.get(`${page.pathLocale}::${id}`)
    if (!plan)
      continue

    const head = page.frontmatter.head ??= []

    for (const file of plan.files) {
      const type = FEED_MIME[file.format]
      const href = toAbsoluteUrl(hostname, base, file.filepath)
      const links = head.filter(([tag, attrs]) =>
        tag === 'link' && attrs?.rel === 'alternate' && attrs?.type === type)

      // 作者自行声明的同类型链接优先 / A user declared link of the same type wins
      if (links.some(([, attrs]) => typeof attrs?.href !== 'string' || !themeHrefs.has(attrs.href)))
        continue

      if (links.some(([, attrs]) => attrs?.href === href))
        continue

      head.push(['link', { rel: 'alternate', type, title: plan.channel.title, href }])
    }
  }
}
