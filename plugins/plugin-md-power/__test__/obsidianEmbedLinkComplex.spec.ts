import type { App } from 'vuepress'
import type { MarkdownEnv } from 'vuepress/markdown'
import MarkdownIt from 'markdown-it'
import { describe, expect, it, vi } from 'vitest'
import { embedLinkPlugin } from '../src/node/obsidian/embedLink.js'

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

function createMarkdownWithMockRules() {
  return MarkdownIt({ html: true }).use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  })
}

vi.mock('gray-matter', () => ({
  default: vi.fn(content => ({
    content: content.replace(/^---[\s\S]*?---\n?/, ''),
    data: {},
  })),
}))

describe('embedLinkPlugin - internal markdown embed', () => {
  it('should embed entire markdown file when no heading specified', async () => {
    const mockPage = {
      path: '/docs/guide/',
      filePathRelative: 'docs/guide.md',
      title: 'Guide',
      content: `---
title: Guide
---

# Introduction

This is the guide content.

## Getting Started

Step 1, Step 2, Step 3.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Guide]]', createMockEnv('test.md'))
    expect(result).toContain('<h1')
    expect(result).toContain('Introduction')
    expect(result).toContain('<h2')
    expect(result).toContain('Getting Started')
  })

  it('should embed content under specific heading', async () => {
    const mockPage = {
      path: '/docs/guide/',
      filePathRelative: 'docs/guide.md',
      title: 'Guide',
      content: `---
title: Guide
---

# Introduction

This is intro.

## Getting Started

Steps for getting started.

## Advanced

Advanced content.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Guide#Getting Started]]', createMockEnv('test.md'))
    expect(result).toContain('Steps for getting started')
    expect(result).not.toContain('Advanced content')
  })

  it('should embed nested heading content', async () => {
    const mockPage = {
      path: '/docs/guide/',
      filePathRelative: 'docs/guide.md',
      title: 'Guide',
      content: `---
title: Guide
---

# Introduction

## Installation

### Prerequisites

Software requirements.

### Download

Download links.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Guide#Installation#Download]]', createMockEnv('test.md'))
    expect(result).toContain('Download links')
    expect(result).not.toContain('Prerequisites')
  })

  it('should handle heading with id syntax', async () => {
    const mockPage = {
      path: '/docs/guide/',
      filePathRelative: 'docs/guide.md',
      title: 'Guide',
      content: `---
title: Guide
---

# Introduction {#intro}

Intro content.

## Getting Started {#getting-started}

Start content.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Guide#Getting Started]]', createMockEnv('test.md'))
    expect(result).toContain('Start content')
  })

  it('should preserve container blocks within embedded content', async () => {
    const mockPage = {
      path: '/docs/guide/',
      filePathRelative: 'docs/guide.md',
      title: 'Guide',
      content: `---
title: Guide
---

# Introduction

::: warning
This is a warning block.
:::

Some text.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Guide]]', createMockEnv('test.md'))
    expect(result).toContain('::: warning')
    expect(result).toContain('This is a warning block')
  })

  it('should return empty string when heading not found', async () => {
    const mockPage = {
      path: '/docs/guide/',
      filePathRelative: 'docs/guide.md',
      title: 'Guide',
      content: `---
title: Guide
---

# Introduction

Content.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Guide#NonExistent]]', createMockEnv('test.md'))
    expect(result.trim()).toBe('')
  })

  it('should add importedFiles to env when embedding', async () => {
    const mockPage = {
      path: '/docs/guide/',
      filePathRelative: 'docs/guide.md',
      title: 'Guide',
      content: `# Guide\n\nContent.`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const env = createMockEnv('test.md')
    md.render('![[Guide]]', env)
    expect(env.importedFiles).toContain('docs/guide.md')
  })

  it('should handle heading with special characters', async () => {
    const mockPage = {
      path: '/docs/guide/',
      filePathRelative: 'docs/guide.md',
      title: 'Guide',
      content: `---
title: Guide
---

# Guide (中文) {#zh}

Chinese content.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Guide#Guide (中文)]]', createMockEnv('test.md'))
    expect(result).toContain('Chinese content')
  })

  it('should handle heading with class syntax', async () => {
    const mockPage = {
      path: '/docs/guide/',
      filePathRelative: 'docs/guide.md',
      title: 'Guide',
      content: `---
title: Guide
---

# Introduction {.intro .basic}

Intro content.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Guide#Introduction]]', createMockEnv('test.md'))
    expect(result).toContain('Intro content')
  })

  it('should handle multiple consecutive container blocks', async () => {
    const mockPage = {
      path: '/docs/guide/',
      filePathRelative: 'docs/guide.md',
      title: 'Guide',
      content: `---
title: Guide
---

# Section

::: info
Info block.
:::

::: warning
Warning block.
:::

More text.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Guide#Section]]', createMockEnv('test.md'))
    expect(result).toContain('Info block')
    expect(result).toContain('Warning block')
    expect(result).toContain('More text')
  })

  it('should handle frontmatter in embedded file', async () => {
    const mockPage = {
      path: '/docs/page/',
      filePathRelative: 'docs/page.md',
      title: 'Page',
      content: `---
title: Actual Title
author: Test Author
---

# Actual Title

Page content.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Page]]', createMockEnv('test.md'))
    expect(result).toContain('Page content')
    expect(result).not.toContain('author')
  })
})

describe('extractContentByHeadings', () => {
  it('should return full content when no headings specified', async () => {
    const mockPage = {
      path: '/docs/page/',
      filePathRelative: 'docs/page.md',
      title: 'Page',
      content: `# Title\n\nContent here.`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Page]]', createMockEnv('test.md'))
    expect(result).toContain('Content here')
  })

  it('should restart heading search when encountering same text at lower level', async () => {
    const mockPage = {
      path: '/docs/page/',
      filePathRelative: 'docs/page.md',
      title: 'Page',
      content: `---
---

# Section

## Subsection

Subsection content.

# Section

## Another

Another content.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Page#Section#Another]]', createMockEnv('test.md'))
    expect(result).toContain('Another content')
    expect(result).not.toContain('Subsection content')
  })

  it('should reset search when encountering different heading at lower level', async () => {
    const mockPage = {
      path: '/docs/page/',
      filePathRelative: 'docs/page.md',
      title: 'Page',
      content: `---
---

# Section

## Subsection

Subsection content.

# Other

## Content

Other content.
`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    // Search for "Section#Content" - after matching "Section" and failing to find "Content"
    // under "Subsection" (which is level 2 > 1), we encounter "Other" at level 1
    // heading.level (1) <= currentLevel (2), and "Other" !== "Section"
    // So we enter the else branch at lines 268-270: headingPointer = 0, currentLevel = 0
    const result = md.render('![[Page#Section#Content]]', createMockEnv('test.md'))
    expect(result.trim()).toBe('')
  })

  it('should extract content between sibling headings', async () => {
    const mockPage = {
      path: '/docs/page/',
      filePathRelative: 'docs/page.md',
      title: 'Page',
      content: `# Title\n\nIntro.\n\n## Section1\n\nSection 1 content.\n\n## Section2\n\nSection 2 content.\n`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Page#Section1]]', createMockEnv('test.md'))
    expect(result).toContain('Section 1 content')
    expect(result).not.toContain('Section 2 content')
  })

  it('should handle deep nested headings', async () => {
    const mockPage = {
      path: '/docs/page/',
      filePathRelative: 'docs/page.md',
      title: 'Page',
      content: `# H1\n\n## H2a\n\n### H3a\n\nH3a content.\n\n### H3b\n\nH3b content.\n\n## H2b\n\nH2b content.\n`,
      markdownEnv: { base: '/' },
    }

    const mockApp = createMockApp([mockPage] as unknown as App['pages'])
    const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

    const result = md.render('![[Page#H2a#H3b]]', createMockEnv('test.md'))
    expect(result).toContain('H3b content')
    expect(result).not.toContain('H3a content')
  })
})
