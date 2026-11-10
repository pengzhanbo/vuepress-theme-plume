import type { Page } from 'vuepress'
import type { MarkdownLink } from 'vuepress/markdown'
import type { ThemeOptions, ThemePageData } from '../../shared/index.js'
import { describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

vi.mock('../utils/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/index.js')>()
  return {
    ...actual,
    logger: hoisted.logger,
  }
})

const { collectLinkPreviews } = await import('../features/linkPreview/collect.js')
const { resolveExcerpt } = await import('../features/linkPreview/excerpt.js')
const { normalizePreviewPath, resolveLinkKey } = await import('../features/linkPreview/key.js')
const { extractRawHrefs, resolveRawHrefKey } = await import('../features/linkPreview/raw-links.js')
const { resolveLocaleLinkPreviewOptions } = await import('../features/linkPreview/options.js')

interface PageOptions {
  title?: string
  locale?: string
  filePathRelative?: string | null
  pathInferred?: string | null
  frontmatter?: Record<string, unknown>
  data?: Record<string, unknown>
  headers?: { level: number, title: string }[]
  links?: MarkdownLink[]
  contentRendered?: string
}

function createPage(path: string, options: PageOptions = {}): Page<ThemePageData> {
  return {
    path,
    pathLocale: options.locale ?? '/',
    pathInferred: options.pathInferred ?? null,
    filePathRelative: options.filePathRelative === undefined ? `${path.replace(/^\/|\/$/g, '') || 'index'}.md` : options.filePathRelative,
    title: options.title ?? path,
    frontmatter: options.frontmatter ?? {},
    data: options.data ?? {},
    headers: options.headers ?? [],
    links: options.links ?? [],
    contentRendered: options.contentRendered ?? '',
  } as unknown as Page<ThemePageData>
}

