import type { ThemeSeries, ThemeSeriesData } from '../../shared/index.js'
import { describe, expect, it, vi } from 'vitest'

// `@vuepress/helper/client` re-exports the pure path helpers, but the module itself
// loads the VuePress client runtime (which needs the virtual `@internal/routes`).
// Forward the real implementations from `@vuepress/helper/shared` instead.
//
// `@vuepress/helper/client` 只是重新导出纯路径工具，但模块本身会加载 VuePress
// 客户端运行时（依赖虚拟模块 `@internal/routes`）。这里改为从
// `@vuepress/helper/shared` 转发真实实现。
vi.mock('@vuepress/helper/client', async () => {
  const shared = await import('@vuepress/helper/shared')
  return { removeEndingSlash: shared.removeEndingSlash }
})

const { isSamePath, resolveSeriesPage } = await import('../utils/series.js')

function createSeries(id: string, link?: string): ThemeSeries {
  return { id, title: id, link, nav: true, chapters: [] }
}

const rootSeries = createSeries('vue', '/series/vue/')
const enSeries = createSeries('vue', '/en/series/vue/')

describe('resolveSeriesPage', () => {
  it('should prefer the landing page of the current locale over a same id series', () => {
    const data: ThemeSeriesData = {
      '/': { vue: rootSeries },
      '/en/': { vue: enSeries },
    }

    expect(resolveSeriesPage(data, '/en/', '/en/series/vue/', 'vue')).toBe(enSeries)
    expect(resolveSeriesPage(data, '/', '/series/vue/', 'vue')).toBe(rootSeries)
  })

  it('should not let the root locale win when the id only exists there', () => {
    const data: ThemeSeriesData = {
      '/': { vue: rootSeries },
    }

    // 英文页面的落地页路径与根语言系列不同，不能按同名 id 命中
    // The en landing page does not match the root series, so the id must not win
    expect(resolveSeriesPage(data, '/en/', '/en/series/vue/', 'vue')).toBeNull()
  })

  it('should match by id inside the current locale when there is no landing page', () => {
    const manual = createSeries('vue')
    const data: ThemeSeriesData = {
      '/': { vue: manual },
      '/en/': {},
    }

    expect(resolveSeriesPage(data, '/', '/guide/features/vue/', 'vue')).toBe(manual)
  })

  it('should fall back to another locale only when the landing page matches', () => {
    const moved = createSeries('features', '/moved/series/features/')
    const data: ThemeSeriesData = {
      '/': { features: moved },
      '/en/': {},
    }

    expect(resolveSeriesPage(data, '/en/', '/moved/series/features/', 'features')).toBe(moved)
    expect(resolveSeriesPage(data, '/en/', '/en/series/features/', 'features')).toBeNull()
  })

  it('should tolerate the trailing slash of a manual link', () => {
    const data: ThemeSeriesData = {
      '/': { vue: createSeries('vue', '/handmade-series') },
    }

    expect(resolveSeriesPage(data, '/', '/handmade-series/', 'vue')?.id).toBe('vue')
  })

  it('should return null for empty data or an unknown page', () => {
    expect(resolveSeriesPage({}, '/', '/series/vue/')).toBeNull()
    expect(resolveSeriesPage({ '/': {} }, '/', '/series/vue/', 'vue')).toBeNull()

    const data: ThemeSeriesData = { '/': { vue: rootSeries } }
    expect(resolveSeriesPage(data, '/', '/guide/quick-start/', 'other')).toBeNull()
  })
})

describe('isSamePath', () => {
  it('should ignore the trailing slash only', () => {
    expect(isSamePath('/a/', '/a')).toBe(true)
    expect(isSamePath('/a', '/a')).toBe(true)
    expect(isSamePath('/a/', '/a/b/')).toBe(false)
  })
})
