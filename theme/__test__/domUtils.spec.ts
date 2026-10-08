import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getCssValue,
  getOffsetTop,
  getScrollTop,
  scrollTo,
  setScrollTop,
} from '../src/client/utils/dom.js'

/**
 * A minimal scroll container. `scrollTo` and `getScrollTop` compare the target with the
 * global `document`, so the global is stubbed to a sentinel object.
 *
 * 一个最小的滚动容器。`scrollTo` 与 `getScrollTop` 会把目标与全局 `document` 比较，
 * 因此把全局 `document` 替换为一个标记对象。
 */
function createElement(scrollTop = 0) {
  return { scrollTop } as HTMLElement
}

let doc: any
let win: any

beforeEach(() => {
  doc = {
    documentElement: { scrollTop: 0 },
    body: { scrollTop: 0 },
  }
  win = { pageYOffset: 0, scrollTo: vi.fn() }
  vi.stubGlobal('document', doc)
  vi.stubGlobal('window', win)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getCssValue', () => {
  it('parses the computed value into a number', () => {
    const el = {
      ownerDocument: { defaultView: { getComputedStyle: () => ({ height: '42px' }) } },
    } as unknown as HTMLElement

    expect(getCssValue(el, 'height')).toBe(42)
  })

  it('returns 0 for a null element', () => {
    expect(getCssValue(null, 'height')).toBe(0)
  })

  it('returns 0 when the value is not a number', () => {
    const el = {
      ownerDocument: { defaultView: { getComputedStyle: () => ({}) } },
    } as unknown as HTMLElement

    expect(getCssValue(el, 'height')).toBe(0)
  })
})

describe('getScrollTop', () => {
  it('reads the window offset for the document', () => {
    win.pageYOffset = 120
    expect(getScrollTop()).toBe(120)
    expect(getScrollTop(doc)).toBe(120)
  })

  it('falls back to the document elements when pageYOffset is 0', () => {
    doc.documentElement.scrollTop = 30
    expect(getScrollTop(doc)).toBe(30)

    doc.documentElement.scrollTop = 0
    doc.body.scrollTop = 15
    expect(getScrollTop(doc)).toBe(15)
  })

  it('reads scrollTop from a regular element', () => {
    expect(getScrollTop(createElement(88))).toBe(88)
  })

  it('returns 0 when nothing is scrolled and the target is absent', () => {
    expect(getScrollTop(doc)).toBe(0)
    expect(getScrollTop(null as unknown as HTMLElement)).toBe(0)
  })
})

describe('setScrollTop', () => {
  it('accepts a number and writes it to the document', () => {
    setScrollTop(doc, 200)

    expect(doc.documentElement.scrollTop).toBe(200)
    expect(doc.body.scrollTop).toBe(200)
  })

  it('writes to the document elements when the target is the document', () => {
    setScrollTop(doc, 50)

    expect(doc.documentElement.scrollTop).toBe(50)
    expect(doc.body.scrollTop).toBe(50)
  })

  it('normalizes a missing value to 0', () => {
    setScrollTop(doc)
    expect(doc.documentElement.scrollTop).toBe(0)
  })

  it('writes to a regular element', () => {
    const el = createElement()
    setScrollTop(el, 12)

    expect(el.scrollTop).toBe(12)
  })
})

describe('getOffsetTop', () => {
  it('sums the offsetTop of the offsetParent chain', () => {
    const grandParent = { offsetTop: 100, offsetParent: null }
    const parent = { offsetTop: 20, offsetParent: grandParent }
    const child = { offsetTop: 3, offsetParent: parent }

    expect(getOffsetTop(child as unknown as HTMLElement)).toBe(123)
  })

  it('returns 0 for a null target', () => {
    expect(getOffsetTop(null)).toBe(0)
  })
})

describe('scrollTo', () => {
  it('delegates to the native smooth scroll for the document', () => {
    const cancel = scrollTo(doc, 500)

    expect(win.scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'smooth' })
    // 文档滚动由浏览器接管，取消函数为空实现。
    expect(cancel()).toBeUndefined()
  })

  it('animates a regular element and self-stops at the target', () => {
    vi.useFakeTimers()
    const el = createElement(0)

    scrollTo(el, 32, 160)
    // step = ceil(160 / 16) = 10 帧后动画完成。
    vi.advanceTimersByTime(20 * 12)

    expect(el.scrollTop).toBe(32)
    vi.useRealTimers()
  })

  it('cancels the previous animation on the same element', () => {
    vi.useFakeTimers()
    const el = createElement(0)

    scrollTo(el, 100, 160)
    vi.advanceTimersByTime(20 * 3)
    const afterFirst = el.scrollTop

    scrollTo(el, 0, 160)
    vi.advanceTimersByTime(20 * 12)

    expect(el.scrollTop).toBe(0)
    expect(afterFirst).toBeGreaterThan(0)
    vi.useRealTimers()
  })
})
