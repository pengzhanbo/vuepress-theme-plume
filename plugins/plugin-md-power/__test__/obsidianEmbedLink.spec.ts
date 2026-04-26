import type { App } from 'vuepress'
import type { MarkdownEnv } from 'vuepress/markdown'
import MarkdownIt from 'markdown-it'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { embedLinkPlugin } from '../src/node/obsidian/embedLink.js'
import { initPagePaths } from '../src/node/obsidian/findFirstPage.js'

const mockGlobSync = vi.fn()
const mockReadFileSync = vi.fn()

vi.mock('vuepress/utils', () => ({
  tinyglobby: {
    globSync: (...args: unknown[]) => mockGlobSync(...args),
  },
  fs: {
    readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
  },
  path: {
    dirname: vi.fn((p: string) => p.split('/').slice(0, -1).join('/') || '.'),
    extname: vi.fn((p: string) => {
      const i = p.lastIndexOf('.')
      return i > 0 ? p.slice(i) : ''
    }),
    join: vi.fn((...args: string[]) => args.join('/')),
  },
  hash: vi.fn((s: string) => `hash_${s.length}`),
}))

vi.mock('gray-matter', () => ({
  default: vi.fn((content: string) => ({
    content: content.replace(/^---[\s\S]*?---\n?/, ''),
    data: {},
  })),
}))

