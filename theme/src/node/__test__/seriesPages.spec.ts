import type { App, Page } from 'vuepress'
import type { ThemeOptions, ThemePageData } from '../../shared/index.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), success: vi.fn(), load: vi.fn() },
  createPage: vi.fn(),
}))

vi.mock('../utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/index.js')>()
  return {
    ...actual,
    logger: hoisted.logger,
  }
})

vi.mock('vuepress/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vuepress/core')>()
  return { ...actual, createPage: hoisted.createPage }
})

const { resolveSeriesPageTasks } = await import('../features/series/pages.js')

interface PageOptions {
  locale?: string
  series?: string
  seriesOrder?: number
  type?: string
}

function createPage(name: string, options: PageOptions = {}): Page<ThemePageData> {
  const locale = options.locale ?? '/'
  const prefix = locale === '/' ? '' : locale.slice(1)

  return {
    path: `${locale}blog/${name}/`,
    filePathRelative: `${prefix}blog/${name}.md`,
    filePath: `/root/${prefix}blog/${name}.md`,
    pathLocale: locale,
    title: name,
    lang: locale === '/' ? 'en' : locale.slice(1, -1),
    date: '2024-01-01',
    frontmatter: {
      series: options.series ?? 'vue3-in-depth',
      seriesOrder: options.seriesOrder,
      createTime: '2024-01-01 00:00:00',
    },
    data: { type: options.type },
    content: '',
    contentRendered: '',
  } as unknown as Page<ThemePageData>
}

function createApp(pages: Page<ThemePageData>[]): App {
  return { pages, env: { isBuild: false } } as unknown as App
}

function createOptions(series: unknown): ThemeOptions {
  return { series, locales: { '/': {}, '/zh/': {} } } as unknown as ThemeOptions
}

beforeEach(() => {
  vi.clearAllMocks()
  hoisted.createPage.mockImplementation(async (_app: unknown, options: unknown) => options)
})

