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

const SCRIPT_STYLE_RE = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi
const COMMENT_RE = /<!--[\s\S]*?-->/g
const HEADER_ANCHOR_RE = /<a\s[^>]*class="[^"]*header-anchor[^"]*"[^>]*>[\s\S]*?<\/a>/gi
const LEADING_H1_RE = /^\s*<h1\b[^>]*>[\s\S]*?<\/h1>/i

/**
 * Vue components and custom elements: the tag name starts with an uppercase
 * letter or contains a dash.
 *
 * Vue 组件与自定义元素：标签名以大写字母开头，或包含 `-`。
 */
const COMPONENT_NAME = '(?:[A-Z][\\w.]*|[a-z][\\w.]*-[\\w.-]*)'
const SELF_CLOSING_COMPONENT_RE = new RegExp(`<${COMPONENT_NAME}(?=[\\s/>])[^>]*?/>`, 'g')
const COMPONENT_TAG_RE = new RegExp(`</?${COMPONENT_NAME}(?=[\\s/>])[^>]*>`, 'g')

const ATTR_RE = /\s+([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g

const URL_ATTRIBUTES = new Set(['href', 'src', 'poster'])
const PROTOCOL_RE = /^[a-z][a-z0-9+.-]*:/i

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
      if (/^javascript:/i.test(value.trim()))
        return ''
      return ` ${name}="${resolveUrl(value, context)}"`
    }

    if (name === 'srcset')
      return ` ${name}="${resolveSrcset(value, context)}"`

    return match
  })
}

/**
 * Sanitize the rendered content of a page for feed output.
 *
 * The processing order is fixed to keep the output deterministic:
 * scripts/styles → comments → header anchors → leading H1 → component tags →
 * attributes → URL absolutization.
 *
 * 清洗页面渲染结果，供 feed 输出使用。处理顺序固定以保证输出确定性。
 *
 * @param html - Rendered content / 渲染后的正文
 * @param context - URL context / URL 上下文
 */
export function sanitizeContent(html: string, context: SanitizeContext): string {
  if (!html)
    return ''

  let content = html
    .replace(SCRIPT_STYLE_RE, '')
    .replace(COMMENT_RE, '')
    .replace(HEADER_ANCHOR_RE, '')
    .replace(LEADING_H1_RE, '')

  // 自闭合组件整段丢弃（例如 `<VPEncryptSnippet hint="..." />`）
  // Self-closing components are dropped entirely to avoid leaking their props.
  content = content.replace(SELF_CLOSING_COMPONENT_RE, '')

  // 成对组件标签剥离，保留内部文本 / Strip paired component tags, keep the text
  content = content.replace(COMPONENT_TAG_RE, '')

  content = processAttributes(content, context)

  return content.trim()
}
