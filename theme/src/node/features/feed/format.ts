/**
 * Shared helpers for feed serialization.
 *
 * Feed 序列化的公共辅助函数。
 */

/**
 * Generator name written into every feed.
 *
 * 写入每个 feed 的生成器名称。
 */
export const FEED_GENERATOR = 'vuepress-theme-plume'

/**
 * Theme homepage, used as the Atom generator URI.
 *
 * 主题主页，作为 Atom 的 generator URI。
 */
export const FEED_GENERATOR_URI = 'https://theme-plume.vuejs.press'

/**
 * Context shared by the serializers.
 *
 * 序列化器共享的上下文。
 */
export interface FeedRenderContext {
  /** Site origin / 站点源 */
  hostname: string
  /** Base path / 基础路径 */
  base: string
  /** Output filename of the current format / 当前格式的输出文件名 */
  filename: string
}

/**
 * Resolve the public URL of a feed file.
 *
 * 解析 feed 文件的公开地址。
 *
 * @param dir - Channel directory inside `dist` / 频道在 `dist` 内的目录
 * @param ctx - Render context / 渲染上下文
 */
export function resolveFeedFileUrl(dir: string, ctx: FeedRenderContext): string {
  return toAbsoluteUrl(ctx.hostname, ctx.base, dir ? `${dir}/${ctx.filename}` : ctx.filename)
}

/**
 * Deduplicate strings while keeping the original order.
 *
 * 去重并保留原有顺序。
 *
 * @param values - Values / 值列表
 */
export function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))]
}

const XML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
}

/**
 * Escape a string for XML text and attribute values.
 *
 * 转义 XML 文本与属性值。
 *
 * @param value - Raw value / 原始值
 */
export function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, char => XML_ESCAPES[char])
}

/**
 * Wrap a string into a CDATA section, splitting `]]>` when needed.
 *
 * 将字符串包装为 CDATA 段，必要时拆分 `]]>`。
 *
 * @param value - Raw value / 原始值
 */
export function cdata(value: string): string {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`
}

/**
 * Normalize a base path to start and end with `/`.
 *
 * 将 base 归一化为以 `/` 开头和结尾。
 *
 * @param base - Base path / 基础路径
 */
export function normalizeBase(base = '/'): string {
  if (!base)
    return '/'
  const value = base.replace(/^\/+/, '').replace(/\/+$/, '')
  return value ? `/${value}/` : '/'
}

/**
 * Build an absolute URL from the hostname, base path and route path.
 *
 * 使用 hostname、base 与路由路径拼接绝对地址。
 *
 * @param hostname - Site origin / 站点源
 * @param base - Base path / 基础路径
 * @param routePath - Route path without base / 不含 base 的路由路径
 */
export function toAbsoluteUrl(hostname: string, base: string, routePath = ''): string {
  const prefix = normalizeBase(base)
  return `${hostname.replace(/\/+$/, '')}${prefix}${routePath.replace(/^\/+/, '')}`
}

/**
 * Resolve a possibly site-relative asset URL into an absolute URL.
 *
 * 将可能是站点相对路径的资源地址转换为绝对地址。
 *
 * @param value - Asset URL / 资源地址
 * @param hostname - Site origin / 站点源
 * @param base - Base path / 基础路径
 */
export function resolveAssetUrl(value: string | undefined, hostname: string, base: string): string | undefined {
  if (!value)
    return undefined

  const url = value.trim()
  if (!url)
    return undefined

  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url))
    return url.startsWith('//') ? `https:${url}` : url

  return toAbsoluteUrl(hostname, base, url)
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

function tzOffset(date: Date, colon = false): string {
  const minutes = -date.getTimezoneOffset()
  const sign = minutes >= 0 ? '+' : '-'
  const abs = Math.abs(minutes)
  const hh = pad(Math.floor(abs / 60))
  const mm = pad(abs % 60)
  return `${sign}${hh}${colon ? ':' : ''}${mm}`
}

/**
 * Format a date as RFC 822 (used by RSS 2.0).
 *
 * The local wall time is kept together with its timezone offset, so that the
 * date shown by the site and the one in the feed represent the same moment.
 *
 * 格式化为 RFC 822（RSS 2.0 使用），保留本地时间与时区偏移。
 *
 * @param date - Date / 日期
 */
export function formatRfc822(date: Date): string {
  return `${DAYS[date.getDay()]}, ${pad(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()} `
    + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${tzOffset(date)}`
}

/**
 * Format a date as RFC 3339 (used by Atom 1.0 and JSON Feed 1.1).
 *
 * 格式化为 RFC 3339（Atom 1.0 与 JSON Feed 1.1 使用），保留本地时间与时区偏移。
 *
 * @param date - Date / 日期
 */
export function formatRfc3339(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${tzOffset(date, true)}`
}
