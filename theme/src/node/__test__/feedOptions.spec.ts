import type { ThemeCollectionItem, ThemeOptions } from '../../shared/index.js'
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
  normalizeFeedOptions,
  resolveChannelLink,
  resolveCollectionFeed,
  resolveLocaleFeedOptions,
} = await import('../features/feed/options.js')

function createOptions(feed: unknown, locales: Record<string, unknown> = {}): ThemeOptions {
  return {
    feed,
    locales: {
      '/': {},
      ...locales,
    },
  } as unknown as ThemeOptions
}

function collection(feed: unknown, type: 'post' | 'doc' = 'post'): ThemeCollectionItem {
  return { type, dir: 'guide', title: 'Guide', feed } as ThemeCollectionItem
}

describe('resolveChannelLink', () => {
  it('normalizes relative and absolute paths to a leading and trailing slash', () => {
    expect(resolveChannelLink('/blog/', '/')).toBe('/blog/')
    expect(resolveChannelLink('blog', '/')).toBe('/blog/')
    expect(resolveChannelLink('/', '/')).toBe('/')
  })

  it('prepends the locale prefix', () => {
    expect(resolveChannelLink('/blog/', '/en/')).toBe('/en/blog/')
  })

  it('rejects protocol links and protocol relative links', () => {
    expect(resolveChannelLink('https://example.com/', '/')).toBeUndefined()
    expect(resolveChannelLink('//example.com/blog/', '/')).toBeUndefined()
  })

  it('rejects path traversal', () => {
    expect(resolveChannelLink('/blog/../secret/', '/')).toBeUndefined()
    expect(resolveChannelLink('..', '/')).toBeUndefined()
  })

  it('rejects backslashes, query strings and hashes', () => {
    expect(resolveChannelLink('\\blog\\x\\', '/')).toBeUndefined()
    expect(resolveChannelLink('/blog/?page=2', '/')).toBeUndefined()
    expect(resolveChannelLink('/blog/#top', '/')).toBeUndefined()
  })

  it('rejects empty values', () => {
    expect(resolveChannelLink(undefined, '/')).toBeUndefined()
    expect(resolveChannelLink('', '/')).toBeUndefined()
    expect(resolveChannelLink('   ', '/')).toBeUndefined()
  })
})

describe('resolveLocaleFeedOptions', () => {
  it('resolves `true` with the defaults', () => {
    const resolved = resolveLocaleFeedOptions(createOptions(true), '/')

    expect(resolved).toMatchObject({
      perCollection: false,
      includeDocCollections: false,
      content: 'excerpt',
      limit: 20,
      excerptLength: 240,
      formats: ['rss'],
      linkTag: true,
      debug: false,
    })
  })

  it('returns null when disabled', () => {
    expect(resolveLocaleFeedOptions(createOptions(false), '/')).toBeNull()
    expect(resolveLocaleFeedOptions(createOptions(undefined), '/')).toBeNull()
  })

  it('lets a locale level `false` override the theme level config', () => {
    const options = createOptions(true, { '/en/': { feed: false } })

    expect(resolveLocaleFeedOptions(options, '/')).not.toBeNull()
    expect(resolveLocaleFeedOptions(options, '/en/')).toBeNull()
  })

  it('clamps `limit` and `excerptLength`', () => {
    expect(normalizeFeedOptions({ limit: 0 })?.limit).toBe(1)
    expect(normalizeFeedOptions({ limit: 1000 })?.limit).toBe(200)
    expect(normalizeFeedOptions({ excerptLength: -10 })?.excerptLength).toBe(0)
    expect(normalizeFeedOptions({ excerptLength: 5000 })?.excerptLength).toBe(1000)
  })

  it('returns null when no format survives normalization', () => {
    hoisted.logger.warn.mockClear()

    expect(normalizeFeedOptions({ formats: ['xml'] as never })).toBeNull()
    expect(hoisted.logger.warn).toHaveBeenCalledWith(expect.stringContaining('unknown output format'))
  })
})

describe('resolveCollectionFeed', () => {
  const resolved = normalizeFeedOptions({ perCollection: true })!

  it('derives the default behaviour from the collection type', () => {
    expect(resolveCollectionFeed(collection(undefined), resolved)).toMatchObject({
      include: true,
      channel: true,
    })
    expect(resolveCollectionFeed(collection(undefined, 'doc'), resolved)).toMatchObject({
      include: false,
      channel: false,
    })
  })

  it('treats `true` and `{}` as the same opt-in', () => {
    expect(resolveCollectionFeed(collection(true, 'doc'), resolved)).toMatchObject({
      include: true,
      channel: true,
    })
    expect(resolveCollectionFeed(collection({}, 'doc'), resolved)).toMatchObject({
      include: true,
      channel: true,
    })
  })

  it('excludes a collection marked with `false`', () => {
    expect(resolveCollectionFeed(collection(false), resolved)).toMatchObject({
      include: false,
      channel: false,
    })
  })

  it('respects `includeDocCollections` for doc collections', () => {
    const withDocs = normalizeFeedOptions({ includeDocCollections: true, perCollection: true })!

    expect(resolveCollectionFeed(collection(undefined, 'doc'), withDocs)).toMatchObject({
      include: true,
      channel: true,
    })
  })
})
