import type { App, Page, SiteData } from 'vuepress'
import type { ThemeCollectionItem, ThemeOptions, ThemePageData } from '../../shared/index.js'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { path } from 'vuepress/utils'

const hoisted = vi.hoisted(() => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  perf: { mark: vi.fn(), log: vi.fn() },
  themeConfig: {} as ThemeOptions,
}))

vi.mock('../utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/index.js')>()
  return {
    ...actual,
    logger: hoisted.logger,
    perf: hoisted.perf,
  }
})

vi.mock('../options.js', () => ({
  getThemeOptions: () => hoisted.themeConfig,
}))

const { generateFeeds } = await import('../features/feed/index.js')
const { injectFeedLinks } = await import('../features/feed/head.js')

const tmpDir = fileURLToPath(new URL('./.tmp/feed/', import.meta.url))

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

interface PageOptions {
  name: string
  dir?: string
  locale?: string
  title?: string
  frontmatter?: Record<string, unknown>
  data?: Record<string, unknown>
  contentRendered?: string
  noDate?: boolean
}

function createPage(options: PageOptions): Page<ThemePageData> {
  const locale = options.locale ?? '/'
  const dir = options.dir ?? 'blog'
  const prefix = locale === '/' ? '' : locale.slice(1)
  const filePathRelative = `${prefix}${dir}/${options.name}.md`

  return {
    path: `${locale}${dir}/${options.name}/`,
    pathLocale: locale,
    filePathRelative,
    filePath: `/root/${filePathRelative}`,
    title: options.title ?? options.name,
    date: '0000-00-00',
    frontmatter: {
      ...(options.noDate ? {} : { createTime: '2024-01-01 08:00:00' }),
      ...options.frontmatter,
    },
    data: { categoryList: [], ...options.data },
    contentRendered: options.contentRendered ?? '<p>content</p>',
  } as unknown as Page<ThemePageData>
}

function createApp(pages: Page<ThemePageData>[], isBuild = true): App {
  return {
    pages,
    env: { isBuild },
    options: { base: '/' },
    siteData,
    dir: { dest: (file: string) => path.join(tmpDir, file) },
  } as unknown as App
}

function postCollection(dir: string, extra: Record<string, unknown> = {}): ThemeCollectionItem {
  return { type: 'post', dir, title: dir, link: `/${dir}/`, ...extra } as ThemeCollectionItem
}

interface OptionsInput {
  feed?: unknown
  collections?: ThemeCollectionItem[]
  enCollections?: ThemeCollectionItem[]
  hostname?: string
}

function createOptions(input: OptionsInput = {}): ThemeOptions {
  return {
    hostname: input.hostname ?? 'https://example.com',
    feed: input.feed ?? true,
    locales: {
      '/': { collections: input.collections ?? [postCollection('blog')] },
      ...(input.enCollections ? { '/en/': { collections: input.enCollections } } : {}),
    },
  } as unknown as ThemeOptions
}

async function read(relative: string): Promise<string> {
  return readFile(path.join(tmpDir, relative), 'utf-8')
}

async function exists(relative: string): Promise<boolean> {
  try {
    await readFile(path.join(tmpDir, relative), 'utf-8')
    return true
  }
  catch {
    return false
  }
}

describe('generateFeeds', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await rm(tmpDir, { recursive: true, force: true })
  })

  afterAll(async () => {
    await rm(tmpDir, { recursive: true, force: true })
  })

  it('writes rss, atom and json files', async () => {
    const options = createOptions({ feed: { formats: ['rss', 'atom', 'json'] } })
    const app = createApp([createPage({ name: 'a', title: 'Post A' })])

    await generateFeeds(app, options)

    expect(await read('feed.xml')).toContain('<title>Post A</title>')
    expect(await read('atom.xml')).toContain('<title>Post A</title>')
    expect(JSON.parse(await read('feed.json')).items).toHaveLength(1)
  })

  it('writes a feed per locale and per collection', async () => {
    const options = createOptions({
      feed: { perCollection: true },
      collections: [postCollection('blog')],
      enCollections: [postCollection('blog')],
    })
    const app = createApp([
      createPage({ name: 'a' }),
      createPage({ name: 'b', locale: '/en/' }),
    ])

    await generateFeeds(app, options)

    expect(await exists('feed.xml')).toBe(true)
    expect(await exists('blog/feed.xml')).toBe(true)
    expect(await exists('en/feed.xml')).toBe(true)
    expect(await exists('en/blog/feed.xml')).toBe(true)
    expect(await read('en/feed.xml')).toContain('/en/blog/b/')
  })

  it('skips everything without a hostname', async () => {
    const options = createOptions()
    delete options.hostname
    const app = createApp([createPage({ name: 'a' })])

    await generateFeeds(app, options)

    expect(await exists('feed.xml')).toBe(false)
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('`hostname`'))
  })

  it('skips everything when `encrypt.global` is enabled', async () => {
    const options = createOptions()
    options.encrypt = { global: true }
    const app = createApp([createPage({ name: 'a' })])

    await generateFeeds(app, options)

    expect(await exists('feed.xml')).toBe(false)
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('encrypt.global'))
  })

  it('does nothing when the feature is disabled', async () => {
    const options = createOptions({ feed: false })
    const app = createApp([createPage({ name: 'a' })])

    await generateFeeds(app, options)

    expect(await exists('feed.xml')).toBe(false)
    expect(hoisted.logger.warn).not.toHaveBeenCalled()
  })

  it('keeps the first format when two formats share a filename', async () => {
    const options = createOptions({
      feed: { formats: ['rss', 'atom'], filename: { atom: 'feed.xml' } },
    })
    const app = createApp([createPage({ name: 'a' })])

    await generateFeeds(app, options)

    expect(await exists('feed.xml')).toBe(true)
    expect(await exists('atom.xml')).toBe(false)
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('share the filename'))
  })

  it('writes an empty channel when no page has a date', async () => {
    const options = createOptions()
    const app = createApp([createPage({ name: 'a', noDate: true })])

    await generateFeeds(app, options)

    const xml = await read('feed.xml')
    expect(xml).not.toContain('<item>')
    expect(xml).not.toContain('<lastBuildDate>')
    expect(hoisted.logger.info).toHaveBeenCalledWith(expect.stringContaining('page(s) skipped without date'))
  })

  it('does not reject when a file cannot be written', async () => {
    const options = createOptions({ feed: { perCollection: true } })
    const app = createApp([createPage({ name: 'a' })])

    // 用同名文件占位，使 `mkdir dist/blog` 失败
    await mkdir(tmpDir, { recursive: true })
    await writeFile(path.join(tmpDir, 'blog'), 'blocked')

    await expect(generateFeeds(app, options)).resolves.toBeUndefined()

    expect(hoisted.logger.error).toHaveBeenCalledWith(
      expect.stringContaining('blog/feed.xml'),
      expect.anything(),
    )
  })

  it('produces byte identical output on repeated runs', async () => {
    const options = createOptions({ feed: { formats: ['rss', 'atom', 'json'] } })
    const app = createApp([
      createPage({ name: 'a', frontmatter: { tags: ['vue'], description: 'Desc' } }),
      createPage({ name: 'b', frontmatter: { createTime: '2024-02-01 08:00:00' } }),
    ])

    await generateFeeds(app, options)
    const first = await Promise.all([
      read('feed.xml'),
      read('atom.xml'),
      read('feed.json'),
    ])

    await generateFeeds(app, options)
    const second = await Promise.all([
      read('feed.xml'),
      read('atom.xml'),
      read('feed.json'),
    ])

    expect(second).toEqual(first)
  })

  it('does nothing in dev mode', async () => {
    const options = createOptions()
    const app = createApp([createPage({ name: 'a' })], false)

    await generateFeeds(app, options)

    expect(await exists('feed.xml')).toBe(false)
  })
})

