import type { FeedChannel, FeedEntry } from '../features/feed/collect.js'
import { describe, expect, it } from 'vitest'
import { renderAtom } from '../features/feed/atom.js'
import { cdata, escapeXml, formatRfc822, formatRfc3339, toAbsoluteUrl } from '../features/feed/format.js'
import { renderJson } from '../features/feed/json.js'
import { renderRss } from '../features/feed/rss.js'

function createChannel(overrides: Partial<FeedChannel> = {}): FeedChannel {
  return {
    locale: '/',
    link: '/blog/',
    dir: 'blog',
    title: 'Blog',
    description: 'Blog description',
    language: 'zh-CN',
    formats: ['rss'],
    limit: 20,
    content: 'excerpt',
    author: [{ name: 'plume' }],
    pages: [],
    ...overrides,
  }
}

function createEntry(overrides: Partial<FeedEntry> = {}): FeedEntry {
  const url = 'https://example.com/blog/a/'
  return {
    page: {} as FeedEntry['page'],
    title: 'Hello',
    path: '/blog/a/',
    url,
    id: url,
    published: new Date(2024, 0, 1, 8, 0, 0),
    updated: new Date(2024, 0, 2, 9, 0, 0),
    summary: 'A summary',
    tags: ['vue'],
    categories: ['前端'],
    author: [{ name: 'plume' }],
    ...overrides,
  }
}

const ctx = { hostname: 'https://example.com', base: '/', filename: 'feed.xml' }

describe('format helpers', () => {
  it('escapes every XML reserved character', () => {
    expect(escapeXml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;')
  })

  it('splits `]]>` inside CDATA', () => {
    expect(cdata('a]]>b')).toBe('<![CDATA[a]]]]><![CDATA[>b]]>')
  })

  it('formats RFC 822 with a numeric timezone', () => {
    expect(formatRfc822(new Date(2024, 0, 1, 8, 0, 0)))
      .toMatch(/^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} [+-]\d{4}$/)
  })

  it('formats RFC 3339 with a numeric timezone', () => {
    expect(formatRfc3339(new Date(2024, 0, 1, 8, 0, 0)))
      .toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/)
  })

  it('joins hostname, base and route without double slashes', () => {
    expect(toAbsoluteUrl('https://example.com/', '/', '/blog/a/')).toBe('https://example.com/blog/a/')
    expect(toAbsoluteUrl('https://example.com', '/docs/', 'blog/a/')).toBe('https://example.com/docs/blog/a/')
    expect(toAbsoluteUrl('https://example.com', '/', 'feed.xml')).toBe('https://example.com/feed.xml')
  })
})

describe('renderRss', () => {
  it('renders a valid channel with its entries', () => {
    const xml = renderRss(createChannel(), [createEntry()], ctx)

    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('<atom:link href="https://example.com/blog/feed.xml" rel="self" type="application/rss+xml" />')
    expect(xml).toContain('<lastBuildDate>')
    expect(xml.match(/<item>/g)).toHaveLength(1)
    expect(xml).toContain('<title>Hello</title>')
    expect(xml).toContain('<guid isPermaLink="true">https://example.com/blog/a/</guid>')
  })

  it('omits `lastBuildDate` for an empty channel', () => {
    const xml = renderRss(createChannel(), [], ctx)

    expect(xml).not.toContain('<lastBuildDate>')
    expect(xml).toContain('<channel>')
  })

  it('escapes summaries and keeps the category order stable', () => {
    const xml = renderRss(createChannel(), [
      createEntry({ summary: 'a & b', tags: ['vue', 'feed'], categories: ['vue', '前端'] }),
    ], ctx)

    expect(xml).toContain('<description>a &amp; b</description>')
    expect(xml.match(/<category>/g)).toHaveLength(3)
    expect(xml.indexOf('<category>vue</category>')).toBeLessThan(xml.indexOf('<category>前端</category>'))
  })

  it('embeds the full content as CDATA', () => {
    const xml = renderRss(createChannel({ content: 'full' }), [
      createEntry({ html: '<p>hello</p>' }),
    ], ctx)

    expect(xml).toContain('<content:encoded><![CDATA[<p>hello</p>]]></content:encoded>')
  })
})

describe('renderAtom', () => {
  it('renders a valid feed with author and entries', () => {
    const xml = renderAtom(createChannel(), [createEntry()], ctx)

    expect(xml).toContain('xmlns="http://www.w3.org/2005/Atom"')
    expect(xml).toContain('xml:lang="zh-CN"')
    expect(xml).toContain('<id>https://example.com/blog/#feed</id>')
    expect(xml).toContain('<updated>')
    expect(xml).toContain('<author>')
    expect(xml.match(/<entry>/g)).toHaveLength(1)
    expect(xml).toContain('<summary type="text">A summary</summary>')
  })

  it('uses the epoch as `updated` for an empty channel', () => {
    const xml = renderAtom(createChannel(), [], ctx)

    expect(xml).toContain('<updated>1970-01-01T00:00:00Z</updated>')
  })

  it('escapes the HTML content', () => {
    const xml = renderAtom(createChannel({ content: 'full' }), [
      createEntry({ html: '<p>hello</p>' }),
    ], ctx)

    expect(xml).toContain('<content type="html">&lt;p&gt;hello&lt;/p&gt;</content>')
  })
})

describe('renderJson', () => {
  it('renders a parseable JSON Feed 1.1', () => {
    const json = JSON.parse(renderJson(createChannel(), [createEntry()], ctx))

    expect(json.version).toBe('https://jsonfeed.org/version/1.1')
    expect(json.title).toBe('Blog')
    expect(json.home_page_url).toBe('https://example.com/blog/')
    expect(json.feed_url).toBe('https://example.com/blog/feed.xml')
    expect(json.items).toHaveLength(1)
    expect(json.items[0].id).toBe('https://example.com/blog/a/')
    expect(json.items[0].content_text).toBe('A summary')
  })

  it('always keeps `content_text` and omits empty optional keys', () => {
    const json = JSON.parse(renderJson(createChannel({ description: '', language: '' }), [
      createEntry({ summary: '', tags: [], categories: [] }),
    ], ctx))

    expect(json).not.toHaveProperty('description')
    expect(json).not.toHaveProperty('language')
    expect(json.items[0]).not.toHaveProperty('summary')
    expect(json.items[0]).not.toHaveProperty('tags')
    expect(json.items[0].content_text).toBe('')
  })

  it('outputs `content_html` in full mode', () => {
    const json = JSON.parse(renderJson(createChannel({ content: 'full' }), [
      createEntry({ html: '<p>hello</p>' }),
    ], ctx))

    expect(json.items[0].content_html).toBe('<p>hello</p>')
    expect(json.items[0]).not.toHaveProperty('content_text')
  })

  it('ends with a newline', () => {
    expect(renderJson(createChannel(), [], ctx).endsWith('\n')).toBe(true)
  })
})