vi.mock('@vuepress/helper', () => ({
  removeLeadingSlash: vi.fn((p: string) => p.replace(/^\//, '')),
}))

vi.mock('@vuepress/shared', () => ({
  ensureLeadingSlash: vi.fn((p: string) => (p[0] === '/' ? p : `/${p}`)),
  isLinkHttp: vi.fn((p: string) => p.startsWith('http://') || p.startsWith('https://')),
}))

vi.mock('../src/node/enhance/links.js', () => ({
  resolvePaths: vi.fn((rawPath: string) => ({
    absolutePath: `/${rawPath}`,
    relativePath: rawPath,
  })),
}))

vi.mock('../src/node/utils/slugify.js', () => ({
  slugify: vi.fn((s: string) => s.toLowerCase().replace(/\s+/g, '-')),
}))

vi.mock('../src/node/utils/cleanMarkdownEnv.js', () => ({
  cleanMarkdownEnv: vi.fn((env: MarkdownEnv) => env),
}))

function createMockApp(pages: App['pages'] = []): App {
  return {
    pages,
    options: {
      pagePatterns: ['**/*.md'],
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
    importedFiles: [],
  }
}

function createMarkdownWithMockRules() {
  return MarkdownIt({ html: true }).use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  })
}

describe('embedLinkPlugin', () => {
  beforeEach(() => {
    mockGlobSync.mockReset()
    mockReadFileSync.mockReset()
  })

  // ==================== Asset Embedding ====================

  describe('asset embedding', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue([])
    })

    it('should render image embed', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[image.png]]')
      expect(result).toContain('<img')
      expect(result).toContain('src="/image.png"')
      expect(result).toContain('alt="image.png"')
    })

    it('should render image with width setting', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[image.png|300]]')
      expect(result).toContain('<img')
      expect(result).toContain('width: 300px')
    })

    it('should render image with width x height setting', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[image.png|300x200]]')
      expect(result).toContain('<img')
      expect(result).toContain('width: 300px')
      expect(result).toContain('height: 200px')
    })

    it('should render audio embed', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[audio.mp3]]')
      expect(result).toContain('<audio')
      expect(result).toContain('<source')
      expect(result).toContain('src="/audio.mp3"')
    })

    it('should render video embed with artPlayer', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[video.mp4]]')
      expect(result).toContain('<ArtPlayer')
      expect(result).toContain('src="/video.mp4"')
      expect(result).toContain('type="mp4"')
    })

    it('should render pdf embed', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[document.pdf]]')
      expect(result).toContain('<PDFViewer')
      expect(result).toContain('src="/document.pdf"')
    })

    it('should render pdf with page hash', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[document.pdf#page=1]]')
      expect(result).toContain('page="1"')
    })
  })

  // ==================== External Links ====================

  describe('external links', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue([])
    })

    it('should render external http link as anchor', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[https://example.com/file]]')
      expect(result).toContain('<a')
      expect(result).toContain('href="https://example.com/file"')
      expect(result).toContain('target="_blank"')
    })

    it('should return http links as-is for assets', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[https://example.com/image.png]]')
      expect(result).toContain('src="https://example.com/image.png"')
    })
  })

  // ==================== Path Resolution ====================

  describe('path resolution', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue([])
    })

    it('should return relative paths starting with dot as-is', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[./image.png]]', createMockEnv('docs/page.md'))
      expect(result).toContain('src="./image.png"')
    })

    it('should return absolute paths starting with slash as-is', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[/images/cover.jpg]]')
      expect(result).toContain('src="/images/cover.jpg"')
    })

    it('should prepend slash to relative paths without dot', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[image.png]]')
      expect(result).toContain('src="/image.png"')
    })

    it('should ignore non-image with unsupported extension as link', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[file.unknown]]')
      expect(result).toContain('<a')
      expect(result).toContain('href="file.unknown"')
    })
  })

  // ==================== Markdown Embedding ====================

  describe('markdown file embedding', () => {
    const guideContent = `---
title: Guide
---

# Introduction

This is intro content.

## Getting Started

Steps for getting started.

## Advanced

Advanced content.
`

    beforeEach(() => {
      mockGlobSync.mockReturnValue(['guide.md'])
      mockReadFileSync.mockReturnValue(guideContent)

      const app = createMockApp()
      initPagePaths(app)
    })

    it('should embed entire markdown file when no heading specified', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('![[guide]]', env)

      expect(result).toContain('Introduction')
      expect(result).toContain('intro content')
      expect(result).toContain('Getting Started')
      expect(result).toContain('Steps for getting started')
    })

    it('should embed content under specific heading', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('![[guide#Getting Started]]', env)

      expect(result).toContain('Steps for getting started')
      expect(result).not.toContain('Advanced content')
      expect(result).not.toContain('#') // no heading markers
    })

    it('should embed nested heading content', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('![[guide#Introduction#Getting Started]]', env)

      expect(result).toContain('Steps for getting started')
      expect(result).not.toContain('Advanced content')
    })

    it('should track imported files in env', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      md.render('![[guide]]', env)

      expect(env.importedFiles).toContain('guide.md')
    })
  })

  // ==================== Markdown Not Found ====================

  describe('when page does not exist', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue([])
    })

    it('should render markdown file embed as link', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[nonexistent.md]]')
      expect(result).toContain('<a')
      expect(result).toContain('href="/nonexistent.md"')
    })

    it('should render with heading anchor', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[nonexistent#section]]')
      expect(result).toContain('<a')
      expect(result).toContain('href="/nonexistent#section"')
      expect(result).toContain('target="_blank"')
    })
  })

  // ==================== Container Syntax ====================

  describe('container syntax preservation', () => {
    const contentWithContainers = `---
title: Test
---

# Section

::: info
This is a container
:::

Regular content.
`

    beforeEach(() => {
      mockGlobSync.mockReturnValue(['test.md'])
      mockReadFileSync.mockReturnValue(contentWithContainers)
      const app = createMockApp()
      initPagePaths(app)
    })

    it('should preserve container syntax when embedding', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('![[test#Section]]', env)

      expect(result).toContain('::: info')
      expect(result).toContain('This is a container')
      expect(result).toContain('Regular content')
    })
  })

  // ==================== Error Handling ====================

  describe('error handling', () => {
    it('should return empty string when file read fails', () => {
      mockGlobSync.mockReturnValue(['guide.md'])
      mockReadFileSync.mockImplementation(() => {
        throw new Error('ENOENT')
      })

      const app = createMockApp()
      initPagePaths(app)

      const md = createMarkdownWithMockRules().use(embedLinkPlugin, app)
      const env = createMockEnv()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = md.render('![[guide]]', env)

      expect(result).toBe('')
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('can not read file'))
      warnSpy.mockRestore()
    })

    it('should return empty string when file has only frontmatter', () => {
      // gray-matter will extract empty content when file has only frontmatter
      mockGlobSync.mockReturnValue(['empty.md'])
      mockReadFileSync.mockReturnValue(`---
title: Empty
---
`)

      const app = createMockApp()
      initPagePaths(app)

      const md = createMarkdownWithMockRules().use(embedLinkPlugin, app)
      const env = createMockEnv()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = md.render('![[empty]]', env)

      expect(result).toBe('')
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('is empty'))
      warnSpy.mockRestore()
    })
  })

  // ==================== Heading Search Edge Cases ====================

  describe('heading search edge cases', () => {
    it('should find heading when same text appears at different nesting levels', () => {
      const content = `# Title

## Summary

Summary content.

## Details

### Summary

Nested summary under details.

## Conclusion

Conclusion content.`

      mockGlobSync.mockReturnValue(['guide.md'])
      mockReadFileSync.mockReturnValue(content)

      const app = createMockApp()
      initPagePaths(app)

      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      // Should match first "Summary" at level 2
      const result = md.render('![[guide#Summary]]', env)
      expect(result).toContain('Summary content.')
      expect(result).not.toContain('Nested summary')
    })

    it('should return empty string when heading not found', () => {
      const content = `# Title

## Section

Content.`

      mockGlobSync.mockReturnValue(['guide.md'])
      mockReadFileSync.mockReturnValue(content)

      const app = createMockApp()
      initPagePaths(app)

      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = md.render('![[guide#Nonexistent]]', env)

      expect(result).toBe('')
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No heading found'))
      warnSpy.mockRestore()
    })

    it('should reset search when encountering same-level heading with different text', () => {
      const content = `# A

## B

B content.

## C

C content.`

      mockGlobSync.mockReturnValue(['guide.md'])
      mockReadFileSync.mockReturnValue(content)

      const app = createMockApp()
      initPagePaths(app)

      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      // Searching for A > B > C, but C is at same level as B, not nested under it
      const result = md.render('![[guide#A#B#C]]', env)

      expect(result).toBe('')
    })

    it('should reset headingPointer when first heading reappears at shallower level', () => {
      // Structure: # A, ## B, ## A
      // When searching for A > B > A, after finding A at level 1 and B at level 2,
      // we encounter A again at level 2 which is <= currentLevel and matches headings[0]
      const content = `# A

## B

B content.

## A

A content again.`

      mockGlobSync.mockReturnValue(['guide.md'])
      mockReadFileSync.mockReturnValue(content)

      const app = createMockApp()
      initPagePaths(app)

      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      // Searching for A > B > A
      // After finding A (level 1) and B (level 2), we find A at level 2
      // level 2 <= currentLevel 2 is true, and A === headings[0], so we reset
      const result = md.render('![[guide#A#B#A]]', env)

      expect(result).toBe('')
    })
  })

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue([])
    })

    it('should not parse embed not ending with ]]', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[image.png]')
      expect(result).toContain('![[image.png]')
    })

    it('should not parse empty embed link', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[]]')
      expect(result).toContain('![[]]')
    })
  })

  // ==================== Inline Embed Link ====================

  describe('inline embed link', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue([])
      const app = createMockApp()
      initPagePaths(app)
    })

    it('should parse inline image embed within text', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('Here is an image ![[photo.png]] in text.')
      expect(result).toContain('<img')
      expect(result).toContain('src="/photo.png"')
    })

    it('should parse inline audio embed within text', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('Listen to ![[music.mp3]] this.')
      expect(result).toContain('<audio')
      expect(result).toContain('<source')
    })

    it('should parse inline video embed within text', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('Watch ![[clip.mp4]] this video.')
      expect(result).toContain('<ArtPlayer')
    })

    it('should parse inline pdf embed within text', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('See ![[doc.pdf]] for details.')
      expect(result).toContain('<PDFViewer')
    })

    it('should parse inline external http link within text', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('Check ![[https://example.com/link]] out.')
      expect(result).toContain('<a')
      expect(result).toContain('href="https://example.com/link"')
    })

    it('should parse inline embed with settings within text', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('Image ![[photo.png|400x300]] here.')
      expect(result).toContain('<img')
      expect(result).toContain('width: 400px')
      expect(result).toContain('height: 300px')
    })

    it('should not parse inline embed without closing', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('Here ![[image.png] is text.')
      expect(result).toContain('![[image.png]')
    })

    it('should handle inline embed with empty content', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('Here ![[]] is text.')
      // Empty embed is parsed and rendered as an external link
      expect(result).toContain('<a')
      expect(result).toContain('href="/"')
    })
  })

  // ==================== Inline Markdown Page Embed ====================

  describe('inline markdown page embed (VPLink)', () => {
    const guideContent = `---
title: Guide
---

# Introduction

This is intro content.

## Getting Started

Steps for getting started.
`

    beforeEach(() => {
      mockGlobSync.mockReturnValue(['guide.md'])
      mockReadFileSync.mockReturnValue(guideContent)

      const app = createMockApp()
      initPagePaths(app)
    })

    it('should render inline markdown page embed as VPLink', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('See ![[guide]] for details.', env)

      expect(result).toContain('<VPLink')
      expect(result).toContain('href="/guide.md"')
    })

    it('should render inline markdown page embed with anchor as VPLink', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('See ![[guide#Introduction]] for details.', env)

      expect(result).toContain('<VPLink')
      expect(result).toContain('href="/guide.md#introduction"')
    })

    it('should render inline markdown page embed with settings as VPLink', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('See ![[guide|Custom Text]] for details.', env)

      expect(result).toContain('<VPLink')
      expect(result).toContain('Custom Text')
    })

    it('should render inline markdown page embed with hashes as VPLink using after-text template', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('See ![[guide#Introduction#Getting Started]] for details.', env)

      expect(result).toContain('<VPLink')
      // Anchor slug is appended to href, after-text shows the full path hierarchy
      expect(result).toContain('href="/guide.md#getting-started"')
      expect(result).toContain('template #after-text')
      expect(result).toContain('&gt; Introduction &gt; Getting Started')
    })

    it('should track links in env when rendering inline page embed', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      md.render('See ![[guide]] for details.', env)

      expect(env.links).toContainEqual(
        expect.objectContaining({
          raw: 'guide.md',
        }),
      )
    })

    it('should render inline embed with relative path as external link when not found', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv('docs/page.md')

      const result = md.render('See ![[./guide]] for details.', env)

      // ./guide doesn't resolve to a page in findFirstPage, so renders as external link
      expect(result).toContain('<a')
      expect(result).toContain('href="/docs/./guide"')
    })

    it('should render inline nonexistent page embed as external link', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('See ![[nonexistent]] for details.', env)

      expect(result).toContain('<a')
      expect(result).toContain('href="/nonexistent"')
      expect(result).toContain('target="_blank"')
    })
  })

  // ==================== Inline External Resource with Anchor ====================

  describe('inline external resource with anchor', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue([])
    })

    it('should render inline external link with anchor', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('Check ![[https://example.com/page#section]] out.', env)

      expect(result).toContain('<a')
      // The #section anchor is parsed but since the URL doesn't have a recognized extension,
      // it's treated as an external link without proper anchor handling
      expect(result).toContain('href="https://example.com/page"')
      expect(result).toContain('target="_blank"')
    })

    it('should render external markdown file with heading anchor', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const env = createMockEnv()

      const result = md.render('Check ![[https://example.com/doc.md#intro]] out.', env)

      expect(result).toContain('<a')
      // URLs with anchors are not properly handled in current implementation
      expect(result).toContain('href="https://example.com/doc.md"')
    })
  })

  // ==================== Block Embed with Inline-like Content ====================

  describe('block embed with various content', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue([])
    })

    it('should handle block embed of image with pipe settings', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[banner.jpg|800x200]]')
      expect(result).toContain('<img')
      expect(result).toContain('width: 800px')
      expect(result).toContain('height: 200px')
    })

    it('should handle block embed of audio with controls', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[narration.mp3]]')
      expect(result).toContain('<audio')
      expect(result).toContain('controls="true"')
    })

    it('should handle block embed of video with all attributes', () => {
      const md = createMarkdownWithMockRules().use(embedLinkPlugin, createMockApp())
      const result = md.render('![[presentation.mp4]]')
      expect(result).toContain('<ArtPlayer')
      expect(result).toContain(':fullscreen="true"')
      expect(result).toContain(':flip="true"')
      expect(result).toContain(':playback-rate="true"')
    })
  })
})
