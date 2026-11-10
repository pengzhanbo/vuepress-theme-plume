import { RAW_TEXT_TAGS, removeElements } from '../../utils/index.js'
import { toAbsoluteUrl } from './format.js'

/**
 * Context used to absolute the URLs of a rendered page.
 *
 * 用于将页面正文中的 URL 绝对化的上下文。
 */
export interface SanitizeContext {
  /** Absolute URL of the page / 页面的绝对地址 */
  url: string
  /** Site origin / 站点源 */
  hostname: string
  /** Base path / 基础路径 */
  base: string
}

const HEADER_ANCHOR_RE = /<a\s[^>]*class="[^"]*header-anchor[^"]*"[^>]*>[\s\S]*?<\/a>/gi
const LEADING_H1_RE = /^\s*<h1\b[^>]*>[\s\S]*?<\/h1>/i

/**
 * Vue components and custom elements: the tag name starts with an uppercase
 * letter or contains a dash.
 *
 * Vue 组件与自定义元素：标签名以大写字母开头，或包含 `-`。
 *
 * @param name - Original tag name / 原始标签名
 */
function isComponentTag(name: string): boolean {
  return /^[A-Z]/.test(name) || name.includes('-')
}

const ATTR_RE = /\s+([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g

const URL_ATTRIBUTES = new Set(['href', 'src', 'poster'])
const PROTOCOL_RE = /^[a-z][a-z0-9+.-]*:/i

/**
 * Whitespace, control characters and zero-width characters that browsers ignore
 * when parsing a URL scheme.
 *
 * 浏览器解析 URL scheme 时会忽略的空白、控制字符与零宽字符。
 */
const IGNORED_URL_CHAR_RE = /[\s\u0000-\u001F\u007F-\u009F\u200B-\u200D]/g // eslint-disable-line no-control-regex -- 需显式匹配控制字符以拦截混淆的 URL scheme

/**
 * Check whether an attribute value uses the `javascript:` protocol, tolerating
 * obfuscation such as `java\tscript:`.
 *
 * 判断属性值是否使用 `javascript:` 协议，可识别 `java\tscript:` 之类的混淆写法。
 *
 * @param value - Raw attribute value / 原始属性值
 */
function isUnsafeUrl(value: string): boolean {
  return /^javascript:/i.test(value.replace(IGNORED_URL_CHAR_RE, ''))
}

/**
 * Escape a value that will be written inside a double quoted attribute.
 *
 * 转义将写入双引号属性值中的双引号，避免破坏属性边界。
 *
 * @param value - Attribute value / 属性值
 */
function escapeAttributeValue(value: string): string {
  return value.replace(/"/g, '&quot;')
}

function resolveUrl(value: string, context: SanitizeContext): string {
  const url = value.trim()
  if (!url)
    return url

  // 站内锚点 / In-page anchor
  if (url.startsWith('#'))
    return `${context.url}${url}`

  // 站内查询参数 / Query string
  if (url.startsWith('?'))
    return `${context.url.split(/[?#]/)[0]}${url}`

  // 协议相对地址 / Protocol-relative URL
  if (url.startsWith('//'))
    return `https:${url}`

  // `mailto:` / `tel:` / `data:` 等保留 / Keep other protocols
  if (PROTOCOL_RE.test(url))
    return url

  // 站点绝对路径 / Site absolute path
  if (url.startsWith('/'))
    return toAbsoluteUrl(context.hostname, context.base, url)

  try {
    return new URL(url, context.url).toString()
  }
  catch {
    return url
  }
}

function resolveSrcset(value: string, context: SanitizeContext): string {
  // `data:` URL 中含有逗号，整体保留 / Keep `data:` URLs untouched
  if (value.includes('data:'))
    return value

  return value
    .split(',')
    .map((candidate) => {
      const item = candidate.trim()
      if (!item)
        return ''
      const [url, ...descriptors] = item.split(/\s+/)
      return [resolveUrl(url, context), ...descriptors].join(' ')
    })
    .filter(Boolean)
    .join(', ')
}

function processAttributes(html: string, context: SanitizeContext): string {
  return html.replace(ATTR_RE, (match, rawName: string, doubleQuoted?: string, singleQuoted?: string) => {
    const name = rawName.toLowerCase()
    const value = doubleQuoted ?? singleQuoted ?? ''

    // 事件属性与作用域属性 / Event handlers and scoped style attributes
    if (name.startsWith('on') || name.startsWith('data-v-'))
      return ''

    if (URL_ATTRIBUTES.has(name)) {
      if (isUnsafeUrl(value))
        return ''
      return ` ${name}="${escapeAttributeValue(resolveUrl(value, context))}"`
    }

    if (name === 'srcset')
      return ` ${name}="${escapeAttributeValue(resolveSrcset(value, context))}"`

    return match
  })
}

/**
 * Sanitize the rendered content of a page for feed output.
 *
 * 清洗页面渲染结果，供 feed 输出使用。处理顺序固定以保证输出确定性。
 *
 * @param html - Rendered content / 渲染后的正文
 * @param context - URL context / URL 上下文
 */
export function sanitizeContent(html: string, context: SanitizeContext): string {
  if (!html)
    return ''

  // 脚本/样式/注释整段丢弃；组件标签剥离但保留内部文本，自闭合组件随之消失
  // Drop scripts/styles/comments entirely; strip component tags but keep their text.
  const content = removeElements(html, {
    removeWithContent: RAW_TEXT_TAGS,
    removeTag: isComponentTag,
  })
    .replace(HEADER_ANCHOR_RE, '')
    .replace(LEADING_H1_RE, '')

  return processAttributes(content, context).trim()
}
