import type { App } from 'vuepress'
import MarkdownIt from 'markdown-it'
import { describe, expect, it, vi } from 'vitest'
import { obsidianPlugin } from '../src/node/obsidian/index.js'

vi.mock('vuepress/utils', async () => {
  const actual = await vi.importActual('vuepress/utils')
  return {
    ...actual,
    tinyglobby: {
      globSync: vi.fn(() => []),
    },
  }
})

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

function createMarkdownWithMockRules() {
  return MarkdownIt({ html: true }).use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  })
}

describe('obsidianPlugin', () => {
  it('should enable all plugins by default', () => {
    const md = createMarkdownWithMockRules()
    const mockApp = createMockApp([{ path: '/', filePathRelative: 'README.md', title: 'Home' }] as unknown as App['pages'])
    obsidianPlugin(mockApp, md, {}, {})

    // Wiki link should not work since findFirstPage returns undefined when pagePaths is empty
    const wikiResult = md.render('[[Home]]')
    expect(wikiResult).not.toContain('<VPLink')

    const commentResult = md.render('%%comment%%')
    expect(commentResult).not.toContain('comment')
  })

  it('should allow disabling specific plugins', () => {
    const md = createMarkdownWithMockRules()
    const mockApp = createMockApp()
    obsidianPlugin(mockApp, md, { obsidian: { wikiLink: false } }, {})

    const wikiResult = md.render('[[Page]]')
    expect(wikiResult).not.toContain('<VPLink')
    expect(wikiResult).toContain('[[Page]]')
  })

  it('should disable all plugins when obsidian is false', () => {
    const md = createMarkdownWithMockRules()
    const mockApp = createMockApp()
    obsidianPlugin(mockApp, md, { obsidian: false }, {})

    const result = md.render('![[image.png]]')
    expect(result).toContain('![[image.png]]')
  })

  it('should disable embedLink when explicitly set to false', () => {
    const md = createMarkdownWithMockRules()
    const mockApp = createMockApp()
    obsidianPlugin(mockApp, md, { obsidian: { embedLink: false } }, {})

    const result = md.render('![[image.png]]')
    expect(result).not.toContain('<img')
  })

  it('should disable comment when explicitly set to false', () => {
    const md = createMarkdownWithMockRules()
    const mockApp = createMockApp()
    obsidianPlugin(mockApp, md, { obsidian: { comment: false } }, {})

    const commentResult = md.render('%%comment%%')
    expect(commentResult).toContain('%%comment%%')
  })
})
