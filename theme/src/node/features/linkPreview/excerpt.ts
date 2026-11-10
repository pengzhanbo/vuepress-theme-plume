import type { Page } from 'vuepress'
import type { ThemePageData } from '../../../shared/index.js'
import { firstParagraph, htmlToText, truncateText } from '../../utils/index.js'

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
  const source = typeof description === 'string' && description.trim()
    ? description
    : (firstParagraph(page.contentRendered) ?? '')

  const text = htmlToText(source)
  if (!text)
    return ''

  return length > 0 ? truncateText(text, length) : text
}
