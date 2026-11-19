// 滚动到锚点时预留的固定导航栏高度（px）
export const ANCHOR_SCROLL_OFFSET = 64

// 检测激活锚点时预留的固定导航栏高度（px）。
export const ACTIVE_ANCHOR_OFFSET = 80

// 窗口滚动位置
export interface ScrollPosition {
  left: number
  top: number
}

// 需要还原而不是滚动到路由的滚动位置
interface SkippedScroll {
  fullPath: string
  position: ScrollPosition
  at: number
}

/**
 * 待处理跳过标记的有效期（毫秒）。
 *
 * 匹配的导航会消费该标记，超时仅用于避免残留标记影响之后导航到同一位置时的滚动。
 */
const SKIP_TTL = 2000

// 待处理的跳过标记
let skippedScroll: SkippedScroll | null = null

/**
 * 解码 hash，它可能来自 `location.hash`，此时是百分号编码的。
 *
 * @param hash - Hash to decode / 需要解码的 hash
 * @returns Decoded hash / 解码后的 hash
 */
export function decodeHash(hash: string): string {
  if (!hash)
    return ''

  let decoded!: string
  let count = 0
  try {
    while (decoded !== hash && count < 5) {
      decoded = decodeURIComponent(hash)
      count++
    }

    return decoded
  }
  catch {
    return hash
  }
}

/**
 * 标记一次需要保持滚动位置的导航。
 *
 * 供滚动监听同步 URL hash 时使用：该导航不能移动页面，否则新的滚动位置会改变
 * 激活标题，进而再次写入 hash 并再次滚动。
 *
 * @param fullPath - Full path of the navigation / 导航的完整路径
 * @param position - Position to restore / 需要还原的滚动位置
 */
export function skipScrollPosition(fullPath: string, position: ScrollPosition): void {
  skippedScroll = { fullPath, position, at: Date.now() }
}

/**
 * 当匹配的导航没有发生时，清除待处理的跳过标记。
 *
 * @param fullPath - Full path of the navigation / 导航的完整路径
 */
export function clearSkippedScrollPosition(fullPath: string): void {
  if (skippedScroll?.fullPath === fullPath)
    skippedScroll = null
}

/**
 * 获取并消费指定导航需要还原的滚动位置。
 *
 * @param fullPath - Full path of the navigation / 导航的完整路径
 * @returns Position to restore, or `null` / 需要还原的位置，没有则为 `null`
 */
export function consumeSkippedScrollPosition(fullPath: string): ScrollPosition | null {
  if (!skippedScroll || skippedScroll.fullPath !== fullPath)
    return null

  const { at, position } = skippedScroll
  skippedScroll = null

  return Date.now() - at < SKIP_TTL ? position : null
}

/**
 * 解析锚点的滚动位置，并补偿导航栏高度。
 *
 * @param hash - Hash of the anchor / 锚点的 hash
 * @param offset - Offset reserved for the navbar / 为导航栏预留的偏移量
 * @returns Position to scroll to, or `null` when the anchor does not exist / 需要滚动到的位置，锚点不存在时为 `null`
 */
export function resolveAnchorScrollPosition(
  hash: string,
  offset = ANCHOR_SCROLL_OFFSET,
): ScrollPosition | null {
  const id = hash.startsWith('#') ? hash.slice(1) : hash

  if (!id)
    return null

  // 标题 id 是原始文本，但 hash 也可能来自 `location.hash`（已编码）。
  const element = document.getElementById(id) ?? document.getElementById(decodeHash(id))

  if (!element)
    return null

  const { top } = element.getBoundingClientRect()

  return { left: 0, top: Math.max(top + window.scrollY - offset, 0) }
}
