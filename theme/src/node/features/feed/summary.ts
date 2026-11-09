import type { Page } from 'vuepress'
import type { ThemePageData } from '../../../shared/index.js'
import { RAW_TEXT_TAGS, stripHtml } from './html.js'

/**
 * Excerpt separator, aligned with `prepare/posts-data.ts`.
 *
 * 摘要分隔符，与 `prepare/posts-data.ts` 保持一致。
 */
const EXCERPT_SPLIT = '<!-- more -->'

/**
 * 剥离标签时块级标签转换为空格，避免相邻段落粘连。
 */
const BLOCK_TAGS: ReadonlySet<string> = new Set([
  'p',
  'div',
  'br',
  'hr',
  'li',
  'ul',
  'ol',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'pre',
  'tr',
  'td',
  'th',
  'table',
  'section',
  'article',
  'figure',
  'figcaption',
  'dt',
  'dd',
])

const FIRST_PARAGRAPH_RE = /<p\b[^>]*>([\s\S]*?)<\/p>/i

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: '\'',
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  laquo: '«',
  raquo: '»',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
}

/**
 * Decode the common HTML entities.
 *
 * 解码常见的 HTML 实体。
 *
 * @param text - Text with entities / 包含实体的文本
 */
export function decodeEntities(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z][\da-z]*);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const code = entity[1] === 'x' || entity[1] === 'X'
        ? Number.parseInt(entity.slice(2), 16)
        : Number.parseInt(entity.slice(1), 10)
      if (!Number.isFinite(code) || code < 0 || code > 0x10FFFF)
        return match
      try {
        return String.fromCodePoint(code)
      }
      catch {
        return match
      }
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match
  })
}

/**
 * Convert HTML into plain text.
 *
 * 将 HTML 转换为纯文本：去除标签、解码实体、合并空白。
 *
 * @param html - HTML fragment / HTML 片段
 */
export function toPlainText(html: string): string {
  if (!html)
    return ''

  const text = stripHtml(html, {
    removeWithContent: RAW_TEXT_TAGS,
    blockTags: BLOCK_TAGS,
  })

  return decodeEntities(text)
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Truncate text by Unicode code points.
 *
 * 按 Unicode 码点截断文本，避免切断 emoji / 汉字。
 *
 * @param text - Plain text / 纯文本
 * @param maxLength - Max code points, `0` disables the summary / 最大码点数
 */
export function truncateText(text: string, maxLength: number): string {
  if (maxLength <= 0)
    return ''

  const chars = [...text]
  if (chars.length <= maxLength)
    return text

  return `${chars.slice(0, maxLength).join('').trimEnd()}…`
}

function resolveSummarySource(page: Page<ThemePageData>, override?: string): string {
  if (override)
    return override

  const frontmatter = page.frontmatter

  if (typeof frontmatter.excerpt === 'string')
    return frontmatter.excerpt

  // 尊重用户「不展示摘要」的意图 / Respect an explicit `excerpt: false`
  if (frontmatter.excerpt === false)
    return ''

  if (typeof frontmatter.description === 'string' && frontmatter.description)
    return frontmatter.description

  const content = page.contentRendered ?? ''

  const index = content.indexOf(EXCERPT_SPLIT)
  if (index !== -1)
    return content.slice(0, index)

  return FIRST_PARAGRAPH_RE.exec(content)?.[1] ?? ''
}

/**
 * Resolve the plain text summary of a page.
 *
 * 解析页面的纯文本摘要：
 * `frontmatter.feed.summary` → `excerpt` 字符串 → `excerpt: false` →
 * `description` → `<!-- more -->` 之前 → 首个段落。
 *
 * @param page - Page / 页面
 * @param excerptLength - Max length, `0` disables the summary / 摘要最大长度
 * @param override - Page level summary override / 页面级摘要覆盖
 */
export function resolveSummary(
  page: Page<ThemePageData>,
  excerptLength: number,
  override?: string,
): string {
  if (excerptLength <= 0)
    return ''

  const source = resolveSummarySource(page, override)
  if (!source)
    return ''

  return truncateText(toPlainText(source), excerptLength)
}
