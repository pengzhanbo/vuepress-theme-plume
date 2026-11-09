import type {
  FeedChannelOptions,
  FeedCollectionOptions,
  FeedFilenames,
  FeedFormat,
  FeedOptions,
  ThemeCollectionItem,
  ThemeOptions,
} from '../../../shared/index.js'
import { isLinkWithProtocol } from '@vuepress/helper'
import { logger, withBase } from '../../utils/index.js'

/**
 * Supported feed formats, in the order used to resolve filename conflicts.
 *
 * 支持的 feed 格式，顺序用于解决文件名冲突。
 */
export const FEED_FORMATS: FeedFormat[] = ['rss', 'atom', 'json']

/**
 * Default output filenames.
 *
 * 默认输出文件名。
 */
export const DEFAULT_FEED_FILENAMES: Required<FeedFilenames> = {
  rss: 'feed.xml',
  atom: 'atom.xml',
  json: 'feed.json',
}

/**
 * Options with every default applied.
 *
 * 已应用全部默认值的配置。
 */
export interface ResolvedFeedOptions {
  perCollection: boolean
  includeDocCollections: boolean
  content: 'excerpt' | 'full'
  limit: number
  excerptLength: number
  formats: FeedFormat[]
  filename: Required<FeedFilenames>
  channel: FeedChannelOptions
  linkTag: boolean
  debug: boolean
}

/**
 * Resolved collection level feed configuration.
 *
 * 归一化后的集合级配置。
 */
export interface ResolvedCollectionFeed {
  include: boolean
  channel: boolean
  link?: string
  title?: string
  description?: string
  limit?: number
  content?: 'excerpt' | 'full'
  formats?: FeedFormat[]
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value))
    return min
  return Math.min(Math.max(value, min), max)
}

/**
 * Deduplicate and filter feed formats.
 *
 * 去重并过滤非法的输出格式。
 *
 * @param formats - Raw formats / 原始格式
 */
export function normalizeFormats(formats?: unknown): FeedFormat[] {
  if (!Array.isArray(formats))
    return []

  const result: FeedFormat[] = []
  for (const item of formats) {
    if (!FEED_FORMATS.includes(item as FeedFormat)) {
      logger.warn(`[feed] unknown output format \`${String(item)}\` has been ignored.`)
      continue
    }
    if (!result.includes(item as FeedFormat))
      result.push(item as FeedFormat)
  }
  return result
}

/**
 * Check whether a value can be used as an output filename.
 *
 * 判断一个值能否作为输出文件名（禁止目录与路径穿越）。
 */
function isValidFilename(value: unknown): value is string {
  return typeof value === 'string'
    && /^[\w.-]+$/.test(value)
    && value !== '.'
    && !value.includes('..')
}

/**
 * Normalize the theme level feed options.
 *
 * 归一化主题级 Feed 配置。
 *
 * @param options - Raw options / 原始配置
 * @returns Resolved options, or `null` when unusable / 解析后的配置，不可用时为 `null`
 */
export function normalizeFeedOptions(options: FeedOptions): ResolvedFeedOptions | null {
  const filename: Required<FeedFilenames> = { ...DEFAULT_FEED_FILENAMES }

  for (const format of FEED_FORMATS) {
    const value = options.filename?.[format]
    if (value === undefined)
      continue
    if (!isValidFilename(value)) {
      logger.warn(`[feed] invalid filename \`${String(value)}\` for \`${format}\`, the default value is used.`)
      continue
    }
    filename[format] = value
  }

  const usedFilenames = new Map<string, FeedFormat>()
  const formats = normalizeFormats(options.formats ?? ['rss']).filter((format) => {
    const name = filename[format]
    const previous = usedFilenames.get(name)
    if (previous) {
      logger.warn(`[feed] \`${format}\` and \`${previous}\` share the filename \`${name}\`, \`${format}\` is skipped.`)
      return false
    }
    usedFilenames.set(name, format)
    return true
  })

  if (!formats.length) {
    logger.warn('[feed] no valid output format is configured, feed is disabled.')
    return null
  }

  return {
    perCollection: options.perCollection ?? false,
    includeDocCollections: options.includeDocCollections ?? false,
    content: options.content === 'full' ? 'full' : 'excerpt',
    limit: Math.round(clamp(options.limit ?? 20, 1, 200)),
    excerptLength: Math.round(clamp(options.excerptLength ?? 240, 0, 1000)),
    formats,
    filename,
    channel: options.channel ?? {},
    linkTag: options.linkTag ?? true,
    debug: options.debug ?? false,
  }
}

