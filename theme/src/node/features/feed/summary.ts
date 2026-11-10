import type { Page } from 'vuepress'
import type { ThemePageData } from '../../../shared/index.js'
import { EXCERPT_SPLIT, firstParagraph, htmlToText, truncateText } from '../../utils/index.js'

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

  return firstParagraph(content) ?? ''
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

  return truncateText(htmlToText(source), excerptLength)
}
