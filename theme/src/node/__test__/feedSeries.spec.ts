import type { App, Page, SiteData } from 'vuepress'
import type { SeriesOptions, ThemeCollectionItem, ThemeOptions, ThemePageData } from '../../shared/index.js'
import { describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

vi.mock('../utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/index.js')>()
  return {
    ...actual,
    logger: hoisted.logger,
  }
})

const {
  resolveSeriesFeed,
  resolveLocaleSeriesChannels,
  buildSeriesEntries,
} = await import('../features/feed/series.js')
const { planFeedChannels, resolveSeriesFeedUrls, injectSeriesFeedLinks } = await import('../features/feed/plan.js')
const { resolveChannelDescriptors } = await import('../features/feed/collect.js')
const { normalizeFeedOptions, resolveLocaleFeedOptions } = await import('../features/feed/options.js')
const { toSeriesData } = await import('../prepare/series.js')

interface PageOptions {
  name: string
  locale?: string
  dir?: string
  title?: string
  series?: string
  seriesOrder?: number
  createTime?: string
  frontmatter?: Record<string, unknown>
  data?: Record<string, unknown>
  virtual?: boolean
}

function createPage(options: PageOptions): Page<ThemePageData> {
  const locale = options.locale ?? '/'
  const dir = options.dir ?? 'blog'
  const prefix = locale === '/' ? '' : locale.slice(1)
  const filePathRelative = `${prefix}${dir}/${options.name}.md`

  return {
    path: `${locale}${dir}/${options.name}/`,
    pathLocale: locale,
    filePathRelative: options.virtual ? null : filePathRelative,
    filePath: options.virtual ? null : `/root/${filePathRelative}`,
    title: options.title ?? options.name,
    date: '0000-00-00',
    frontmatter: {
      createTime: options.createTime ?? '2024-01-01 00:00:00',
      ...(options.series ? { series: options.series } : {}),
      ...(options.seriesOrder !== undefined ? { seriesOrder: options.seriesOrder } : {}),
      ...options.frontmatter,
    },
    data: { categoryList: [], ...options.data },
    contentRendered: '',
  } as unknown as Page<ThemePageData>
}

const siteData = {
  base: '/',
  lang: 'en-US',
  title: 'Site',
  description: 'Site description',
  head: [],
  locales: {
    '/': { title: 'Site', description: 'Site description', lang: 'en-US' },
    '/en/': { title: 'Site EN', description: 'English description', lang: 'en-US' },
  },
} as unknown as SiteData

function createApp(
  pages: Page<ThemePageData>[],
  { isBuild = true, base = '/' }: { isBuild?: boolean, base?: string } = {},
): App {
  return {
    pages,
    env: { isBuild },
    options: { base },
    siteData,
    dir: { dest: (file: string) => `/dist/${file}` },
  } as unknown as App
}

interface OptionsInput {
  feed?: unknown
  series?: SeriesOptions | boolean
  enSeries?: SeriesOptions | boolean
  collections?: ThemeCollectionItem[]
}

function createOptions({ feed = true, series, enSeries, collections = [] }: OptionsInput): ThemeOptions {
  return {
    hostname: 'https://example.com',
    feed,
    series,
    locales: {
      '/': { collections, ...(series ? { series } : {}) },
      ...(enSeries ? { '/en/': { series: enSeries } } : {}),
    },
  } as unknown as ThemeOptions
}

function resolveChannels(app: App, options: ThemeOptions, locale = '/') {
  const resolved = resolveLocaleFeedOptions(options, locale)
  if (!resolved)
    throw new Error('feed is not enabled')

  const usedDirs = new Set(
    resolveChannelDescriptors(app.siteData, options, locale, resolved).map(descriptor => descriptor.dir),
  )

  return resolveLocaleSeriesChannels(app, options, locale, resolved, usedDirs)
}

