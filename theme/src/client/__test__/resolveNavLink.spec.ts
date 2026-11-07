import { beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  resolveRoute: vi.fn(),
}))

vi.mock('vuepress/client', () => ({
  resolveRoute: hoisted.resolveRoute,
}))

// `@vuepress/helper/client` re-exports the pure path helpers, but its module pulls in
// the VuePress client runtime (which needs the virtual `@internal/routes` module).
// The real helper implementations live in `@vuepress/helper/shared`, so only those are
// forwarded.
//
// `@vuepress/helper/client` 只是重新导出纯路径工具函数，但模块本身会加载 VuePress
// 客户端运行时（依赖虚拟模块 `@internal/routes`）。这里改为从 `@vuepress/helper/shared`
// 转发真实实现，避免引入浏览器运行时。
vi.mock('@vuepress/helper/client', async () => {
  const shared = await import('@vuepress/helper/shared')
  return {
    ensureEndingSlash: shared.ensureEndingSlash,
    ensureLeadingSlash: shared.ensureLeadingSlash,
    isLinkAbsolute: shared.isLinkAbsolute,
    isLinkWithProtocol: shared.isLinkWithProtocol,
  }
})

const { normalizeLink, normalizePrefix, resolveNavLink } = await import('../utils/resolveNavLink.js')

beforeEach(() => {
  hoisted.resolveRoute.mockReset()
})

describe('resolveNavLink', () => {
  it('uses the route metadata for text, icon and badge', () => {
    hoisted.resolveRoute.mockReturnValue({
      notFound: false,
      path: '/guide/',
      meta: { title: 'Guide', icon: 'mdi:book', badge: 'New' },
    })

    expect(resolveNavLink('/guide/README.md')).toEqual({
      text: 'Guide',
      link: '/guide/',
      icon: 'mdi:book',
      badge: 'New',
    })
  })

  it('derives the text from the path when the route has no title', () => {
    hoisted.resolveRoute.mockReturnValue({
      notFound: false,
      path: '/guide/getting-started.html',
      meta: {},
    })

    expect(resolveNavLink('/guide/getting-started.md')).toEqual({
      text: 'getting-started',
      link: '/guide/getting-started.html',
      icon: undefined,
      badge: undefined,
    })
  })

  it('removes `index` suffixes and decodes the remaining segment', () => {
    hoisted.resolveRoute.mockReturnValue({
      notFound: false,
      path: '/guide/%E4%B8%AD%E6%96%87/index.html',
      meta: {},
    })

    expect(resolveNavLink('/guide/中文/index.md').text).toBe('中文')
  })

  it('falls back to the raw path for a missing route', () => {
    hoisted.resolveRoute.mockReturnValue({
      notFound: true,
      path: '/missing/',
      meta: {},
    })

    expect(resolveNavLink('/missing/')).toEqual({ text: '/missing/', link: '/missing/' })
  })
})

describe('normalizeLink', () => {
  it('joins the base and the link without duplicate slashes', () => {
    expect(normalizeLink('/en/', 'guide')).toBe('/en/guide')
    expect(normalizeLink('/en//', 'guide')).toBe('/en/guide')
    expect(normalizeLink('', 'guide')).toBe('/guide')
  })

  it('keeps absolute and protocol links untouched', () => {
    expect(normalizeLink('/en/', '/guide')).toBe('/guide')
    expect(normalizeLink('/en/', 'https://example.com')).toBe('https://example.com')
  })
})

describe('normalizePrefix', () => {
  it('always appends a trailing slash', () => {
    expect(normalizePrefix('/en/', 'guide')).toBe('/en/guide/')
    expect(normalizePrefix('', '/guide')).toBe('/guide/')
  })
})
