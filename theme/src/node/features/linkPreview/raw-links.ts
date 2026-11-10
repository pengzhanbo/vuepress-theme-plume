import { normalizePreviewPath, stripBase } from './key.js'

/**
 * Raw `<a>` tags left in the rendered HTML.
 *
 * 渲染后 HTML 中残留的裸 `<a>` 标签。
 */
const ANCHOR_TAG_RE = /<a(\s[^>]*)?>/gi

/**
 * The `href` attribute of a tag.
 *
 * 标签的 `href` 属性。
 */
const HREF_RE = /\shref\s*=\s*(?:"([^"]*)"|'([^']*)')/i

/**
 * Opt-out markers of one link.
 *
 * 单条链接的关闭标记。
 */
const NO_PREVIEW_RE = /data-no-link-preview|no-link-preview/

const AMP_RE = /&amp;/g

/**
 * Extract the raw HTML anchor hrefs from a rendered page.
 *
 * 从渲染后的 HTML 中提取裸 HTML 锚点的 `href`。
 *
 * VuePress 会把 markdown 内链改写为 `<RouteLink>`，因此剩余的 `<a href>`
 * 是 `page.links` 覆盖不到的裸 HTML 锚点。
 *
 * @param html - Rendered HTML / 渲染后的 HTML
 */
export function extractRawHrefs(html: string): string[] {
  const hrefs: string[] = []

  for (const match of html.matchAll(ANCHOR_TAG_RE)) {
    const tag = match[0]

    if (NO_PREVIEW_RE.test(tag))
      continue

    const hrefMatch = tag.match(HREF_RE)
    const href = hrefMatch?.[1] ?? hrefMatch?.[2]
    if (!href)
      continue

    hrefs.push(href.replace(AMP_RE, '&'))
  }

  return hrefs
}

/**
 * Resolve the preview key of a raw HTML anchor.
 *
 * 解析裸 HTML 锚点的预览键
 *
 * @param href - Raw `href` attribute / 原始 `href` 属性值
 * @param pagePath - Route path of the source page / 源页的路由路径
 * @param base - Site base / 站点 base
 * @returns Normalized route path, `null` when the link cannot be resolved
 */
export function resolveRawHrefKey(href: string, pagePath: string, base: string): string | null {
  const value = href.trim()

  if (!value || value.startsWith('#') || value.startsWith('?'))
    return null

  // 带协议的链接（外链、`mailto:` 等）一律跳过
  if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('//'))
    return null

  let pathname: string

  try {
    pathname = new URL(value, `https://example.com${pagePath}`).pathname
  }
  catch {
    return null
  }

  return normalizePreviewPath(stripBase(pathname, base))
}
