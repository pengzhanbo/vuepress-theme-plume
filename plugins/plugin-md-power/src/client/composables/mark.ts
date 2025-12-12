import { onContentUpdated } from 'vuepress/client'

const MARK_MODE_ATTR = 'data-mark-mode'
const MARK_MODE_LAZY = 'lazy'
const MARK_VISIBLE_CLASS = 'vp-mark-visible'
const MARK_BOUND_ATTR = 'data-vp-mark-bound'
const MARK_SELECTOR = 'mark'
const BOUND_SELECTOR = `${MARK_SELECTOR}[${MARK_BOUND_ATTR}="1"]`

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
