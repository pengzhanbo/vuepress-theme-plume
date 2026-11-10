import type { Page } from 'vuepress'
import type { ThemePageData } from '../../../shared/index.js'

/**
 * The first paragraph of the rendered HTML.
 *
 * 渲染后 HTML 的第一个段落。
 */
const FIRST_PARAGRAPH_RE = /<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i

/**
 * Any HTML tag.
 *
 * 任意 HTML 标签。
 */
const TAG_RE = /<[^>]+>/g

/**
 * The few HTML entities that survive markdown rendering in prose.
 *
 * 正文中常见的少量 HTML 实体。
 */
const ENTITY_RE = /&(?:#(\d+)|#x([\da-f]+)|(amp|lt|gt|quot|nbsp));/gi

const NAMED_ENTITY: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  nbsp: ' ',
}

/**
 * Decode the few HTML entities that survive markdown rendering in prose.
 *
 * 解码正文中常见的少量 HTML 实体。
 *
 * @param text - Raw text / 原始文本
 */
function decodeEntities(text: string): string {
  return text.replace(ENTITY_RE, (_, dec?: string, hex?: string, named?: string) => {
    if (dec)
      return String.fromCodePoint(Number(dec))
    if (hex)
      return String.fromCodePoint(Number.parseInt(hex, 16))
    return NAMED_ENTITY[named!.toLowerCase()] ?? `&${named};`
  })
}

/**
 * Resolve a plain-text excerpt of a page.
 *
 * 解析页面的纯文本摘要：优先 `frontmatter.description`，否则取渲染后 HTML 的首个段落。
 *
 * @param page - Target page / 目标页面
 * @param length - Max characters, `0` means unlimited / 最大字符数，`0` 表示不截断
 */
export function resolveExcerpt(page: Page<ThemePageData>, length: number): string {
  const description = page.frontmatter.description
  const raw = typeof description === 'string' && description.trim()
    ? description
    : (page.contentRendered.match(FIRST_PARAGRAPH_RE)?.[1] ?? '')

  const text = decodeEntities(raw.replace(TAG_RE, ' '))
    .replace(/\s+/g, ' ')
    .trim()

  if (!text)
    return ''

  if (length <= 0)
    return text

  // 按码点截断，避免切开代理对（emoji / 罕见汉字）
  const chars = [...text]
  return chars.length > length ? `${chars.slice(0, length).join('')}…` : text
}