describe('resolveSeriesFeed', () => {
  it('follows `perSeries` when the series does not declare `feed`', () => {
    expect(resolveSeriesFeed(undefined, normalizeFeedOptions({ perSeries: true })!))
      .toEqual({ channel: true })
    expect(resolveSeriesFeed(undefined, normalizeFeedOptions({})!))
      .toEqual({ channel: false })
  })

  it('disables the channel with `feed: false`', () => {
    const resolved = normalizeFeedOptions({ perSeries: true })!

    expect(resolveSeriesFeed({ feed: false }, resolved)).toEqual({ channel: false })
  })

  it('opts in with `feed: true` or an object', () => {
    const resolved = normalizeFeedOptions({})!

    expect(resolveSeriesFeed({ feed: true }, resolved)).toMatchObject({ channel: true })

    expect(resolveSeriesFeed({
      feed: { title: 'T', description: 'D', link: '/x/', formats: ['atom'], content: 'full', limit: 5 },
    }, resolved)).toEqual({
      channel: true,
      title: 'T',
      description: 'D',
      link: '/x/',
      formats: ['atom'],
      content: 'full',
      limit: 5,
    })
  })

  it('clamps the limit and drops unknown formats', () => {
    const resolved = normalizeFeedOptions({})!

    expect(resolveSeriesFeed({ feed: { limit: 1000 } }, resolved).limit).toBe(200)
    expect(resolveSeriesFeed({ feed: { limit: 0 } }, resolved).limit).toBe(1)
    expect(resolveSeriesFeed({ feed: { formats: ['xml' as never] } }, resolved).formats).toEqual([])
  })
})

describe('resolveLocaleSeriesChannels', () => {
  it('creates a channel for every series when `perSeries` is enabled', () => {
    const options = createOptions({
      feed: { perSeries: true },
      series: { items: { vue3: { title: 'Vue 3', description: 'Reactivity' } } },
    })
    const app = createApp([
      createPage({ name: 'a', series: 'vue3', seriesOrder: 1 }),
      createPage({ name: 'b', series: 'vue3', seriesOrder: 2 }),
    ])

    const [channel] = resolveChannels(app, options)

    expect(channel).toMatchObject({
      link: '/series/vue3/',
      dir: 'series/vue3',
      title: 'Vue 3',
      description: 'Reactivity',
      formats: ['rss'],
      series: 'vue3',
    })
    expect(channel.pages).toHaveLength(2)
    // 系列默认不截断 / Series are not truncated by default
    expect(channel.limit).toBe(Number.POSITIVE_INFINITY)
  })

  it('keeps `perSeries` off by default and opts in per series', () => {
    const options = createOptions({
      series: { items: { vue3: { title: 'Vue 3' }, notes: { title: 'Notes', feed: true } } },
    })
    const app = createApp([
      createPage({ name: 'a', series: 'vue3' }),
      createPage({ name: 'b', series: 'vue3' }),
      createPage({ name: 'c', series: 'notes' }),
      createPage({ name: 'd', series: 'notes' }),
    ])

    const channels = resolveChannels(app, options)

    expect(channels.map(channel => channel.series)).toEqual(['notes'])
  })

  it('honors `feed: false` over `perSeries`', () => {
    const options = createOptions({
      feed: { perSeries: true },
      series: { items: { vue3: { title: 'Vue 3', feed: false } } },
    })
    const app = createApp([
      createPage({ name: 'a', series: 'vue3' }),
      createPage({ name: 'b', series: 'vue3' }),
    ])

    expect(resolveChannels(app, options)).toEqual([])
  })

  it('keeps a single chapter series and falls back to the canonical link', () => {
    const options = createOptions({ feed: { perSeries: true }, series: true })
    const app = createApp([createPage({ name: 'a', series: 'vue3' })])

    const [channel] = resolveChannels(app, options)

    expect(channel).toMatchObject({ link: '/series/vue3/', dir: 'series/vue3', title: 'vue3' })
    expect(channel.pages).toHaveLength(1)
  })

  it('follows the series link when the landing page is managed by the author', () => {
    const options = createOptions({
      feed: { perSeries: true },
      series: { items: { notes: { title: 'Notes', page: false, link: '/notes/' } } },
    })
    const app = createApp([
      createPage({ name: 'a', series: 'notes' }),
      createPage({ name: 'b', series: 'notes' }),
    ])

    expect(resolveChannels(app, options)[0]).toMatchObject({ link: '/notes/', dir: 'notes' })
  })

  it('falls back to the canonical link for an external series link', () => {
    hoisted.logger.warn.mockClear()
    const options = createOptions({
      feed: { perSeries: true },
      series: { items: { notes: { title: 'Notes', page: false, link: 'https://example.com/notes/' } } },
    })
    const app = createApp([
      createPage({ name: 'a', series: 'notes' }),
      createPage({ name: 'b', series: 'notes' }),
    ])

    expect(resolveChannels(app, options)[0]).toMatchObject({ link: '/series/notes/', dir: 'series/notes' })
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('is not a site path'))
  })

  it('uses `feed.link` as the channel directory', () => {
    const options = createOptions({
      feed: { perSeries: true },
      series: { items: { vue3: { title: 'Vue 3', feed: { link: '/feeds/vue3/' } } } },
    })
    const app = createApp([
      createPage({ name: 'a', series: 'vue3' }),
      createPage({ name: 'b', series: 'vue3' }),
    ])

    expect(resolveChannels(app, options)[0]).toMatchObject({ link: '/feeds/vue3/', dir: 'feeds/vue3' })
  })

  it('slugifies the series id for the canonical path', () => {
    const options = createOptions({ feed: { perSeries: true }, series: true })
    const app = createApp([
      createPage({ name: 'a', series: 'Vue 3' }),
      createPage({ name: 'b', series: 'Vue 3' }),
    ])

    expect(resolveChannels(app, options)[0].dir).toBe('series/vue-3')
  })

  it('keeps locales isolated', () => {
    const options = createOptions({
      feed: { perSeries: true },
      series: { items: { vue3: { title: 'Vue 3' } } },
      enSeries: { items: { vue3: { title: 'Vue 3 EN' } } },
    })
    const app = createApp([
      createPage({ name: 'a', series: 'vue3' }),
      createPage({ name: 'b', series: 'vue3' }),
      createPage({ name: 'a', series: 'vue3', locale: '/en/' }),
      createPage({ name: 'b', series: 'vue3', locale: '/en/' }),
    ])

    expect(resolveChannels(app, options)[0]).toMatchObject({ dir: 'series/vue3', title: 'Vue 3' })
    expect(resolveChannels(app, options, '/en/')[0])
      .toMatchObject({ dir: 'en/series/vue3', title: 'Vue 3 EN', link: '/en/series/vue3/' })
  })

  it('drops a channel whose directory is already used by a collection', () => {
    hoisted.logger.warn.mockClear()
    const options = createOptions({
      feed: { perSeries: true, perCollection: true },
      series: { items: { notes: { title: 'Notes', feed: { link: '/blog/' } } } },
      collections: [{ type: 'post', dir: 'blog', title: 'Blog', link: '/blog/' } as ThemeCollectionItem],
    })
    const app = createApp([
      createPage({ name: 'a', series: 'notes' }),
      createPage({ name: 'b', series: 'notes' }),
    ])

    const channels = resolveChannels(app, options)

    expect(channels).toEqual([])
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('channel output path conflict'))
  })

  it('skips an undeclared series when `autoCreate` is disabled', () => {
    const options = createOptions({
      feed: { perSeries: true },
      series: { autoCreate: false, items: {} },
    })
    const app = createApp([
      createPage({ name: 'a', series: 'unknown' }),
      createPage({ name: 'b', series: 'unknown' }),
    ])

    expect(resolveChannels(app, options)).toEqual([])
  })

  it('excludes chapters that opt out of feeds', () => {
    const options = createOptions({ feed: { perSeries: true }, series: true })
    const app = createApp([
      createPage({ name: 'a', series: 'vue3', seriesOrder: 1 }),
      createPage({ name: 'b', series: 'vue3', seriesOrder: 2, frontmatter: { feed: false } }),
      createPage({ name: 'c', series: 'vue3', seriesOrder: 3, data: { _e: 'hashed' } }),
    ])

    const [channel] = resolveChannels(app, options)

    expect(channel.pages.map(page => page.path)).toEqual(['/blog/a/'])
  })
})

