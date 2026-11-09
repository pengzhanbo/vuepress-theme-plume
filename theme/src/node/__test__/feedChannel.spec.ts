import type { App, Page, SiteData } from 'vuepress'
import type { ThemeCollectionItem, ThemeOptions, ThemePageData } from '../../shared/index.js'
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

const { resolveFeedChannels, buildEntries } = await import('../features/feed/collect.js')
const { resolveLocaleFeedOptions } = await import('../features/feed/options.js')

interface PageOptions {
  name: string
  dir?: string
  locale?: string
  title?: string
  frontmatter?: Record<string, unknown>
  data?: Record<string, unknown>
  virtual?: boolean
  contentRendered?: string
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
    // VuePress 对缺失的日期使用 `0000-00-00` / VuePress default date
    date: '0000-00-00',
    frontmatter: { createTime: '2024-01-01 00:00:00', ...options.frontmatter },
    data: { categoryList: [], ...options.data },
    contentRendered: options.contentRendered ?? '',
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

function createApp(pages: Page<ThemePageData>[], isBuild = true): App {
  return {
    pages,
    env: { isBuild },
    options: { base: '/' },
    siteData,
    dir: { dest: (file: string) => `/dist/${file}` },
  } as unknown as App
}

interface OptionsInput {
  collections?: ThemeCollectionItem[]
  enCollections?: ThemeCollectionItem[]
  feed?: unknown
}

function createOptions({ collections = [], enCollections, feed = true }: OptionsInput): ThemeOptions {
  return {
    feed,
    locales: {
      '/': { collections },
      ...(enCollections ? { '/en/': { collections: enCollections } } : {}),
    },
  } as unknown as ThemeOptions
}

function postCollection(dir: string, extra: Record<string, unknown> = {}): ThemeCollectionItem {
  return { type: 'post', dir, title: dir, link: `/${dir}/`, ...extra } as ThemeCollectionItem
}

function docCollection(dir: string, extra: Record<string, unknown> = {}): ThemeCollectionItem {
  return { type: 'doc', dir, title: dir, linkPrefix: `/${dir}/`, ...extra } as ThemeCollectionItem
}

function resolve(app: App, options: ThemeOptions, locale = '/') {
  const resolved = resolveLocaleFeedOptions(options, locale)
  if (!resolved)
    throw new Error('feed is not enabled')
  return resolveFeedChannels(app, options, locale, resolved)
}

function paths(channel: { pages: Page<ThemePageData>[] }): string[] {
  return channel.pages.map(page => page.path).sort()
}

describe('resolveFeedChannels', () => {
  it('generates only the global channel by default', () => {
    const options = createOptions({ collections: [postCollection('blog'), postCollection('notes')] })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'b', dir: 'notes' }),
    ])

    const channels = resolve(app, options)

