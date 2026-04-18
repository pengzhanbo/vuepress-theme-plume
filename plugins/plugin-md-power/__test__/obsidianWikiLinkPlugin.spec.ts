import type { App } from 'vuepress'
import type { MarkdownEnv } from 'vuepress/markdown'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { findFirstPage, wikiLinkPlugin } from '../src/node/obsidian/wikiLink.js'

function createMockApp(pages: App['pages'] = []): App {
  return {
    pages,
  } as App
}

function createMockEnv(filePathRelative = 'test.md'): MarkdownEnv {
  return {
    filePathRelative,
    base: '/',
    links: [],
    importedFiles: [],
  }
}

describe('wikiLinkPlugin', () => {
  const mockApp = createMockApp([
    {
      path: '/docs/getting-started/',
      filePathRelative: 'docs/getting-started/README.md',
      title: 'Getting Started',
    },
    {
      path: '/docs/guide/intro/',
      filePathRelative: 'docs/guide/intro.md',
      title: 'Introduction',
    },
    {
      path: '/api/utils/',
      filePathRelative: 'api/utils.md',
      title: 'Utils',
    },
  ] as App['pages'])

  const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin, mockApp)

  it('should render internal wiki link to existing page', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('[[Getting Started]]', env)
    expect(result).toContain('<VPLink')
    expect(result).toContain('href="/docs/getting-started/"')
  })

  it('should render wiki link with alias', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('[[Getting Started|Quick Start]]', env)
    expect(result).toContain('<VPLink')
    expect(result).toContain('Quick Start')
  })

  it('should render wiki link with heading', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('[[Introduction#Installation]]', env)
    expect(result).toContain('<VPLink')
    expect(result).toContain('href="/docs/guide/intro/#installation"')
  })

  it('should render wiki link with heading and alias', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('[[Introduction#Installation|Install Guide]]', env)
    expect(result).toContain('<VPLink')
    expect(result).toContain('Install Guide')
    expect(result).toContain('href="/docs/guide/intro/#installation"')
  })

  it('should render external http link', () => {
    const result = md.render('[[https://example.com]]')
    expect(result).toContain('<a')
    expect(result).toContain('href="https://example.com"')
    expect(result).toContain('target="_blank"')
  })

  it('should render external link with alias', () => {
    const result = md.render('[[https://example.com|Example Site]]')
    expect(result).toContain('>Example Site<')
    expect(result).toContain('href="https://example.com"')
  })

  it('should render external link with heading and alias', () => {
    const result = md.render('[[https://example.com/page#section|Go to Section]]')
    expect(result).toContain('>Go to Section<')
    expect(result).toContain('href="https://example.com/page#section"')
  })

  it('should render external link with heading but no alias', () => {
    const result = md.render('[[https://example.com/page#section]]')
    expect(result).toContain('href="https://example.com/page#section"')
    expect(result).toContain('https://example.com/page &gt; section</a>')
  })

  it('should render internal hash link for empty filename', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('[[#anchor]]', env)
    expect(result).toContain('<VPLink')
    expect(result).toContain('href="#anchor"')
  })

  it('should render internal hash link with alias', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('[[#anchor|Back to Top]]', env)
    expect(result).toContain('>Back to Top<')
    expect(result).toContain('href="#anchor"')
  })

  it('should render internal hash link with titles but no alias', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('[[#anchor1#anchor2]]', env)
    expect(result).toContain('href="#anchor2"')
    expect(result).toContain('&gt; anchor1 &gt; anchor2</template>')
  })

  it('should render relative path wiki link as anchor when not found', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('[[../api/other.md]]', env)
    expect(result).toContain('<a')
    expect(result).toContain('href="/api/other.md"')
  })

  it('should render relative path wiki link with alias', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('[[../api/other.md|View API]]', env)
    expect(result).toContain('>View API<')
    expect(result).toContain('href="/api/other.md"')
  })

  it('should render relative path wiki link with heading but no alias', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('[[../api/other.md#section]]', env)
    expect(result).toContain('href="/api/other.md#section"')
    expect(result).toContain('../api/other.md &gt; section</a>')
  })

  it('should add to links array in env', () => {
    const env = createMockEnv('docs/page.md')
    md.render('[[Utils]]', env)
    expect(env.links).toBeDefined()
    expect(env.links!.length).toBeGreaterThan(0)
  })

  it('should not parse wiki link without closing bracket', () => {
    const result = md.render('[[Page')
    expect(result).toContain('[[Page')
  })

  it('should not parse empty wiki link', () => {
    const result = md.render('[[]]')
    expect(result).toContain('[[]]')
  })
})

describe('findFirstPage', () => {
  const mockApp = createMockApp([
    { path: '/', filePathRelative: 'README.md', title: 'Home' },
    { path: '/docs/guide/', filePathRelative: 'docs/guide/README.md', title: 'Guide' },
    { path: '/docs/api/', filePathRelative: 'docs/api.md', title: 'API' },
    { path: '/docs/config/', filePathRelative: 'docs/config/index.md', title: 'Config' },
  ] as App['pages'])

  it('should find page by exact title', () => {
    const result = findFirstPage(mockApp, 'Guide', 'any/path.md')
    expect(result?.title).toBe('Guide')
  })

  it('should find page by exact file path', () => {
    const result = findFirstPage(mockApp, 'docs/api.md', 'any/path.md')
    expect(result?.title).toBe('API')
  })

  it('should find page by exact title with path-like name', () => {
    const result = findFirstPage(mockApp, 'docs/config/index', 'any/path.md')
    expect(result?.title).toBe('Config')
  })

  it('should find folder index by trailing slash', () => {
    const result = findFirstPage(mockApp, 'docs/guide/', 'any/path.md')
    expect(result?.title).toBe('Guide')
  })

  it('should find page without extension', () => {
    const result = findFirstPage(mockApp, 'docs/api', 'any/path.md')
    expect(result?.title).toBe('API')
  })

  it('should find page by fuzzy match with folder path ending in slash', () => {
    const app = createMockApp([
      { path: '/docs/features/', filePathRelative: 'docs/features/README.md', title: 'Features' },
    ] as App['pages'])
    const result = findFirstPage(app, 'docs/features/', 'any/path.md')
    expect(result?.title).toBe('Features')
  })

  it('should find page by fuzzy match ending with index.html', () => {
    const app = createMockApp([
      { path: '/docs/guide/', filePathRelative: 'docs/guide/index.html', title: 'Guide' },
    ] as App['pages'])
    const result = findFirstPage(app, 'docs/guide/', 'any/path.md')
    expect(result?.title).toBe('Guide')
  })

  it('should return undefined when page not found', () => {
    const result = findFirstPage(mockApp, 'nonexistent', 'any/path.md')
    expect(result).toBeUndefined()
  })

  it('should find page by data.title fallback', () => {
    const app = createMockApp([
      { path: '/test/', filePathRelative: 'test.md', data: { title: 'Data Title' } },
    ] as unknown as App['pages'])
    const result = findFirstPage(app, 'Data Title', 'any/path.md')
    expect(result?.path).toBe('/test/')
  })
})