describe('buildSeriesEntries', () => {
  it('keeps the chapter order instead of the published date', () => {
    const options = createOptions({ feed: { perSeries: true }, series: true })
    // 发布日期与篇目顺序完全相反，避免两种排序得到相同结果
    // Published dates are the exact opposite of the chapter order, so both orderings cannot agree
    const app = createApp([
      createPage({ name: 'a', series: 'vue3', seriesOrder: 1, createTime: '2024-01-01 00:00:00' }),
      createPage({ name: 'b', series: 'vue3', seriesOrder: 2, createTime: '2024-02-01 00:00:00' }),
      createPage({ name: 'c', series: 'vue3', seriesOrder: 3, createTime: '2024-03-01 00:00:00' }),
    ])
    const resolved = resolveLocaleFeedOptions(options, '/')!
    const [channel] = resolveChannels(app, options)

    const { entries } = buildSeriesEntries(channel, app, resolved, 'https://example.com')

    expect(entries.map(entry => entry.path)).toEqual(['/blog/a/', '/blog/b/', '/blog/c/'])
  })

  it('does not truncate a long series unless `limit` is set', () => {
    const pages = Array.from({ length: 25 }, (_, index) => createPage({
      name: `p${index}`,
      series: 'vue3',
      seriesOrder: index + 1,
      createTime: `2024-01-01 00:00:${String(index).padStart(2, '0')}`,
    }))
    const options = createOptions({ feed: { perSeries: true }, series: true })
    const app = createApp(pages)
    const resolved = resolveLocaleFeedOptions(options, '/')!
    const [channel] = resolveChannels(app, options)

    expect(buildSeriesEntries(channel, app, resolved, 'https://example.com').entries).toHaveLength(25)

    const limited = createOptions({
      feed: { perSeries: true },
      series: { items: { vue3: { feed: { limit: 3 } } } },
    })
    const appLimited = createApp(pages)
    const limitedResolved = resolveLocaleFeedOptions(limited, '/')!
    const [limitedChannel] = resolveChannels(appLimited, limited)

    expect(buildSeriesEntries(limitedChannel, appLimited, limitedResolved, 'https://example.com').entries)
      .toHaveLength(3)
  })
})

