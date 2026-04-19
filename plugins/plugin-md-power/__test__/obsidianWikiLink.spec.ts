import type { App } from 'vuepress'
import type { MarkdownEnv } from 'vuepress/markdown'
import MarkdownIt from 'markdown-it'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initPagePaths } from '../src/node/obsidian/findFirstPage.js'
import { wikiLinkPlugin } from '../src/node/obsidian/wikiLink.js'

const mockGlobSync = vi.fn()

vi.mock('vuepress/utils', () => ({
  tinyglobby: {
    globSync: (...args: unknown[]) => mockGlobSync(...args),
  },
  path: {
    dirname: vi.fn((p: string) => p.split('/').slice(0, -1).join('/') || '.'),
    extname: vi.fn((p: string) => {
      const i = p.lastIndexOf('.')
      return i > 0 ? p.slice(i) : ''
    }),
    join: vi.fn((...args: string[]) => args.join('/')),
  },
}))

vi.mock('@vuepress/helper', () => ({
  removeLeadingSlash: vi.fn((p: string) => p.replace(/^\//, '')),
}))

function createMockApp(pagePatterns = ['**/*.md']): App {
  return {
    pages: [],
    options: {
      pagePatterns,
    },
    dir: {
      source: () => '/source',
    },
  } as unknown as App
}

function createMockEnv(filePathRelative = 'test.md'): MarkdownEnv {
  return {
    filePathRelative,
    base: '/',
    links: [],
  }
}

describe('wikiLinkPlugin', () => {
  beforeEach(() => {
    mockGlobSync.mockReset()
  })

  // ==================== External Links ====================

  describe('external links', () => {
    it('should render external http link', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const result = md.render('[[https://example.com]]')
      expect(result).toContain('<a')
      expect(result).toContain('href="https://example.com"')
      expect(result).toContain('target="_blank"')
    })

    it('should render external link with alias', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const result = md.render('[[https://example.com|Example Site]]')
      expect(result).toContain('>Example Site<')
      expect(result).toContain('href="https://example.com"')
    })

    it('should render external link with heading and alias', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const result = md.render('[[https://example.com/page#section|Go to Section]]')
      expect(result).toContain('>Go to Section<')
      expect(result).toContain('href="https://example.com/page#section"')
    })

    it('should render external link with heading but no alias', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const result = md.render('[[https://example.com/page#section]]')
      expect(result).toContain('href="https://example.com/page#section"')
      expect(result).toContain('https://example.com/page &gt; section</a>')
    })
  })

  // ==================== Internal Hash Links ====================

  describe('internal hash links', () => {
    it('should render internal hash link for empty filename', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv('docs/page.md')
      const result = md.render('[[#anchor]]', env)
      expect(result).toContain('<VPLink')
      expect(result).toContain('href="#anchor"')
    })

    it('should render internal hash link with alias', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv('docs/page.md')
      const result = md.render('[[#anchor|Back to Top]]', env)
      expect(result).toContain('>Back to Top<')
      expect(result).toContain('href="#anchor"')
    })

    it('should render internal hash link with titles but no alias', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv('docs/page.md')
      const result = md.render('[[#anchor1#anchor2]]', env)
      expect(result).toContain('href="#anchor2"')
      expect(result).toContain('&gt; anchor1 &gt; anchor2</template>')
    })
  })

  // ==================== Internal Page Resolution ====================

  describe('internal page resolution', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue([
        'README.md',
        'guide.md',
        'docs/api.md',
        'docs/guide/intro.md',
      ])

      const app = createMockApp()
      initPagePaths(app)
    })

    it('should render internal wiki link with VPLink', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv()

      const result = md.render('[[guide]]', env)

      expect(result).toContain('<VPLink')
      expect(result).toContain('href="/guide.md"')
    })

    it('should render wiki link with heading anchor', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv()

      const result = md.render('[[guide#Getting Started]]', env)

      expect(result).toContain('<VPLink')
      expect(result).toContain('href="/guide.md#getting-started"')
    })

    it('should render wiki link with alias', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv()

      const result = md.render('[[guide|Guide Page]]', env)

      expect(result).toContain('Guide Page')
      expect(result).toContain('<VPLink')
      expect(result).toContain('href="/guide.md"')
    })

    it('should render wiki link with heading and alias', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv()

      const result = md.render('[[guide#Getting Started|Getting Started]]', env)

      expect(result).toContain('Getting Started')
      expect(result).toContain('href="/guide.md#getting-started"')
    })

    it('should track links in env', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv()

      md.render('[[guide]]', env)

      expect(env.links).toBeDefined()
      expect(env.links!.length).toBeGreaterThan(0)
    })

    it('should find page by partial filename', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv()

      // Should match docs/guide/intro.md when searching for "intro"
      const result = md.render('[[intro]]', env)

      expect(result).toContain('<VPLink')
      expect(result).toContain('href="/docs/guide/intro.md"')
    })
  })

  // ==================== Page Not Found ====================

  describe('when page does not exist', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue(['existing.md'])

      const app = createMockApp()
      initPagePaths(app)
    })

    it('should render as external anchor link', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const result = md.render('[[nonexistent]]')

      expect(result).toContain('<a')
      expect(result).toContain('href="/nonexistent"')
      expect(result).toContain('target="_blank"')
    })

    it('should render with heading anchor for nonexistent page', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const result = md.render('[[nonexistent#section]]')

      expect(result).toContain('href="/nonexistent#section"')
    })
  })

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue(['docs/page.md'])
      const app = createMockApp()
      initPagePaths(app)
    })

    it('should not parse wiki link without closing bracket', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const result = md.render('[[Page')
      expect(result).toContain('[[Page')
    })

    it('should not parse empty wiki link', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const result = md.render('[[]]')
      expect(result).toContain('[[]]')
    })

    it('should handle wiki link with extra whitespace', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv()

      const result = md.render('[[  page  ]]', env)

      expect(result).toContain('<VPLink')
    })

    it('should handle wiki link with multiple hashes', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv()

      const result = md.render('[[page#h1#h2#h3]]', env)

      expect(result).toContain('href="/docs/page.md#h3"')
    })

    it('should handle wiki link with pipe in filename', () => {
      const md = new MarkdownIt({ html: true }).use(wikiLinkPlugin)
      const env = createMockEnv()

      // Filename with pipe character should be treated as alias separator
      const result = md.render('[[page|alias]]', env)

      expect(result).toContain('>alias<')
    })
  })
})
