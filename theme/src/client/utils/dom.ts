import { tween } from './animate.js'

/**
 * Get the computed CSS value of an element as a number
 *
 * 获取元素的计算 CSS 值并转换为数字
 *
 * @param el - Target element / 目标元素
 * @param property - CSS property name / CSS 属性名
 * @returns The numeric value of the CSS property, 0 if not found or invalid / CSS 属性的数值，如果未找到或无效则返回 0
 */
export function getCssValue(el: HTMLElement | null, property: string): number {
  const val = el?.ownerDocument?.defaultView?.getComputedStyle(el, null)?.[
    property as any
  ]
  const num = Number.parseInt(val as string, 10)
  return Number.isNaN(num) ? 0 : num
}

/**
 * Get the scrollTop value of a target element or document
 *
 * 获取目标元素或文档的 scrollTop 值
 *
 * @param target - Target element or document, defaults to document / 目标元素或文档，默认为 document
 * @returns Current scrollTop value / 当前 scrollTop 值
 */
export function getScrollTop(
  target: Document | HTMLElement = document,
): number {
  if (target === document || !target) {
    return (
      window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop
      || 0
    )
  }
  else {
    return (target as HTMLElement).scrollTop
  }
}

/**
 * Set the scrollTop value of a target element or document
 *
 * 设置目标元素或文档的 scrollTop 值
 *
 * @param target - Target element or document, defaults to document / 目标元素或文档，默认为 document
 * @param scrollTop - ScrollTop value to set / 要设置的 scrollTop 值
 */
export function setScrollTop(
  target: Document | HTMLElement = document,
  scrollTop = 0,
): void {
  if (typeof target === 'number') {
    scrollTop = target
    target = document
    document.documentElement.scrollTop = scrollTop
    document.body.scrollTop = scrollTop
  }
  else {
    if (target === document) {
      document.body.scrollTop = scrollTop || 0
      document.documentElement.scrollTop = scrollTop || 0
    }
    else {
      ;(target as HTMLElement).scrollTop = scrollTop || 0
    }
  }
}

/**
 * Smoothly scroll to a specific position
 *
 * 平滑滚动到指定位置
 *
 * @param target - Target element or document / 目标元素或文档
 * @param top - Target scrollTop position / 目标 scrollTop 位置
 * @param time - Animation duration in milliseconds, defaults to 300ms / 动画持续时间（毫秒），默认为 300ms
 */
export function scrollTo(
  target: Document | HTMLElement,
  top: number,
  time = 300,
): void {
  if (target !== document) {
    const currentTop = getScrollTop(target)
    const step = Math.ceil(time / 16)
    let currentStep = 0
    const change = top - currentTop
    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= step && timer)
        clearInterval(timer)

      setScrollTop(target, tween(currentStep, currentTop, change, step))
    }, 1000 / 60)
  }
  else {
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

/**
 * Get the offset top of an element relative to the document
 *
 * 获取元素相对于文档的 offsetTop 值
 *
 * @param target - Target element / 目标元素
 * @returns The total offsetTop value / 总的 offsetTop 值
 */
export function getOffsetTop<T extends HTMLElement = HTMLElement>(target: T | null): number {
  if (!target)
    return 0
  let parent: HTMLElement | null = target
  let top = 0
  while (parent) {
    top += parent.offsetTop
    parent = parent.offsetParent as HTMLElement
  }
  return top
}