describe('resolveSeriesFeedUrls', () => {
  it('returns nothing outside a production build', () => {
    const options = createOptions({ feed: { perSeries: true }, series: true })
    const app = createApp([
      createPage({ name: 'a', series: 'vue3' }),
      createPage({ name: 'b', series: 'vue3' }),
    ], { isBuild: false })

    expect(resolveSeriesFeedUrls(app, options).size).toBe(0)
  })

  it('returns nothing when `hostname` is missing', () => {
    const options = createOptions({ feed: { perSeries: true }, series: true })
    delete (options as { hostname?: string }).hostname
    const app = createApp([
      createPage({ name: 'a', series: 'vue3' }),
      createPage({ name: 'b', series: 'vue3' }),
    ])

    expect(resolveSeriesFeedUrls(app, options).size).toBe(0)
  })

  it('resolves a base prefixed url per series', () => {
    const options = createOptions({ feed: { perSeries: true }, series: true })
    const app = createApp([
      createPage({ name: 'a', series: 'vue3' }),
      createPage({ name: 'b', series: 'vue3' }),
    ], { base: '/docs/' })

    expect(resolveSeriesFeedUrls(app, options).get('/::vue3')).toBe('/docs/series/vue3/feed.xml')
  })

  it('feeds the client series data', () => {
    const options = createOptions({ feed: { perSeries: true }, series: true })
    const app = createApp([
      createPage({ name: 'a', series: 'vue3' }),
      createPage({ name: 'b', series: 'vue3' }),
    ])
    const series = resolveLocaleSeriesChannels(
      app,
      options,
      '/',
      resolveLocaleFeedOptions(options, '/')!,
      new Set(resolveChannelDescriptors(app.siteData, options, '/', resolveLocaleFeedOptions(options, '/')!).map(d => d.dir)),
    )

    const data = toSeriesData(
      series.map(channel => ({
        id: channel.series!,
        locale: channel.locale,
        lang: 'en',
        title: channel.title,
        order: 'auto' as const,
        nav: true,
        chapters: channel.pages.map((page, index) => ({
          page,
          path: page.path,
          title: page.title,
          order: index + 1,
          draft: false,
        })),
      })),
      resolveSeriesFeedUrls(app, options),
    )

    expect(data['/']!.vue3!.feedUrl).toBe('/series/vue3/feed.xml')
  })
})

