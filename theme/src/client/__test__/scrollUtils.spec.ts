import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ANCHOR_SCROLL_OFFSET,
  clearSkippedScrollPosition,
  consumeSkippedScrollPosition,
  decodeHash,
  resolveAnchorScrollPosition,
  skipScrollPosition,
} from '../utils/scroll.js'

let win: any

beforeEach(() => {
  win = { scrollY: 0, scrollX: 0 }
  vi.stubGlobal('window', win)
  vi.stubGlobal('document', {
    getElementById: (id: string) => id === 'install' ? { getBoundingClientRect: () => ({ top: 100 }) } : null,
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('decodeHash', () => {
  it('decodes a percent-encoded hash', () => {
    expect(decodeHash('#%E9%85%8D%E7%BD%AE')).toBe('#配置')
  })

  it('keeps a malformed hash unchanged', () => {
    expect(decodeHash('#%E9%85')).toBe('#%E9%85')
  })
})

describe('resolveAnchorScrollPosition', () => {
  it('applies the navbar offset', () => {
    win.scrollY = 200

    expect(resolveAnchorScrollPosition('#install')).toEqual({
      left: 0,
      top: 200 + 100 - ANCHOR_SCROLL_OFFSET,
    })
  })

  it('accepts a hash without the leading # and a custom offset', () => {
    expect(resolveAnchorScrollPosition('install', 0)).toEqual({ left: 0, top: 100 })
  })

  it('decodes an encoded hash before looking up the anchor', () => {
    expect(resolveAnchorScrollPosition('#install')).not.toBeNull()
    expect(resolveAnchorScrollPosition('#%69nstall')).not.toBeNull()
  })

  it('never returns a negative top', () => {
    expect(resolveAnchorScrollPosition('#install', 500)).toEqual({ left: 0, top: 0 })
  })

  it('returns null for a missing or empty hash', () => {
    expect(resolveAnchorScrollPosition('#missing')).toBeNull()
    expect(resolveAnchorScrollPosition('#')).toBeNull()
    expect(resolveAnchorScrollPosition('')).toBeNull()
  })
})

describe('skipped scroll position', () => {
  it('consumes the position of the matching navigation only once', () => {
    const position = { left: 0, top: 320 }

    skipScrollPosition('/guide#install', position)

    expect(consumeSkippedScrollPosition('/guide#usage')).toBeNull()
    expect(consumeSkippedScrollPosition('/guide#install')).toEqual(position)
    expect(consumeSkippedScrollPosition('/guide#install')).toBeNull()
  })

  it('drops the position when the navigation did not happen', () => {
    skipScrollPosition('/guide#install', { left: 0, top: 320 })
    clearSkippedScrollPosition('/guide#usage')

    expect(consumeSkippedScrollPosition('/guide#install')).toEqual({ left: 0, top: 320 })

    skipScrollPosition('/guide#install', { left: 0, top: 320 })
    clearSkippedScrollPosition('/guide#install')

    expect(consumeSkippedScrollPosition('/guide#install')).toBeNull()
  })

  it('ignores an expired position', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)

    skipScrollPosition('/guide#install', { left: 0, top: 320 })
    vi.setSystemTime(10_000)

    expect(consumeSkippedScrollPosition('/guide#install')).toBeNull()
  })
})
