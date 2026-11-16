import type { Page } from 'vuepress'
import type { ThemeOptions, ThemePageData } from '../../shared/index.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), success: vi.fn(), load: vi.fn() },
}))

vi.mock('../utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/index.js')>()
  return {
    ...actual,
    logger: hoisted.logger,
  }
})

const { collectSeries } = await import('../features/series/index.js')

interface PageOptions {
  title?: string
  locale?: string
  dir?: string
  series?: unknown
  seriesOrder?: unknown
  createTime?: string
  minutes?: number
  draft?: boolean
  frontmatter?: Record<string, unknown>
  data?: Record<string, unknown>
}

function createPage(name: string, options: PageOptions = {}): Page<ThemePageData> {
  const locale = options.locale ?? '/'
  const dir = options.dir ?? 'blog'
  const prefix = locale === '/' ? '' : locale.slice(1)
  const frontmatter: Record<string, unknown> = {
    ...(options.createTime ? { createTime: options.createTime } : {}),
    ...(options.series !== undefined ? { series: options.series } : {}),
    ...(options.seriesOrder !== undefined ? { seriesOrder: options.seriesOrder } : {}),
    ...options.frontmatter,
  }

  if (options.draft)
    frontmatter.draft = true

  return {
    path: `${locale}${dir}/${name}/`,
    filePathRelative: `${prefix}${dir}/${name}.md`,
    filePath: `/root/${prefix}${dir}/${name}.md`,
    pathLocale: locale,
    title: options.title ?? name,
    lang: locale === '/' ? 'en' : locale.slice(1, -1),
    date: '0000-00-00',
    frontmatter,
    data: {
      readingTime: options.minutes
        ? { minutes: options.minutes, words: options.minutes * 300 }
        : undefined,
      ...options.data,
    },
    content: '',
    contentRendered: '',
  } as unknown as Page<ThemePageData>
}

function createOptions(series: unknown, locales: Record<string, unknown> = {}): ThemeOptions {
  return {
    series,
    locales: {
      '/': {},
      ...locales,
    },
  } as unknown as ThemeOptions
}

