import { onContentUpdated } from 'vuepress/client'

/**
 * Attribute name for mark mode.
 *
 * 标记模式属性名。
 */
const MARK_MODE_ATTR = 'data-mark-mode'
/**
 * Lazy mode constant.
 *
 * 懒加载模式常量。
 */
const MARK_MODE_LAZY = 'lazy'
/**
 * CSS class for visible marks.
 *
 * 可见标记的 CSS 类名。
 */
const MARK_VISIBLE_CLASS = 'vp-mark-visible'
/**
 * Attribute name for mark boundary.
 *
 * 标记边界属性名。
 */
const MARK_BOUND_ATTR = 'data-vp-mark-bound'
/**
 * CSS selector for mark elements.
 *
 * 标记元素的 CSS 选择器。
 */
const MARK_SELECTOR = 'mark'
/**
 * CSS selector for bounded mark elements.
 *
 * 已绑定标记元素的 CSS 选择器。
 */
const BOUND_SELECTOR = `${MARK_SELECTOR}[${MARK_BOUND_ATTR}="1"]`

/**
 * Setup mark highlight animation for lazy mode.
 *
 * 为懒加载模式设置标记高亮动画。
 *
 * When mode is 'lazy', marks will animate into view using IntersectionObserver.
 * When mode is 'eager', marks are immediately visible without animation.
 *
 * 当模式为 'lazy' 时，标记将使用 IntersectionObserver 在进入视口时显示动画。
 * 当模式为 'eager' 时，标记立即显示，没有动画效果。
 *
 * @param mode - Animation mode: 'lazy' or 'eager' / 动画模式：'lazy' 或 'eager'
 *
 * @example
 * ```ts
 * // In client config setup
 * setupMarkHighlight('lazy')
 * ```
 */
export function setupMarkHighlight(mode: 'lazy' | 'eager'): void {
  if (typeof window === 'undefined' || __VUEPRESS_SSR__)
    return

  const root = document.documentElement

  if (mode !== MARK_MODE_LAZY) {
    root.removeAttribute(MARK_MODE_ATTR)
    return
  }

  root.setAttribute(MARK_MODE_ATTR, MARK_MODE_LAZY)

  let intersectionObserver: IntersectionObserver | null = null
  let rafId: number | null = null

  const ensureObserver = () => {
    if (!intersectionObserver) {
      intersectionObserver = new IntersectionObserver((entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.intersectionRatio <= 0)
            continue

          const target = entry.target as HTMLElement
          target.classList.add(MARK_VISIBLE_CLASS)
          target.removeAttribute(MARK_BOUND_ATTR)
          obs.unobserve(target)
        }
      }, {
        threshold: [0, 0.1, 0.25, 0.5],
        rootMargin: '8% 0px -8% 0px',
      })
    }
    return intersectionObserver
  }

  const bindMarks = () => {
    const marks = Array.from(document.querySelectorAll<HTMLElement>(MARK_SELECTOR))
      .filter(mark =>
        mark instanceof HTMLElement
        && !mark.classList.contains(MARK_VISIBLE_CLASS)
        && mark.getAttribute(MARK_BOUND_ATTR) !== '1',
      )

    if (marks.length === 0)
      return

    const observer = ensureObserver()
    for (const mark of marks) {
      mark.setAttribute(MARK_BOUND_ATTR, '1')
      observer.observe(mark)
    }
  }

  const scheduleBind = () => {
    if (rafId !== null)
      cancelAnimationFrame(rafId)

    rafId = requestAnimationFrame(() => {
      rafId = null
      bindMarks()
    })
  }

  const resetObserver = () => {
    if (!intersectionObserver)
      return

    intersectionObserver.disconnect()
    intersectionObserver = null

    Array.from(document.querySelectorAll<HTMLElement>(BOUND_SELECTOR) || []).forEach((mark) => {
      if (!mark.classList.contains(MARK_VISIBLE_CLASS))
        mark.removeAttribute(MARK_BOUND_ATTR)
    })
  }

  onContentUpdated(() => {
    resetObserver()
    scheduleBind()
  })
}