    expect(channels).toHaveLength(1)
    expect(channels[0]).toMatchObject({ dir: '', link: '/' })
    expect(paths(channels[0])).toEqual(['/blog/a/', '/notes/b/'])
  })

  it('generates a channel per post collection when `perCollection` is enabled', () => {
    const options = createOptions({
      collections: [postCollection('blog'), postCollection('notes'), docCollection('guide')],
      feed: { perCollection: true },
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'b', dir: 'notes' }),
      createPage({ name: 'c', dir: 'guide' }),
    ])

    const channels = resolve(app, options)

    expect(channels.map(channel => channel.dir)).toEqual(['', 'blog', 'notes'])
    expect(paths(channels[0])).toEqual(['/blog/a/', '/notes/b/'])
    expect(paths(channels[1])).toEqual(['/blog/a/'])
  })

  it('includes doc collections when `includeDocCollections` is enabled', () => {
    const options = createOptions({
      collections: [postCollection('blog'), docCollection('guide')],
      feed: { perCollection: true, includeDocCollections: true },
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'c', dir: 'guide' }),
    ])

    const channels = resolve(app, options)

    expect(channels.map(channel => channel.dir)).toEqual(['', 'blog', 'guide'])
    expect(paths(channels[0])).toEqual(['/blog/a/', '/guide/c/'])
  })

  it('excludes a collection marked with `feed: false`', () => {
    const options = createOptions({
      collections: [postCollection('blog'), postCollection('notes', { feed: false })],
      feed: { perCollection: true },
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'b', dir: 'notes' }),
    ])

    const channels = resolve(app, options)

    expect(channels.map(channel => channel.dir)).toEqual(['', 'blog'])
    expect(paths(channels[0])).toEqual(['/blog/a/'])
  })

  it('opts a doc collection in when `feed: {}` is present', () => {
    const options = createOptions({
      collections: [postCollection('blog'), docCollection('guide', { feed: {} })],
      feed: { perCollection: true },
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'c', dir: 'guide' }),
    ])

    const channels = resolve(app, options)

    expect(channels.map(channel => channel.dir)).toEqual(['', 'blog', 'guide'])
    expect(paths(channels[0])).toEqual(['/blog/a/', '/guide/c/'])
  })

  it('opts a doc collection in when `feed: true` is present', () => {
    const options = createOptions({
      collections: [postCollection('blog'), docCollection('guide', { feed: true })],
      feed: { perCollection: true },
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'c', dir: 'guide' }),
    ])

    const channels = resolve(app, options)

    expect(channels.map(channel => channel.dir)).toEqual(['', 'blog', 'guide'])
    expect(paths(channels[0])).toEqual(['/blog/a/', '/guide/c/'])
  })

  it('generates a channel for `feed: true` even when `perCollection` is disabled', () => {
    const options = createOptions({
      collections: [postCollection('blog'), postCollection('notes', { feed: true })],
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'b', dir: 'notes' }),
    ])

    const channels = resolve(app, options)

    expect(channels.map(channel => channel.dir)).toEqual(['', 'notes'])
    // 显式 opt-in 不会把其它集合的页面带入全局频道
    expect(paths(channels[0])).toEqual(['/blog/a/', '/notes/b/'])
  })

  it('keeps locales isolated', () => {
    const options = createOptions({
      collections: [postCollection('blog')],
      enCollections: [postCollection('blog')],
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'a', dir: 'blog', locale: '/en/' }),
    ])

    expect(paths(resolve(app, options)[0])).toEqual(['/blog/a/'])
    expect(paths(resolve(app, options, '/en/')[0])).toEqual(['/en/blog/a/'])
  })

  it('skips pages with `feed: false`', () => {
    const options = createOptions({ collections: [postCollection('blog')] })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'b', dir: 'blog', frontmatter: { feed: false } }),
    ])

    expect(paths(resolve(app, options)[0])).toEqual(['/blog/a/'])
  })

  it('skips encrypted pages', () => {
    const options = createOptions({ collections: [postCollection('blog')] })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'secret', dir: 'blog', data: { _e: 'hashed' } }),
    ])

    expect(paths(resolve(app, options)[0])).toEqual(['/blog/a/'])
  })

  it('skips pages matched by `encrypt.rules`', () => {
    const options = createOptions({
      collections: [postCollection('blog')],
      feed: { channel: { link: '/' } },
    })
    options.encrypt = { rules: { '/blog/secret/': 'pass' } }
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'secret', dir: 'blog' }),
    ])

    expect(paths(resolve(app, options)[0])).toEqual(['/blog/a/'])
  })

  it('skips drafts, hidden articles and non-content layouts', () => {
    const options = createOptions({ collections: [postCollection('blog')] })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'draft', dir: 'blog', frontmatter: { draft: true } }),
      createPage({ name: 'hidden', dir: 'blog', frontmatter: { article: false } }),
      createPage({ name: 'home', dir: 'blog', frontmatter: { pageLayout: 'home' } }),
    ])

    expect(paths(resolve(app, options)[0])).toEqual(['/blog/a/'])
  })

  it('skips virtual pages', () => {
    const options = createOptions({ collections: [postCollection('blog')] })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'virtual', dir: 'blog', virtual: true }),
    ])

    expect(paths(resolve(app, options)[0])).toEqual(['/blog/a/'])
  })

  it('falls back to every content page when the site has no collections', () => {
    const options = createOptions({ collections: [] })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'b', dir: 'guide' }),
    ])

    const channels = resolve(app, options)

    expect(channels).toHaveLength(1)
    expect(paths(channels[0])).toEqual(['/blog/a/', '/guide/b/'])
  })

  it('honors the `include` / `exclude` glob of a post collection', () => {
    const options = createOptions({
      collections: [postCollection('blog', { include: ['**/*.md'], exclude: ['private/**'] })],
      feed: { perCollection: true },
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'b', dir: 'blog/private' }),
    ])

    const channels = resolve(app, options)

    expect(paths(channels[1])).toEqual(['/blog/a/'])
  })

  it('assigns nested pages to the most specific collection', () => {
    const options = createOptions({
      collections: [postCollection('blog'), postCollection('blog/sub', { link: '/sub/' })],
      feed: { perCollection: true },
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'b', dir: 'blog/sub' }),
    ])

    const channels = resolve(app, options)

    expect(paths(channels[1])).toEqual(['/blog/a/'])
    expect(paths(channels[2])).toEqual(['/blog/sub/b/'])
  })

  it('drops a channel whose output path conflicts with another channel', () => {
    hoisted.logger.warn.mockClear()
    const options = createOptions({
      collections: [postCollection('blog'), postCollection('notes', { link: '/blog/' })],
      feed: { perCollection: true },
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'b', dir: 'notes' }),
    ])

    const channels = resolve(app, options)

    expect(channels.map(channel => channel.dir)).toEqual(['', 'blog'])
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('channel output path conflict'))
  })

  it('drops a channel with an external or traversing link', () => {
    hoisted.logger.warn.mockClear()
    const options = createOptions({
      collections: [
        postCollection('blog', { feed: { link: 'https://example.com/' } }),
        postCollection('notes', { feed: { link: '../escape/' } }),
        postCollection('guide', { feed: {} }),
      ],
      feed: { perCollection: true },
    })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog' }),
      createPage({ name: 'b', dir: 'notes' }),
      createPage({ name: 'c', dir: 'guide' }),
    ])

    const channels = resolve(app, options)

    expect(channels.map(channel => channel.dir)).toEqual(['', 'guide'])
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('invalid link for collection'))
  })
})

