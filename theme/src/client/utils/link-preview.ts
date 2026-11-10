/**
 * Bounding rect of a trigger element.
 *
 * 触发元素的包围盒。
 */
export interface PreviewRect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

/**
 * Size of an element or of the viewport.
 *
 * 元素或视口尺寸。
 */
export interface PreviewSize {
  width: number
  height: number
}

/**
 * Options of the positioning algorithm.
 *
 * 定位算法的配置。
 */
export interface PreviewPositionOptions {
  /**
   * Gap between the anchor and the card
   *
   * 卡片与链接之间的间距
   */
  offset?: number
  /**
   * Min gap between the card and the viewport edge
   *
   * 卡片与视口边缘的最小间距
   */
  margin?: number
}

/**
 * Resolved fixed position of the card.
 *
 * 计算出的卡片 fixed 定位。
 */
export interface PreviewPosition {
  top: number
  left: number
  placement: 'top' | 'bottom'
}

/**
 * Normalize a route path into a comparable preview key.
 * Mirrors `node/features/linkPreview/key.ts`.
 *
 * 将路由路径序列化为可比较的预览键。
 * 与 `node/features/linkPreview/key.ts` 保持一致。
 *
 * @param pathname - Route path / 路由路径
 */
export function normalizePreviewPath(pathname: string): string {
  let path = pathname

  try {
    path = decodeURI(path)
  }
  catch {
    // 非法百分号编码：保留原值，不做二次处理
    // Invalid percent-encoding: keep the raw value
  }

  path = path.replace(/\/index\.html$/, '/')

  if (!path.startsWith('/'))
    path = `/${path}`

  return path || '/'
}

/**
 * Strip the site base prefix from a pathname.
 *
 * 去除站点 `base` 前缀（用前缀切片而不是正则）。
 *
 * @param pathname - Absolute pathname / 绝对路径
 * @param base - Site base / 站点 base
 */
export function stripBase(pathname: string, base: string): string {
  if (base !== '/' && pathname.startsWith(base))
    return `/${pathname.slice(base.length)}`

  return pathname
}

/**
 * Resolve the preview key of an anchor href (pure, unit-testable).
 *
 * 由 `href` 解析预览键：剥离 base，标准化路径，并在以下情况
 * 返回 `null`：锚点链接、外部协议、外站链接、当前页链接。
 *
 * 相对路径按当前页面路由解析，与点击链接时的浏览器行为一致。
 *
 * @param href - Raw `href` attribute / 链接的 `href` 属性值
 * @param base - Site base / 站点 base
 * @param currentKey - Normalized key of the current page / 当前页的归一化键
 * @param selfOrigin - `location.origin` / 当前站点 origin
 */
export function resolveAnchorKey(
  href: string | null | undefined,
  base: string,
  currentKey: string,
  selfOrigin: string,
): string | null {
  if (!href)
    return null

  const value = href.trim()

  if (!value || value.startsWith('#') || value.startsWith('?'))
    return null

  let url: URL

  try {
    url = new URL(value, `${selfOrigin}${currentKey}`)
  }
  catch {
    return null
  }

  // `mailto:` / `javascript:` / `data:` 的 origin 为 `'null'`，
  // 外站链接的 origin 与本站不同，两者都会被剔除。
  if (url.origin !== selfOrigin)
    return null

  const key = normalizePreviewPath(stripBase(url.pathname, base))

  return key === currentKey ? null : key
}

/**
 * Resolve the fixed position of the preview card.
 *
 * 计算预览卡片的 fixed 定位：默认在链接下方，空间不足时翻转到上方，
 * 水平方向裁剪到视口内。
 *
 * @param anchor - Bounding rect of the trigger / 触发链接的包围盒
 * @param card - Size of the card / 卡片尺寸
 * @param viewport - Size of the viewport / 视口尺寸
 * @param options - Positioning options / 定位配置
 */
export function resolvePreviewPosition(
  anchor: PreviewRect,
  card: PreviewSize,
  viewport: PreviewSize,
  options: PreviewPositionOptions = {},
): PreviewPosition {
  const offset = options.offset ?? 8
  const margin = options.margin ?? 8

  const below = anchor.bottom + offset
  const above = anchor.top - offset - card.height

  const placement: 'top' | 'bottom' = below + card.height + margin <= viewport.height || above < margin
    ? 'bottom'
    : 'top'

  let top = placement === 'bottom' ? below : above
  // 上下都放不下时（很矮的视口），贴边
  top = Math.min(Math.max(top, margin), Math.max(margin, viewport.height - card.height - margin))

  const maxLeft = Math.max(margin, viewport.width - card.width - margin)
  const left = Math.min(Math.max(anchor.left, margin), maxLeft)

  return { top, left, placement }
}

/**
 * Convert a DOMRect into a plain rect object.
 *
 * 将 DOMRect 转换为普通对象。
 *
 * @param rect - DOM rect / DOM 包围盒
 */
export function toPreviewRect(rect: DOMRect | { top: number, left: number, right: number, bottom: number, width: number, height: number }): PreviewRect {
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  }
}