describe('resolveSeriesPageTasks', () => {
  it('should use the default path', async () => {
    const app = createApp([
      createPage('a', { seriesOrder: 1 }),
      createPage('b', { seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({}))
    const page = await tasks[0]!() as unknown as { path: string }

    expect(tasks).toHaveLength(1)
    expect(page.path).toBe('/series/vue3-in-depth/')
  })

  it('should honor a custom `linkPrefix`', async () => {
    const app = createApp([
      createPage('a', { seriesOrder: 1 }),
      createPage('b', { seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({ linkPrefix: '/collections' }))
    const page = await tasks[0]!() as unknown as { path: string }

    expect(page.path).toBe('/collections/vue3-in-depth/')
  })

  it('should honor a custom `link`', async () => {
    const app = createApp([
      createPage('a', { seriesOrder: 1 }),
      createPage('b', { seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({
      items: { 'vue3-in-depth': { link: '/my-series' } },
    }))
    const page = await tasks[0]!() as unknown as { path: string }

    expect(page.path).toBe('/my-series/')
  })

  it('should prepend the locale prefix', async () => {
    const app = createApp([
      createPage('a', { seriesOrder: 1, locale: '/zh/' }),
      createPage('b', { seriesOrder: 2, locale: '/zh/' }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({}))
    const page = await tasks[0]!() as unknown as { path: string }

    expect(page.path).toBe('/zh/series/vue3-in-depth/')
  })

  it('should skip the task when the path is occupied', async () => {
    const occupied = createPage('landing')
    occupied.path = '/series/vue3-in-depth/'

    const app = createApp([
      occupied,
      createPage('a', { seriesOrder: 1 }),
      createPage('b', { seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({}))

    // 冲突时跳过创建，且不输出任何指向用户页面的链接
    // The conflicting series is skipped, no link is exposed
    expect(tasks).toHaveLength(0)
  })

  it('should skip the second series when two slugs collide', async () => {
    const app = createApp([
      createPage('a', { series: 'a b', seriesOrder: 1 }),
      createPage('b', { series: 'a b', seriesOrder: 2 }),
      createPage('c', { series: 'a-b', seriesOrder: 1 }),
      createPage('d', { series: 'a-b', seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({}))

    expect(tasks).toHaveLength(1)
  })

  it('should not create a page when `page` is false', async () => {
    const app = createApp([
      createPage('a', { seriesOrder: 1 }),
      createPage('b', { seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({
      items: { 'vue3-in-depth': { page: false, link: '/handmade-series' } },
    }))

    expect(tasks).toHaveLength(0)
  })

  it('should not create the overview page by default', async () => {
    const app = createApp([
      createPage('a', { seriesOrder: 1 }),
      createPage('b', { seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({}))

    expect(tasks).toHaveLength(1)
    expect(await tasks[0]!() as unknown as { path: string }).toMatchObject({ path: '/series/vue3-in-depth/' })
  })

  it('should create the overview page when `index` is true', async () => {
    const app = createApp([
      createPage('a', { seriesOrder: 1 }),
      createPage('b', { seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({ index: true }))
    const page = await tasks[1]!() as unknown as {
      path: string
      frontmatter: Record<string, unknown>
    }

    expect(tasks).toHaveLength(2)
    expect(page.path).toBe('/series/')
    expect(page.frontmatter).toMatchObject({
      _pageLayout: 'posts-series-index',
      sidebar: false,
      aside: false,
      prev: false,
      next: false,
    })
  })

  it('should create one overview page per locale', async () => {
    const app = createApp([
      createPage('a', { seriesOrder: 1, locale: '/zh/' }),
      createPage('b', { seriesOrder: 2, locale: '/zh/' }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({ index: true }))
    const page = await tasks[1]!() as unknown as { path: string }

    expect(tasks).toHaveLength(2)
    expect(page.path).toBe('/zh/series/')
  })

  it('should honor a custom `linkPrefix` for the overview page', async () => {
    const app = createApp([
      createPage('a', { seriesOrder: 1 }),
      createPage('b', { seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({
      index: true,
      linkPrefix: '/collections/',
    }))
    const page = await tasks[1]!() as unknown as { path: string }

    expect(page.path).toBe('/collections/')
  })

  it('should skip the overview page when its path is occupied', async () => {
    const occupied = createPage('feed')
    occupied.path = '/series/'

    const app = createApp([
      occupied,
      createPage('a', { seriesOrder: 1 }),
      createPage('b', { seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({ index: true }))

    expect(tasks).toHaveLength(1)
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('overview page path'))
  })

  it('should create the landing page for a single chapter series', async () => {
    const app = createApp([createPage('a', { seriesOrder: 1 })])

    const tasks = await resolveSeriesPageTasks(app, createOptions({}))
    const page = await tasks[0]!() as unknown as { path: string }

    // 单篇系列同样有落地页，订阅频道的规范回退链接因此不会落空
    // A single chapter series owns a landing page, so the feed canonical link never dangles
    expect(tasks).toHaveLength(1)
    expect(page.path).toBe('/series/vue3-in-depth/')
  })

  it('should disable inheriting page features in the frontmatter', async () => {
    const app = createApp([
      createPage('a', { seriesOrder: 1 }),
      createPage('b', { seriesOrder: 2 }),
    ])

    const tasks = await resolveSeriesPageTasks(app, createOptions({
      items: { 'vue3-in-depth': { title: 'Vue 3', description: 'deep dive' } },
    }))
    const page = await tasks[0]!() as unknown as { frontmatter: Record<string, unknown> }

    expect(page.frontmatter).toMatchObject({
      _pageLayout: 'posts-series',
      seriesId: 'vue3-in-depth',
      title: 'Vue 3',
      description: 'deep dive',
      lang: 'en',
      sidebar: false,
      aside: false,
      prev: false,
      next: false,
      comments: false,
      editLink: false,
      contributors: false,
      changelog: false,
      lastUpdated: false,
    })
  })
})
