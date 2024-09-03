import { tween } from './animate.js'

export function getCssValue(el: HTMLElement | null, property: string): number {
  const val = el?.ownerDocument?.defaultView?.getComputedStyle(el, null)?.[
    property as any
  ]
  const num = Number.parseInt(val as string, 10)
  return Number.isNaN(num) ? 0 : num
}

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
