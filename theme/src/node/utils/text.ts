/**
 * Plain text helpers shared by the excerpt based features.
 *
 * 基于摘要的功能共用的纯文本工具。
 */

import { BLOCK_TAGS, RAW_TEXT_TAGS, stripHtml } from './html.js'

/**
 * The first paragraph of an HTML fragment.
 *
 * HTML 片段中的第一个段落。
 */
const FIRST_PARAGRAPH_RE = /<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i

/**
 * Numeric and named character references.
 *
 * 数字与命名字符引用。
 */
const ENTITY_RE = /&(#x[\da-f]+|#\d+|[a-z][\da-z]*);/gi

/**
 * The few HTML entities that survive markdown rendering in prose.
 *
 * 正文中常见的少量 HTML 实体。
 */
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
 * Decode the common HTML entities, keeping invalid code points as raw text.
 *
 * 解码常见的 HTML 实体，码点非法时保留原始文本。
 *
 * @param text - Text with entities / 包含实体的文本
 */
export function decodeEntities(text: string): string {
  return text.replace(ENTITY_RE, (match, entity: string) => {
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
 * Read the inner HTML of the first paragraph.
 *
 * 读取第一个段落的内容（保留标签）。
 *
 * @param html - HTML fragment / HTML 片段
 */
export function firstParagraph(html: string): string | undefined {
  return FIRST_PARAGRAPH_RE.exec(html)?.[1]
}

/**
 * Convert HTML into plain text.
 *
 * 将 HTML 转换为纯文本：去除标签、解码实体、合并空白。
 *
 * @param html - HTML fragment / HTML 片段
 */
export function htmlToText(html: string): string {
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
 * @param maxLength - Max code points, `0` disables the truncation / 最大码点数，`0` 表示不截断
 */
export function truncateText(text: string, maxLength: number): string {
  if (maxLength <= 0)
    return ''

  const chars = [...text]
  if (chars.length <= maxLength)
    return text

  return `${chars.slice(0, maxLength).join('').trimEnd()}…`
}