/**
 * Resolve the effective feed options of a locale.
 *
 * 读取某个语言环境实际生效的 Feed 配置。
 *
 * @param options - Theme options / 主题配置
 * @param locale - Route locale / 路由语言
 */
export function resolveLocaleFeedOptions(options: ThemeOptions, locale: string): ResolvedFeedOptions | null {
  const value = options.locales?.[locale]?.feed ?? options.feed
  if (!value)
    return null

  return normalizeFeedOptions(value === true ? {} : value)
}

/**
 * Resolve the collection level feed configuration.
 *
 * 解析集合级 Feed 配置：`undefined` 表示按主题级配置与集合类型推导。
 *
 * @param collection - Collection / 集合
 * @param resolved - Resolved theme level options / 归一化后的主题级配置
 */
export function resolveCollectionFeed(
  collection: ThemeCollectionItem,
  resolved: ResolvedFeedOptions,
): ResolvedCollectionFeed {
  const value = collection.feed
  const isPost = collection.type === 'post'

  if (value === false)
    return { include: false, channel: false }

  if (value === undefined) {
    const include = isPost || resolved.includeDocCollections
    return { include, channel: resolved.perCollection && include }
  }

  // `feed: true` / `feed: {}` 出现即 opt-in
  const options: FeedCollectionOptions = value === true ? {} : value
  const include = options.include ?? true

  return {
    include,
    channel: options.channel ?? true,
    link: options.link,
    title: options.title,
    description: options.description,
    limit: options.limit,
    content: options.content,
    formats: options.formats ? normalizeFormats(options.formats) : undefined,
  }
}

/**
 * Resolve and validate `hostname`.
 *
 * 解析并校验 `hostname`，返回站点源（origin）。
 *
 * @param hostname - Configured hostname / 配置的 hostname
 */
export function resolveHostname(hostname?: string): string | undefined {
  if (!hostname)
    return undefined

  const value = hostname.trim()
  if (!value)
    return undefined

  try {
    const url = new URL(value)
    if (url.pathname !== '/' && url.pathname !== '') {
      logger.warn('[feed] `hostname` should not contain a path, please use `base` instead.')
    }
    return url.origin
  }
  catch {
    logger.warn(`[feed] invalid \`hostname\`: ${hostname}`)
    return undefined
  }
}

/**
 * Normalize a channel home link.
 *
 * The link is relative to the current locale, it receives the locale prefix and
 * is normalized to a leading and trailing slash.
 *
 * 归一化频道主页链接：补全当前语言环境前缀，并统一首尾斜杠。
 *
 * @param link - Channel link / 频道链接
 * @param locale - Route locale / 路由语言
 * @returns Normalized link, or `undefined` when the link is not writable
 *          归一化后的链接，链接不可写入时为 `undefined`
 */
export function resolveChannelLink(link: string | undefined, locale: string): string | undefined {
  if (link === undefined)
    return undefined

  const value = link.trim()
  if (!value)
    return undefined

  // 外链与协议相对地址无法写入 dist / External links cannot be written into dist
  if (isLinkWithProtocol(value) || value.startsWith('//'))
    return undefined

  // 防止路径穿越 / Prevent path traversal
  if (value.includes('..'))
    return undefined

  return withBase(value, locale)
}

/**
 * Convert a normalized channel link into a directory relative to `dist`.
 *
 * 将归一化后的频道链接转换为 `dist` 内的相对目录。
 *
 * @param link - Normalized channel link / 归一化后的频道链接
 */
export function resolveChannelDir(link: string): string {
  return link.replace(/^\/+/, '').replace(/\/+$/, '')
}
