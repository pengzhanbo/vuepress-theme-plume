import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { scrollTo } from '../src/client/utils/dom.js'

/**
 * Create a scroll target that records every write, so the animation progress can be
 * asserted without a real DOM.
 *
 * 创建一个会记录每次写入的滚动目标，从而无需真实 DOM 即可断言动画进度。
 */
function createScrollTarget(initial = 0) {
  let value = initial
  const written: number[] = []
  const el = {} as HTMLElement

  Object.defineProperty(el, 'scrollTop', {
    get: () => value,
    set: (next: number) => {
      value = next
      written.push(next)
    },
  })

  return {
    el,
    written,
    get value() {
      return value
    },
  }
}

/**
 * Advance one animation frame. The interval is `1000 / 60`ms, so advancing 20ms
 * triggers exactly one callback.
 *
 * 推进一个动画帧。动画间隔为 `1000 / 60`ms，推进 20ms 恰好触发一次回调。
 */
function tick(times = 1): void {
  vi.advanceTimersByTime(20 * times)
}

describe('scrollTo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // `getScrollTop`/`setScrollTop` 会把目标与全局 `document` 比较，
    // node 环境下需要一个占位值。
    // `getScrollTop`/`setScrollTop` compare the target with the global `document`,
    // which needs a placeholder under the node environment.
    vi.stubGlobal('document', {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('should stop the animation when the returned cancel function is called', () => {
    const target = createScrollTarget()

    const cancel = scrollTo(target.el, 100, 160)
    tick(3)
    expect(target.written).toHaveLength(3)

    cancel()
    tick(20)
    // 取消后不应再有任何写入：组件卸载时可以用它提前终止动画。
    expect(target.written).toHaveLength(3)
  })

  it('should cancel the previous animation when the same target scrolls again', () => {
    const target = createScrollTarget()

    scrollTo(target.el, 100, 160)
    tick(3)
    expect(target.written).toHaveLength(3)

    // 第二次滚动会取消第一次尚未完成的动画，避免多个定时器同时写入 `scrollTop`。
    scrollTo(target.el, 0, 160)
    tick(3)
    expect(target.written).toHaveLength(6)

    // 第二次动画走完 10 步后自行停止，并收敛到新的目标值。
    tick(20)
    expect(target.written).toHaveLength(13)
    expect(target.value).toBe(0)
  })

  it('should stop automatically once the animation completes', () => {
    const target = createScrollTarget()

    scrollTo(target.el, 64, 160)
    tick(20)

    // step = ceil(160 / 16) = 10，动画在第 10 帧结束后停止。
    expect(target.written).toHaveLength(10)
    expect(target.value).toBe(64)
  })
})
