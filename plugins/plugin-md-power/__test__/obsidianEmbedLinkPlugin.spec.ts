import type { App } from 'vuepress'
import type { MarkdownEnv } from 'vuepress/markdown'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
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

describe('embedLinkPlugin', () => {
  const mockApp = createMockApp()
  const md = createMarkdownWithMockRules().use(embedLinkPlugin, mockApp)

  it('should render image embed', () => {
    const result = md.render('![[image.png]]')
    expect(result).toContain('<img')
    expect(result).toContain('src="/image.png"')
    expect(result).toContain('alt="image.png"')
  })

  it('should render image with width setting', () => {
    const result = md.render('![[image.png|300]]')
    expect(result).toContain('<img')
    expect(result).toContain('width: 300px')
  })

  it('should render image with width x height setting', () => {
    const result = md.render('![[image.png|300x200]]')
    expect(result).toContain('<img')
    expect(result).toContain('width: 300px')
    expect(result).toContain('height: 200px')
  })

  it('should render audio embed', () => {
    const result = md.render('![[audio.mp3]]')
    expect(result).toContain('<audio')
    expect(result).toContain('<source')
    expect(result).toContain('src="/audio.mp3"')
  })

  it('should render video embed with artPlayer', () => {
    const result = md.render('![[video.mp4]]')
    expect(result).toContain('<ArtPlayer')
    expect(result).toContain('src="/video.mp4"')
    expect(result).toContain('type="mp4"')
  })

  it('should render pdf embed', () => {
    const result = md.render('![[document.pdf]]')
    expect(result).toContain('<PDFViewer')
    expect(result).toContain('src="/document.pdf"')
  })

  it('should render pdf with page hash', () => {
    const result = md.render('![[document.pdf#page=1]]')
    expect(result).toContain('page="1"')
  })

  it('should render external http link as anchor', () => {
    const result = md.render('![[https://example.com/file]]')
    expect(result).toContain('<a')
    expect(result).toContain('href="https://example.com/file"')
    expect(result).toContain('target="_blank"')
  })

  it('should render relative path with dot prefix', () => {
    const env = createMockEnv('docs/page.md')
    const result = md.render('![[./image.png]]', env)
    expect(result).toContain('<img')
  })

  it('should render absolute path with slash prefix', () => {
    const result = md.render('![[/images/cover.jpg]]')
    expect(result).toContain('<img')
    expect(result).toContain('src="/images/cover.jpg"')
  })

  it('should ignore non-image with unsupported extension as link', () => {
    const result = md.render('![[file.unknown]]')
    expect(result).toContain('<a')
    expect(result).toContain('href="file.unknown"')
  })

  it('should not parse embed not ending with ]]', () => {
    const result = md.render('![[image.png]')
    expect(result).toContain('![[image.png]')
  })

  it('should render markdown file embed as link when page not found', () => {
    const result = md.render('![[nonexistent.md]]')
    expect(result).toContain('<a')
    expect(result).toContain('href="/nonexistent.md"')
  })

  it('should render markdown file embed as link when page and headings not found', () => {
    const result = md.render('![[nonexistent.md#heading1#heading2]]')
    expect(result).toContain('<a')
    expect(result).toContain('href="/nonexistent.md#heading2"')
  })

  it('should not parse empty embed link', () => {
    const result = md.render('![[]]')
    expect(result).toContain('![[]]')
  })
})