describe('injectFeedLinks', () => {
  const env = { base: '/', isBuild: true, siteData }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('injects an alternate link for every enabled format', () => {
    hoisted.themeConfig = createOptions({ feed: { formats: ['rss', 'json'] } })
    const page = createPage({ name: 'a', frontmatter: { head: [] } })

    injectFeedLinks(page as any, env)

    const head = page.frontmatter.head as any[]
    expect(head).toHaveLength(2)
    expect(head[0][1]).toMatchObject({
      rel: 'alternate',
      type: 'application/rss+xml',
      href: 'https://example.com/feed.xml',
    })
    expect(head[1][1]).toMatchObject({
      rel: 'alternate',
      type: 'application/feed+json',
      href: 'https://example.com/feed.json',
    })
  })

  it('uses the collection channel when available', () => {
    hoisted.themeConfig = createOptions({ feed: { perCollection: true } })
    const page = createPage({ name: 'a', frontmatter: { head: [] } })

    injectFeedLinks(page as any, env)

    expect((page.frontmatter.head as any[])[0][1].href).toBe('https://example.com/blog/feed.xml')
  })

  it('does not inject for a page excluded by include/exclude rules', () => {
    hoisted.themeConfig = createOptions({
      collections: [postCollection('blog', { exclude: ['private/**'] })],
    })
    const page = createPage({ name: 'secret', dir: 'blog/private', frontmatter: { head: [] } })

    injectFeedLinks(page as any, env)

    expect(page.frontmatter.head).toHaveLength(0)
  })

  it('does not inject for a collection with `feed: false`', () => {
    hoisted.themeConfig = createOptions({
      collections: [postCollection('blog', { feed: false })],
    })
    const page = createPage({ name: 'a', frontmatter: { head: [] } })

    injectFeedLinks(page as any, env)

    expect(page.frontmatter.head).toHaveLength(0)
  })

  it('warns about an invalid hostname only once across pages', () => {
    hoisted.themeConfig = createOptions()
    hoisted.themeConfig.hostname = 'not-a-url'
    const pages = ['a', 'b', 'c'].map(name => createPage({ name, frontmatter: { head: [] } }))

    for (const page of pages)
      injectFeedLinks(page as any, env)

    expect(hoisted.logger.warn).toHaveBeenCalledTimes(1)
    expect(pages[0].frontmatter.head).toHaveLength(0)
  })

  it('does not duplicate a user declared alternate link', () => {
    hoisted.themeConfig = createOptions()
    const page = createPage({
      name: 'a',
      frontmatter: {
        head: [['link', { rel: 'alternate', type: 'application/rss+xml', href: '/custom.xml' }]],
      },
    })

    injectFeedLinks(page as any, env)

    expect(page.frontmatter.head).toHaveLength(1)
  })

  it('does not inject when `linkTag` is disabled', () => {
    hoisted.themeConfig = createOptions({ feed: { linkTag: false } })
    const page = createPage({ name: 'a', frontmatter: { head: [] } })

    injectFeedLinks(page as any, env)

    expect(page.frontmatter.head).toHaveLength(0)
  })

  it('does not inject in dev mode', () => {
    hoisted.themeConfig = createOptions()
    const page = createPage({ name: 'a', frontmatter: { head: [] } })

    injectFeedLinks(page as any, { ...env, isBuild: false })

    expect(page.frontmatter.head).toHaveLength(0)
  })
})