describe('injectSeriesFeedLinks', () => {
  it('injects an alternate link into every chapter page', () => {
    const options = createOptions({ feed: { perSeries: true }, series: true })
    const pages = [
      createPage({ name: 'a', series: 'vue3' }),
      createPage({ name: 'b', series: 'vue3' }),
    ]
    const app = createApp(pages)

    injectSeriesFeedLinks(app, options)

    expect(pages[0].frontmatter.head).toEqual([
      ['link', {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'vue3',
        href: 'https://example.com/series/vue3/feed.xml',
      }],
    ])
  })

  it('keeps a collection link injected earlier and does not duplicate the series link', () => {
    const options = createOptions({
      feed: { perSeries: true, perCollection: true },
      series: true,
      collections: [{ type: 'post', dir: 'blog', title: 'Blog', link: '/blog/' } as ThemeCollectionItem],
    })
    const pages = [
      createPage({
        name: 'a',
        series: 'vue3',
        frontmatter: {
          head: [
            ['link', { rel: 'alternate', type: 'application/rss+xml', href: 'https://example.com/blog/feed.xml' }],
            ['link', { rel: 'alternate', type: 'application/rss+xml', href: 'https://example.com/series/vue3/feed.xml' }],
          ],
        },
      }),
      createPage({ name: 'b', series: 'vue3' }),
    ]
    const app = createApp(pages)

    injectSeriesFeedLinks(app, options)

    expect(pages[0].frontmatter.head).toHaveLength(2)
    expect(pages[0].frontmatter.head!.map(entry => entry[1]?.href)).toEqual([
      'https://example.com/blog/feed.xml',
      'https://example.com/series/vue3/feed.xml',
    ])
    expect(pages[1].frontmatter.head).toHaveLength(1)
  })

  it('leaves a user declared alternate link untouched', () => {
    const options = createOptions({ feed: { perSeries: true }, series: true })
    const pages = [
      createPage({
        name: 'a',
        series: 'vue3',
        frontmatter: {
          head: [['link', { rel: 'alternate', type: 'application/rss+xml', href: '/custom.xml' }]],
        },
      }),
      createPage({ name: 'b', series: 'vue3' }),
    ]
    const app = createApp(pages)

    injectSeriesFeedLinks(app, options)

    expect(pages[0].frontmatter.head).toHaveLength(1)
    expect(pages[1].frontmatter.head).toHaveLength(1)
  })

  it('honors `linkTag: false`, page level opt out and dev mode', () => {
    const disabled = createOptions({ feed: { perSeries: true, linkTag: false }, series: true })
    const pages = [createPage({ name: 'a', series: 'vue3' }), createPage({ name: 'b', series: 'vue3' })]
    injectSeriesFeedLinks(createApp(pages), disabled)
    expect(pages[0].frontmatter.head).toBeUndefined()

    const options = createOptions({ feed: { perSeries: true }, series: true })
    const optOut = [
      createPage({ name: 'a', series: 'vue3', frontmatter: { feed: false } }),
      createPage({ name: 'b', series: 'vue3' }),
    ]
    injectSeriesFeedLinks(createApp(optOut), options)
    expect(optOut[0].frontmatter.head).toBeUndefined()
    expect(optOut[1].frontmatter.head).toHaveLength(1)

    const devPages = [createPage({ name: 'a', series: 'vue3' }), createPage({ name: 'b', series: 'vue3' })]
    injectSeriesFeedLinks(createApp(devPages, { isBuild: false }), options)
    expect(devPages[0].frontmatter.head).toBeUndefined()
  })
})

describe('planFeedChannels', () => {
  it('drops a format whose output path is taken by another format of the channel', () => {
    hoisted.logger.warn.mockClear()
    const options = createOptions({
      feed: { perSeries: true, filename: { rss: 'feed.xml', atom: 'feed.xml' } },
      series: { items: { vue3: { feed: { formats: ['rss', 'atom'] } } } },
    })
    const pages = [createPage({ name: 'a', series: 'vue3' }), createPage({ name: 'b', series: 'vue3' })]
    const app = createApp(pages)

    const plan = planFeedChannels(app, options).find(item => item.channel.series === 'vue3')!

    // 同名文件只写出一次，订阅地址与 head 都不会公布被跳过的格式
    // The shared filename is written once, the skipped format is never advertised
    expect(plan.files).toEqual([{ format: 'rss', filepath: 'series/vue3/feed.xml' }])
    expect(resolveSeriesFeedUrls(app, options).get('/::vue3')).toBe('/series/vue3/feed.xml')
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('output conflict'))

    injectSeriesFeedLinks(app, options)

    expect(pages[0].frontmatter.head).toHaveLength(1)
  })

  it('arbitrates output paths across locales like the file writer', () => {
    hoisted.logger.warn.mockClear()
    const options = createOptions({
      feed: { perSeries: true },
      // 根语言的系列占用了英文系列的默认目录 / The root series claims the en directory
      series: { items: { vue3: { feed: { link: '/en/series/vue3/' } } } },
      enSeries: true,
    })
    const pages = [
      createPage({ name: 'a', series: 'vue3' }),
      createPage({ name: 'b', series: 'vue3' }),
      createPage({ name: 'a', series: 'vue3', locale: '/en/' }),
      createPage({ name: 'b', series: 'vue3', locale: '/en/' }),
    ]
    const app = createApp(pages)

    const plans = planFeedChannels(app, options)
    const root = plans.find(plan => plan.locale === '/' && plan.channel.series === 'vue3')!
    const en = plans.find(plan => plan.locale === '/en/' && plan.channel.series === 'vue3')!

    expect(root.files).toEqual([{ format: 'rss', filepath: 'en/series/vue3/feed.xml' }])
    expect(en.files).toEqual([])
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('output conflict'))

    const urls = resolveSeriesFeedUrls(app, options)
    expect(urls.get('/::vue3')).toBe('/en/series/vue3/feed.xml')
    expect(urls.has('/en/::vue3')).toBe(false)

    injectSeriesFeedLinks(app, options)

    // 英文页面不注入根语言频道的链接 / English pages never get the root channel link
    expect(pages[2].frontmatter.head).toBeUndefined()
    expect(pages[0].frontmatter.head).toHaveLength(1)
  })
})
