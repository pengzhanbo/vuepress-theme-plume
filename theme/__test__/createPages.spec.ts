import type { App, Page } from 'vuepress/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  getThemeConfig: vi.fn(() => ({}) as any),
  createPage: vi.fn(),
}))

vi.mock('../src/node/loadConfig/index.js', () => ({
  getThemeConfig: hoisted.getThemeConfig,
}))

// 保留 `vuepress/core` 的其它导出，仅替换 `createPage`，避免真实读取源文件。
vi.mock('vuepress/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vuepress/core')>()
  return { ...actual, createPage: hoisted.createPage }
})

const { createPages } = await import('../src/node/pages/createPages.js')

function createApp(siteData: Record<string, any> = { locales: { '/': { lang: 'en' } }, lang: 'en' }): App {
  return {
    pages: [],
    siteData,
  } as unknown as App
}

/** 以 `Page` 的宽松形状读取已创建的页面，便于断言 frontmatter 与路径。 */
function createdPages(app: App): Array<Page & { frontmatter: Record<string, unknown> }> {
  return app.pages as Array<Page & { frontmatter: Record<string, unknown> }>
}

/** 返回一个 post 集合配置。 */
function postCollection(dir: string, extra: Record<string, unknown> = {}) {
  return { type: 'post', dir, ...extra }
}

describe('createPages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hoisted.createPage.mockImplementation(async (_app: unknown, options: unknown) => options)
  })

  it('should create pages for every post collection and keep the declaration order', async () => {
    hoisted.getThemeConfig.mockReturnValue({
      locales: {
        '/': {
          collections: [
            postCollection('blog'),
            postCollection('note', { tags: false, archives: false, categories: false }),
            { type: 'doc', dir: 'docs' },
          ],
        },
      },
    })

    const app = createApp()
    await createPages(app)

    // doc 集合不生成额外页面；第二个集合仅生成文章列表页。
    expect(createdPages(app)).toHaveLength(5)
    expect(createdPages(app).map(page => page.frontmatter._pageLayout)).toEqual([
      'posts',
      'posts-tags',
      'posts-archives',
      'posts-categories',
      'posts',
    ])
    expect(createdPages(app)[0].path).toBe('/blog/')
  })

  it('should bound the number of pages created concurrently', async () => {
    // 40 个集合 × 4 个页面 = 160 个页面，足以触发并发上限。
    hoisted.getThemeConfig.mockReturnValue({
      locales: {
        '/': {
          collections: Array.from({ length: 40 }, (_, index) => postCollection(`blog-${index}`)),
        },
      },
    })

    let inFlight = 0
    let peak = 0
    hoisted.createPage.mockImplementation(async (_app: unknown, options: unknown) => {
      inFlight++
      peak = Math.max(peak, inFlight)
      // 让并发有机会重叠，否则串行调用也会得到峰值 1。
      await new Promise(resolve => setTimeout(resolve, 1))
      inFlight--
      return options
    })

    const app = createApp()
    await createPages(app)

    // 限制并发不能漏掉任何页面。
    expect(createdPages(app)).toHaveLength(160)
    expect(peak).toBeLessThanOrEqual(64)
  })

  it('should not create pages when no post collection is configured', async () => {
    hoisted.getThemeConfig.mockReturnValue({
      locales: { '/': { collections: [{ type: 'doc', dir: 'docs' }] } },
    })

    const app = createApp()
    await createPages(app)

    expect(createdPages(app)).toHaveLength(0)
    expect(hoisted.createPage).not.toHaveBeenCalled()
  })

  it('should ignore locales without collections', async () => {
    hoisted.getThemeConfig.mockReturnValue({ locales: { '/zh/': {} } })

    const app = createApp()
    await createPages(app)

    expect(createdPages(app)).toHaveLength(0)
  })

  it('should create no pages when locales are not configured', async () => {
    hoisted.getThemeConfig.mockReturnValue({})

    const app = createApp()
    await createPages(app)

    expect(createdPages(app)).toHaveLength(0)
  })

  it('should skip the post list page when `postList` is false', async () => {
    hoisted.getThemeConfig.mockReturnValue({
      locales: { '/': { collections: [postCollection('blog', { postList: false })] } },
    })

    const app = createApp()
    await createPages(app)

    expect(createdPages(app).map(page => page.frontmatter._pageLayout)).toEqual([
      'posts-tags',
      'posts-archives',
      'posts-categories',
    ])
  })

  it('should fall back to the site language when the root locale has none', async () => {
    hoisted.getThemeConfig.mockReturnValue({
      locales: { '/': { collections: [postCollection('blog')] } },
    })

    // 根语言缺少 `lang` 时，回退到 `siteData.lang`。
    const app = createApp({ locales: { '/': {} }, lang: 'fr' })
    await createPages(app)

    expect(createdPages(app)[0].frontmatter.lang).toBe('fr')
  })
})