function mdLink(absolute: string | null, relative = absolute?.replace(/^\//, '') ?? ''): MarkdownLink {
  return { raw: relative, relative, absolute }
}

function createOptions(options: Record<string, unknown> = {}): ThemeOptions {
  return { linkPreview: true, ...options } as ThemeOptions
}

describe('normalizePreviewPath', () => {
  it.each([
    ['/guide/', '/guide/'],
    ['/guide/index.html', '/guide/'],
    ['/index.html', '/'],
    ['/guide/%E9%85%8D%E7%BD%AE/', '/guide/配置/'],
    ['/a%zz/', '/a%zz/'],
    ['guide/x.html', '/guide/x.html'],
  ])('%s -> %s', (input, expected) => {
    expect(normalizePreviewPath(input)).toBe(expected)
  })
})

describe('resolveLinkKey', () => {
  it('resolves a markdown file into a route path', () => {
    expect(resolveLinkKey(mdLink('/guide/x.md'), '/')).toBe('/guide/x.html')
  })

  it('strips the site base', () => {
    expect(resolveLinkKey(mdLink('/docs/guide/x.md'), '/docs/')).toBe('/guide/x.html')
    expect(resolveLinkKey(mdLink('/docs/guide/'), '/docs/')).toBe('/guide/')
  })

  it('falls back to relative for virtual pages', () => {
    expect(resolveLinkKey(mdLink(null, 'guide/x.md'), '/')).toBe('/guide/x.html')
  })

  it('treats the base as a literal prefix, not a regexp', () => {
    expect(resolveLinkKey(mdLink('/a.b/guide/x.md'), '/a.b/')).toBe('/guide/x.html')
  })
})

describe('resolveRawHrefKey', () => {
  it('resolves relative hrefs against the page route', () => {
    expect(resolveRawHrefKey('../config/', '/guide/markdown/', '/')).toBe('/guide/config/')
    expect(resolveRawHrefKey('./theme.html', '/guide/config/', '/')).toBe('/guide/config/theme.html')
  })

  it('strips the site base and skips non-navigation links', () => {
    expect(resolveRawHrefKey('/docs/guide/', '/', '/docs/')).toBe('/guide/')
    expect(resolveRawHrefKey('https://example.com', '/guide/', '/')).toBeNull()
    expect(resolveRawHrefKey('mailto:a@b.c', '/guide/', '/')).toBeNull()
    expect(resolveRawHrefKey('#anchor', '/guide/', '/')).toBeNull()
  })
})

describe('extractRawHrefs', () => {
  it('collects raw anchors only', () => {
    const html = '<RouteLink to="/guide/">a</RouteLink>'
      + '<a href="../config/">b</a>'
      + '<a class="no-link-preview" href="/x/">c</a>'
      + '<a href="/y/" data-no-link-preview>d</a>'
      + '<a target="_blank" href="https://example.com?a=1&amp;b=2">e</a>'

    expect(extractRawHrefs(html)).toEqual(['../config/', 'https://example.com?a=1&b=2'])
  })
})

describe('resolveExcerpt', () => {
  it('prefers the frontmatter description', () => {
    const page = createPage('/a/', {
      frontmatter: { description: 'from frontmatter' },
      contentRendered: '<p>from content</p>',
    })
    expect(resolveExcerpt(page, 120)).toBe('from frontmatter')
  })

  it('strips tags and decodes entities', () => {
    const page = createPage('/a/', {
      contentRendered: '<div class="code">x</div><p>a <code>b</code> &amp; c&#39;d</p>',
    })
    expect(resolveExcerpt(page, 120)).toBe('a b & c\'d')
  })

  it('skips a leading code block and takes the first paragraph', () => {
    const page = createPage('/a/', {
      contentRendered: '<pre><code>const a = 1</code></pre><p>real paragraph</p>',
    })
    expect(resolveExcerpt(page, 120)).toBe('real paragraph')
  })

  it('truncates by code points', () => {
    const page = createPage('/a/', {
      contentRendered: '<p>😀😀😀😀</p>',
    })
    expect(resolveExcerpt(page, 2)).toBe('😀😀…')
  })

  it('returns an empty string when there is no paragraph', () => {
    expect(resolveExcerpt(createPage('/a/'), 120)).toBe('')
  })
})

describe('collectLinkPreviews', () => {
  function setup() {
    const target = createPage('/guide/config/', {
      title: 'Config',
      filePathRelative: 'guide/config/index.md',
      frontmatter: { tags: ['a', 'b'], description: 'target description' },
      data: { git: { updatedTime: 1_700_000_000_000 } },
      headers: [{ level: 2, title: 'Usage' }, { level: 3, title: 'Options' }],
    })

    const source = createPage('/guide/markdown/', {
      title: 'Markdown',
      filePathRelative: 'guide/markdown/index.md',
      links: [mdLink('/guide/config/index.md')],
    })

    return { target, source }
  }

  it('writes the target metadata into the source page', () => {
    const { target, source } = setup()
    const result = collectLinkPreviews([source, target], createOptions(), '/')

    expect(result).toEqual({ pages: 1, links: 1, items: 1 })
    expect(source.data.linkPreviews).toEqual({
      '/guide/config/': {
        title: 'Config',
        excerpt: 'target description',
        tags: ['a', 'b'],
        updatedTime: 1_700_000_000_000,
      },
    })
  })

  it('writes headings when enabled', () => {
    const { target, source } = setup()
    collectLinkPreviews([source, target], createOptions({ linkPreview: { showHeadings: true, headingsLimit: 2 } }), '/')
    expect(source.data.linkPreviews?.['/guide/config/']?.headings).toEqual(['Usage', 'Options'])
  })

  it('skips self links and duplicates', () => {
    const target = createPage('/guide/config/', { title: 'Config' })
    const source = createPage('/guide/markdown/', {
      links: [
        mdLink('/guide/markdown/index.md'),
        mdLink('/guide/config/index.md'),
        mdLink('/guide/config/index.md'),
      ],
    })

    collectLinkPreviews([source, target], createOptions(), '/')
    expect(Object.keys(source.data.linkPreviews ?? {})).toEqual(['/guide/config/'])
  })

  it('skips missing, encrypted, draft and excluded targets', () => {
    const encrypted = createPage('/encrypted/', { data: { _e: true } })
    const draft = createPage('/draft/', { frontmatter: { draft: true } })
    const excluded = createPage('/private/x/', { title: 'private' })
    const source = createPage('/guide/', {
      links: [
        mdLink('/missing/index.md'),
        mdLink('/encrypted/index.md'),
        mdLink('/draft/index.md'),
        mdLink('/private/x/index.md'),
      ],
    })

    collectLinkPreviews(
      [source, encrypted, draft, excluded],
      createOptions({ linkPreview: { exclude: ['/private/**'] } }),
      '/',
    )

    expect(source.data.linkPreviews).toBeUndefined()
  })

  it('does not write anything when the source page opts out', () => {
    const { target, source } = setup()
    source.frontmatter.linkPreview = false
    collectLinkPreviews([source, target], createOptions(), '/')
    expect(source.data.linkPreviews).toBeUndefined()
  })

  it.each(['home', 'friends', 'posts'])('skips the `%s` layout', (layout) => {
    const { target, source } = setup()
    source.frontmatter.pageLayout = layout
    collectLinkPreviews([source, target], createOptions(), '/')
    expect(source.data.linkPreviews).toBeUndefined()
  })

  it('honours the locale level switch', () => {
    const zhTarget = createPage('/guide/config/', { title: 'Config' })
    const zhSource = createPage('/guide/markdown/', { links: [mdLink('/guide/config/index.md')] })
    const enTarget = createPage('/en/guide/config/', { title: 'Config', locale: '/en/' })
    const enSource = createPage('/en/guide/markdown/', { locale: '/en/', links: [mdLink('/en/guide/config/index.md')] })

    collectLinkPreviews(
      [zhTarget, zhSource, enTarget, enSource],
      createOptions({ locales: { '/en/': { linkPreview: false } } }),
      '/',
    )

    expect(zhSource.data.linkPreviews).toBeDefined()
    expect(enSource.data.linkPreviews).toBeUndefined()
  })

  it('cleans stale data when the feature is disabled', () => {
    const { target, source } = setup()
    collectLinkPreviews([source, target], createOptions(), '/')
    expect(source.data.linkPreviews).toBeDefined()

    collectLinkPreviews([source, target], { linkPreview: false } as ThemeOptions, '/')
    expect(source.data.linkPreviews).toBeUndefined()
  })

  it('maps permalinked pages through the inferred path redirect', () => {
    const target = createPage('/custom-route/', {
      title: 'Custom',
      pathInferred: '/guide/target.html',
    })
    const source = createPage('/guide/', {
      links: [mdLink('/guide/target.md'), mdLink('/custom-route/index.md')],
    })

    collectLinkPreviews([source, target], createOptions(), '/')

    // 两种写法都指向同一个 permalink，且按 key 去重
    expect(Object.keys(source.data.linkPreviews ?? {})).toEqual(['/custom-route/'])
  })

  it('truncates and warns when a page has too many links', () => {
    hoisted.logger.warn.mockClear()

    const targets = Array.from({ length: 205 }, (_, index) =>
      createPage(`/targets/${index}/`, { title: `T${index}` }))

    const source = createPage('/guide/', {
      links: targets.map((_, index) => mdLink(`/targets/${index}/index.md`)),
    })

    collectLinkPreviews([source, ...targets], createOptions(), '/')

    expect(Object.keys(source.data.linkPreviews ?? {})).toHaveLength(200)
    expect(hoisted.logger.warn).toHaveBeenCalledOnce()
  })

  it('is deterministic and follows the source order', () => {
    const targetA = createPage('/a/', { title: 'A' })
    const targetB = createPage('/b/', { title: 'B' })
    const source = createPage('/guide/', {
      links: [mdLink('/b/index.md'), mdLink('/a/index.md')],
    })

    collectLinkPreviews([source, targetA, targetB], createOptions(), '/')
    const first = JSON.stringify(source.data.linkPreviews)

    collectLinkPreviews([source, targetA, targetB], createOptions(), '/')
    const second = JSON.stringify(source.data.linkPreviews)

    expect(first).toBe(second)
    expect(Object.keys(source.data.linkPreviews ?? {})).toEqual(['/b/', '/a/'])
  })

  it('collects raw html anchors too', () => {
    const target = createPage('/guide/config/', { title: 'Config' })
    const source = createPage('/guide/markdown/', {
      contentRendered: '<p>see <a href="../config/">config</a></p>',
    })

    collectLinkPreviews([source, target], createOptions(), '/')
    expect(source.data.linkPreviews?.['/guide/config/']?.title).toBe('Config')
  })
})

describe('resolveLocaleLinkPreviewOptions', () => {
  it('returns null when the feature is off or missing', () => {
    expect(resolveLocaleLinkPreviewOptions({} as ThemeOptions, '/')).toBeNull()
    expect(resolveLocaleLinkPreviewOptions({ linkPreview: false } as ThemeOptions, '/')).toBeNull()
  })

  it('applies the defaults for `true`', () => {
    expect(resolveLocaleLinkPreviewOptions({ linkPreview: true } as ThemeOptions, '/')).toEqual({
      showExcerpt: true,
      excerptLength: 120,
      showHeadings: false,
      headingsLimit: 3,
      showTags: true,
      showUpdatedTime: true,
      excludeMatcher: null,
    })
  })

  it('clamps the numeric options', () => {
    const resolved = resolveLocaleLinkPreviewOptions(
      { linkPreview: { excerptLength: 9999, headingsLimit: 0 } } as ThemeOptions,
      '/',
    )

    expect(resolved?.excerptLength).toBe(300)
    expect(resolved?.headingsLimit).toBe(1)
  })
})
