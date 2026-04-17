import type { App } from 'vuepress'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { obsidianPlugin } from '../src/node/obsidian/index.js'

function createMockApp(pages: App['pages'] = []): App {
  return {
    pages,
  } as App
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
    obsidianPlugin(md, mockApp, {})

    const embedResult = md.render('![[image.png]]')
    expect(embedResult).toContain('<img')

    const wikiResult = md.render('[[Home]]')
    expect(wikiResult).toContain('<VPLink')

    const commentResult = md.render('%%comment%%')
    expect(commentResult).not.toContain('comment')
  })

  it('should allow disabling specific plugins', () => {
    const md = createMarkdownWithMockRules()
    const mockApp = createMockApp()
    obsidianPlugin(md, mockApp, { obsidian: { wikiLink: false } })

    const wikiResult = md.render('[[Page]]')
    expect(wikiResult).not.toContain('<VPLink')
    expect(wikiResult).toContain('[[Page]]')
  })

  it('should disable all plugins when obsidian is false', () => {
    const md = createMarkdownWithMockRules()
    const mockApp = createMockApp()
    obsidianPlugin(md, mockApp, { obsidian: false })

    const result = md.render('![[image.png]]')
    expect(result).not.toContain('<img')
    expect(result).toContain('![[image.png]]')
  })

  it('should disable embedLink when explicitly set to false', () => {
    const md = createMarkdownWithMockRules()
    const mockApp = createMockApp()
    obsidianPlugin(md, mockApp, { obsidian: { embedLink: false } })

    const result = md.render('![[image.png]]')
    expect(result).not.toContain('<img')
  })

  it('should disable comment when explicitly set to false', () => {
    const md = createMarkdownWithMockRules()
    const mockApp = createMockApp()
    obsidianPlugin(md, mockApp, { obsidian: { comment: false } })

    const embedResult = md.render('![[image.png]]')
    expect(embedResult).toContain('<img')

    const commentResult = md.render('%%comment%%')
    expect(commentResult).toContain('%%comment%%')
  })
})
