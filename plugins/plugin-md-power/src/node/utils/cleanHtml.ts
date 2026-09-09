import sanitizeHtml from 'sanitize-html'

/**
 * Clean all HTML tags, including inline styles and event handlers.
 *
 * 移除所有 HTML 标签，包括内联样式和事件处理程序。
 *
 * @param html - HTML string / HTML 字符串
 * @returns Cleaned HTML string / 清理后的 HTML 字符串
 */
export function cleanHtmlAllTag(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  })
}
