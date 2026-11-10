import { describe, expect, it } from 'vitest'
import {
  normalizePreviewPath,
  resolveAnchorKey,
  resolvePreviewPosition,
} from '../utils/link-preview.js'

const ORIGIN = 'https://example.com'

describe('normalizePreviewPath (client mirror)', () => {
  it.each([
    ['/guide/', '/guide/'],
    ['/guide/index.html', '/guide/'],
    ['/index.html', '/'],
    ['/guide/%E9%85%8D%E7%BD%AE/', '/guide/配置/'],
    ['/a%zz/', '/a%zz/'],
    ['/config/theme.html', '/config/theme.html'],
  ])('%s -> %s', (input, expected) => {
    expect(normalizePreviewPath(input)).toBe(expected)
  })
})

describe('resolveAnchorKey', () => {
  it.each([
    ['#hash'],
    ['?query'],
    ['mailto:a@b.c'],
    ['tel:123456'],
    ['javascript:void(0)'],
    ['data:text/plain,x'],
    ['https://other.com/guide/'],
    ['//other.com/guide/'],
  ])('returns null for %s', (href) => {
    expect(resolveAnchorKey(href, '/', '/guide/', ORIGIN)).toBeNull()
  })

  it('returns null for the current page', () => {
    expect(resolveAnchorKey('/guide/', '/', '/guide/', ORIGIN)).toBeNull()
  })

  it('strips the site base', () => {
    expect(resolveAnchorKey('/docs/guide/x.html', '/docs/', '/', ORIGIN)).toBe('/guide/x.html')
  })

  it('decodes the path like the build time implementation', () => {
    expect(resolveAnchorKey('/guide/%E9%85%8D%E7%BD%AE/', '/', '/', ORIGIN)).toBe('/guide/配置/')
  })

  it('resolves relative hrefs against the current route', () => {
    expect(resolveAnchorKey('../config/', '/', '/guide/markdown/', ORIGIN)).toBe('/guide/config/')
  })

  it('normalizes index.html into a directory route', () => {
    expect(resolveAnchorKey('/guide/index.html', '/', '/', ORIGIN)).toBe('/guide/')
  })
})

describe('resolvePreviewPosition', () => {
  const viewport = { width: 1440, height: 900 }

  function anchor(overrides: Partial<Record<'top' | 'left' | 'right' | 'bottom' | 'width' | 'height', number>> = {}) {
    const rect = { top: 100, left: 200, right: 260, bottom: 120, width: 60, height: 20, ...overrides }
    return rect
  }

  const card = { width: 360, height: 120 }

  it('places the card below when there is enough space', () => {
    expect(resolvePreviewPosition(anchor(), card, viewport)).toEqual({
      top: 128,
      left: 200,
      placement: 'bottom',
    })
  })

  it('flips above when there is no space below', () => {
    const position = resolvePreviewPosition(anchor({ top: 800, bottom: 820 }), card, viewport)
    expect(position.placement).toBe('top')
    expect(position.top).toBe(800 - 8 - 120)
  })

  it('clamps into a very short viewport', () => {
    const position = resolvePreviewPosition(anchor({ top: 20, bottom: 40 }), card, { width: 1440, height: 100 })
    expect(position.top).toBe(8)
    expect(position.placement).toBe('bottom')
  })

  it('clamps to the right edge', () => {
    const position = resolvePreviewPosition(anchor({ left: 1300, right: 1360 }), card, viewport)
    expect(position.left).toBe(1440 - 360 - 8)
  })

  it('clamps to the left edge', () => {
    const position = resolvePreviewPosition(anchor({ left: 0, right: 60 }), card, viewport)
    expect(position.left).toBe(8)
  })
})
