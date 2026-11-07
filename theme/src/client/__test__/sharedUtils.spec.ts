import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getAbsoluteTop,
  isActive,
  isGradient,
  normalize,
  numToUnit,
  toArray,
} from '../utils/shared.js'
import { stripHtmlTags } from '../utils/strip-html-tags.js'

describe('stripHtmlTags', () => {
  it('removes simple and nested tags while keeping the text', () => {
    expect(stripHtmlTags('<div><b>Hello</b> <span>World</span></div>')).toBe('Hello World')
    expect(stripHtmlTags('plain text')).toBe('plain text')
    // 非标签的尖括号不应被删除。
    expect(stripHtmlTags('a < b')).toBe('a < b')
  })

  it('repeats until no tag is left, which defuses nested tag fragments', () => {
    // 第一轮移除内层 `<script>` 后会重新拼出一个完整的 `<script>`，必须再处理一次。
    expect(stripHtmlTags('<scr<script>ipt>')).toBe('')
  })
})

describe('normalize', () => {
  it('removes the hash and the markdown / html extension', () => {
    expect(normalize('/guide/a.md#intro')).toBe('/guide/a')
    expect(normalize('/guide/a.html')).toBe('/guide/a')
    expect(normalize('/guide/README.md')).toBe('/guide/')
    expect(normalize('/guide/index.md#top')).toBe('/guide/')
  })
})

describe('isActive', () => {
  it('matches equivalent markdown, html and directory paths', () => {
    expect(isActive('/guide/', '/guide/index.md')).toBe(true)
    expect(isActive('/guide/a.html', '/guide/a.md')).toBe(true)
    expect(isActive('/guide/', '/guide/')).toBe(true)
    expect(isActive('/guide/', '/other/')).toBe(false)
  })

  it('returns false when there is nothing to match', () => {
    expect(isActive('/guide/')).toBe(false)
  })

  it('supports regular expressions', () => {
    expect(isActive('/guide/a/', '/guide/', true)).toBe(true)
    expect(isActive('/other/', '^\\/guide', true)).toBe(false)
  })
})

describe('numToUnit', () => {
  it('appends px to bare numbers and keeps existing units', () => {
    expect(numToUnit(10)).toBe('10px')
    expect(numToUnit('10')).toBe('10px')
    expect(numToUnit('10px')).toBe('10px')
    expect(numToUnit('2em')).toBe('2em')
    expect(numToUnit('auto')).toBe('auto')
  })

  it('returns an empty string for an undefined value', () => {
    expect(numToUnit()).toBe('')
  })
})

describe('isGradient', () => {
  it('detects every supported gradient function', () => {
    expect(isGradient('linear-gradient(red, blue)')).toBe(true)
    expect(isGradient('radial-gradient(red, blue)')).toBe(true)
    expect(isGradient('repeating-linear-gradient(red, blue)')).toBe(true)
    expect(isGradient('repeating-radial-gradient(red, blue)')).toBe(true)
    expect(isGradient('conic-gradient(red, blue)')).toBe(true)
  })

  it('rejects plain colors and urls', () => {
    expect(isGradient('red')).toBe(false)
    expect(isGradient('url(/bg.png)')).toBe(false)
  })
})

describe('toArray', () => {
  it('wraps a single value and keeps arrays', () => {
    expect(toArray(1)).toEqual([1])
    expect(toArray([1, 2])).toEqual([1, 2])
  })
})

describe('getAbsoluteTop', () => {
  let body: object

  beforeEach(() => {
    body = {}
    vi.stubGlobal('document', { body })
    vi.stubGlobal('window', {
      getComputedStyle: (element: { position?: string }) => ({
        position: element.position ?? 'static',
      }),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('accumulates the offset of every ancestor', () => {
    const parent = { offsetTop: 20, offsetParent: body, position: 'static' }
    const child = { offsetTop: 10, offsetParent: parent, position: 'static' }

    expect(getAbsoluteTop(child as unknown as HTMLElement)).toBe(30)
  })

  it('returns the offset of a fixed element directly', () => {
    const fixed = { offsetTop: 10, offsetParent: body, position: 'fixed' }

    expect(getAbsoluteTop(fixed as unknown as HTMLElement)).toBe(10)
  })

  it('returns NaN when the element is not attached to the document', () => {
    expect(getAbsoluteTop(null as unknown as HTMLElement)).toBe(Number.NaN)
  })
})