function run(pages: Page<ThemePageData>[], series: unknown, isBuild = false) {
  return collectSeries(pages, createOptions(series), { isBuild })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('collectSeries', () => {
  it('should sort by `seriesOrder` when every chapter declares it', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 3 }),
      createPage('b', { series: 'vue', seriesOrder: 1 }),
      createPage('c', { series: 'vue', seriesOrder: 2 }),
    ]

    const [series] = run(pages, {})

    expect(series!.chapters.map(item => item.path)).toEqual([
      '/blog/b/',
      '/blog/c/',
      '/blog/a/',
    ])
    expect(series!.chapters.map(item => item.order)).toEqual([1, 2, 3])
  })

  it('should fall back to create time when only some chapters declare an order', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1, createTime: '2024-03-01 00:00:00' }),
      createPage('b', { series: 'vue', createTime: '2024-01-01 00:00:00' }),
      createPage('c', { series: 'vue', createTime: '2024-02-01 00:00:00' }),
    ]

    const [series] = run(pages, {})

    expect(series!.chapters.map(item => item.path)).toEqual([
      '/blog/b/',
      '/blog/c/',
      '/blog/a/',
    ])
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('sorted by create time'))
  })

  it('should sort by create time and put pages without a date at the end', () => {
    const pages = [
      createPage('a', { series: 'vue', createTime: '2024-02-01 00:00:00' }),
      createPage('b', { series: 'vue', createTime: '2024-01-01 00:00:00' }),
      createPage('c', { series: 'vue' }),
    ]

    const [series] = run(pages, { order: 'time' })

    expect(series!.chapters.map(item => item.path)).toEqual([
      '/blog/b/',
      '/blog/a/',
      '/blog/c/',
    ])
  })

  it('should place chapters without an order at the end in `order` mode', () => {
    const pages = [
      createPage('a', { series: 'vue' }),
      createPage('b', { series: 'vue', seriesOrder: 2 }),
      createPage('c', { series: 'vue', seriesOrder: 1 }),
    ]

    const [series] = run(pages, { order: 'order' })

    expect(series!.chapters.map(item => item.path)).toEqual([
      '/blog/c/',
      '/blog/b/',
      '/blog/a/',
    ])
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('blog/a.md'))
  })

  it('should tie-break duplicated orders by create time then path', () => {
    const pages = [
      createPage('c', { series: 'vue', seriesOrder: 1, createTime: '2024-02-01 00:00:00' }),
      createPage('a', { series: 'vue', seriesOrder: 1, createTime: '2024-01-01 00:00:00' }),
      createPage('b', { series: 'vue', seriesOrder: 1 }),
    ]

    const [first] = run(pages, { order: 'order' })
    const [second] = run(pages, { order: 'order' })

    expect(first!.chapters.map(item => item.path)).toEqual([
      '/blog/a/',
      '/blog/c/',
      '/blog/b/',
    ])
    expect(second!.chapters).toEqual(first!.chapters)
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('duplicated `seriesOrder` 1'))
  })

  it('should merge pages from different collections into one series', () => {
    const pages = [
      createPage('a', { series: 'vue', dir: 'blog', seriesOrder: 1 }),
      createPage('b', { series: 'vue', dir: 'notes', seriesOrder: 2 }),
    ]

    const result = run(pages, {})

    expect(result).toHaveLength(1)
    expect(result[0]!.chapters.map(item => item.path)).toEqual(['/blog/a/', '/notes/b/'])
  })

  it('should never mix locales', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue', seriesOrder: 2 }),
      createPage('c', { series: 'vue', locale: '/zh/', seriesOrder: 1 }),
      createPage('d', { series: 'vue', locale: '/zh/', seriesOrder: 2 }),
    ]

    const result = run(pages, {})

    expect(result).toHaveLength(2)
    expect(result.map(item => item.locale).sort()).toEqual(['/', '/zh/'])
    expect(result.find(item => item.locale === '/')!.chapters).toHaveLength(2)
  })

  it('should exclude encrypted pages without leaking their titles', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1, title: 'Secret A' }),
      createPage('b', { series: 'vue', seriesOrder: 2, data: { _e: true }, title: 'Secret B' }),
      createPage('c', { series: 'vue', seriesOrder: 3 }),
    ]

    const [series] = run(pages, {})

    expect(series!.chapters.map(item => item.path)).toEqual(['/blog/a/', '/blog/c/'])
    expect(JSON.stringify(series!.chapters)).not.toContain('Secret B')
    expect(hoisted.logger.info).toHaveBeenCalledWith(expect.stringContaining('encrypted page is excluded'))
  })

  it('should exclude `article: false` pages', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue', seriesOrder: 2, frontmatter: { article: false } }),
      createPage('c', { series: 'vue', seriesOrder: 3 }),
    ]

    const [series] = run(pages, {})

    expect(series!.chapters.map(item => item.path)).toEqual(['/blog/a/', '/blog/c/'])
  })

  it('should exclude drafts when building', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue', seriesOrder: 2, draft: true }),
      createPage('c', { series: 'vue', seriesOrder: 3 }),
    ]

    const [series] = run(pages, {}, true)

    expect(series!.chapters.map(item => item.path)).toEqual(['/blog/a/', '/blog/c/'])
  })

  it('should keep drafts and mark them in dev', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue', seriesOrder: 2, draft: true }),
    ]

    const [series] = run(pages, {})

    expect(series!.chapters.map(item => item.draft)).toEqual([false, true])
  })

  it('should drop a series with a single chapter', () => {
    const pages = [createPage('a', { series: 'vue' })]

    expect(run(pages, {})).toHaveLength(0)
    expect(hoisted.logger.info).toHaveBeenCalledWith(expect.stringContaining('only 1 chapter'))
  })

  it('should create an undeclared series automatically', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue', seriesOrder: 2 }),
    ]

    const [series] = run(pages, {})

    expect(series!.title).toBe('vue')
    expect(series!.link).toBe('/series/vue/')
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('title is not declared'))
  })

  it('should ignore undeclared series when `autoCreate` is disabled', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue', seriesOrder: 2 }),
    ]

    expect(run(pages, { autoCreate: false })).toHaveLength(0)
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('`autoCreate` is disabled'))
  })

  it('should ignore a non string `series` value', () => {
    const pages = [
      createPage('a', { series: ['vue'] }),
      createPage('b', { series: ['vue'] }),
    ]

    expect(run(pages, {})).toHaveLength(0)
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('`series` must be a non-empty string'))
  })

  it('should collect nothing when the feature is disabled', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue', seriesOrder: 2 }),
    ]

    expect(run(pages, false)).toHaveLength(0)
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('the feature is not enabled'))
  })

  it('should be deterministic across runs', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue', seriesOrder: 1 }),
      createPage('c', { series: 'vue', seriesOrder: 1 }),
    ]

    expect(run(pages, { order: 'order' })).toEqual(run(pages, { order: 'order' }))
  })

  it('should not throw when a page cannot be read', () => {
    const page = createPage('a', { series: 'vue' })
    Object.defineProperty(page, 'frontmatter', {
      get() {
        throw new Error('boom')
      },
    })

    expect(() => run([page], {})).not.toThrow()
    expect(hoisted.logger.error).toHaveBeenCalled()
  })

  it('should skip a landing page whose path is occupied', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue', seriesOrder: 2 }),
    ]

    const [series] = collectSeries(pages, createOptions({}), {
      isBuild: false,
      occupiedPaths: new Set(['/series/vue/']),
    })

    expect(series!.pagePath).toBeUndefined()
    expect(series!.link).toBeUndefined()
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('is already used'))
  })

  it('should stay silent when `quiet` is set', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue' }),
    ]

    collectSeries(pages, createOptions({}), { isBuild: false, quiet: true })

    expect(hoisted.logger.warn).not.toHaveBeenCalled()
    expect(hoisted.logger.info).not.toHaveBeenCalled()
  })

  it('should read the locale level option', () => {
    const pages = [
      createPage('a', { series: 'vue', seriesOrder: 1 }),
      createPage('b', { series: 'vue', seriesOrder: 2 }),
    ]

    const options = createOptions(undefined, { '/': { series: { items: { vue: { title: 'Vue' } } } } })
    const result = collectSeries(pages, options, { isBuild: false })

    expect(result[0]!.title).toBe('Vue')
  })
})