describe('buildEntries', () => {
  it('sorts by published date descending, then by path', () => {
    const options = createOptions({ collections: [postCollection('blog')] })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog', frontmatter: { createTime: '2024-01-01 00:00:00' } }),
      createPage({ name: 'c', dir: 'blog', frontmatter: { createTime: '2024-01-03 00:00:00' } }),
      createPage({ name: 'b', dir: 'blog', frontmatter: { createTime: '2024-01-01 00:00:00' } }),
    ])
    const resolved = resolveLocaleFeedOptions(options, '/')!
    const [channel] = resolveFeedChannels(app, options, '/', resolved)

    const { entries } = buildEntries(channel, app, resolved, 'https://example.com')

    expect(entries.map(entry => entry.path)).toEqual(['/blog/c/', '/blog/a/', '/blog/b/'])
    expect(entries[0].url).toBe('https://example.com/blog/c/')
  })

  it('skips pages without any date', () => {
    const options = createOptions({ collections: [postCollection('blog')] })
    const app = createApp([
      createPage({ name: 'a', dir: 'blog', frontmatter: { createTime: undefined } }),
    ])
    const resolved = resolveLocaleFeedOptions(options, '/')!
    const [channel] = resolveFeedChannels(app, options, '/', resolved)

    const { entries, skipped } = buildEntries(channel, app, resolved, 'https://example.com')

    expect(entries).toHaveLength(0)
    expect(skipped).toBe(1)
  })

  it('applies the channel limit', () => {
    const options = createOptions({ collections: [postCollection('blog')], feed: { limit: 2 } })
    const app = createApp(
      Array.from({ length: 5 }, (_, index) => createPage({
        name: `p${index}`,
        dir: 'blog',
        frontmatter: { createTime: `2024-01-0${index + 1} 00:00:00` },
      })),
    )
    const resolved = resolveLocaleFeedOptions(options, '/')!
    const [channel] = resolveFeedChannels(app, options, '/', resolved)

    const { entries } = buildEntries(channel, app, resolved, 'https://example.com')

    expect(entries).toHaveLength(2)
  })

  it('uses page level feed overrides', () => {
    const options = createOptions({ collections: [postCollection('blog')] })
    const app = createApp([
      createPage({
        name: 'a',
        dir: 'blog',
        frontmatter: {
          feed: { title: 'Custom title', summary: 'Custom summary', guid: '/custom-id/' },
        },
      }),
    ])
    const resolved = resolveLocaleFeedOptions(options, '/')!
    const [channel] = resolveFeedChannels(app, options, '/', resolved)

    const { entries } = buildEntries(channel, app, resolved, 'https://example.com')

    expect(entries[0].title).toBe('Custom title')
    expect(entries[0].summary).toBe('Custom summary')
    expect(entries[0].id).toBe('https://example.com/custom-id/')
  })
})
