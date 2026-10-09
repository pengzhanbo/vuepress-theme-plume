import { afterEach, describe, expect, it, vi } from 'vitest'
import { createEmbedStatus } from '../src/client/utils/embedStatus.js'

describe('createEmbedStatus', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('stays in loading until the embed reports loaded', () => {
    vi.useFakeTimers()
    const controller = createEmbedStatus(15000)

    controller.start()
    vi.advanceTimersByTime(14000)
    expect(controller.status.value).toBe('loading')

    controller.markLoaded()
    expect(controller.status.value).toBe('loaded')

    // 加载完成后超时不应再改变状态。
    // Once loaded, the timeout must not change the status anymore.
    vi.advanceTimersByTime(60000)
    expect(controller.status.value).toBe('loaded')
  })

  it('falls back to error when load never fires within the timeout', () => {
    vi.useFakeTimers()
    const controller = createEmbedStatus(15000)

    controller.start()
    vi.advanceTimersByTime(15000)

    expect(controller.status.value).toBe('error')
  })

  it('disables the guard when the timeout is not positive', () => {
    vi.useFakeTimers()
    const controller = createEmbedStatus(0)

    controller.start()
    vi.advanceTimersByTime(600000)

    expect(controller.status.value).toBe('loading')
  })

  it('cancels the pending timeout on dispose', () => {
    vi.useFakeTimers()
    const controller = createEmbedStatus(15000)

    controller.start()
    controller.dispose()
    vi.advanceTimersByTime(60000)

    expect(controller.status.value).toBe('loading')
  })

  it('recovers to loaded when load arrives after the timeout', () => {
    vi.useFakeTimers()
    const controller = createEmbedStatus(15000)

    controller.start()
    vi.advanceTimersByTime(15000)
    expect(controller.status.value).toBe('error')

    controller.markLoaded()
    expect(controller.status.value).toBe('loaded')
  })

  it('marks the error state explicitly', () => {
    vi.useFakeTimers()
    const controller = createEmbedStatus(15000)

    controller.markError()
    expect(controller.status.value).toBe('error')

    // 显式错误后也不应被超时覆盖。
    // An explicit error must not be overwritten by the timeout.
    controller.start()
    vi.advanceTimersByTime(15000)
    expect(controller.status.value).toBe('error')
  })
})
