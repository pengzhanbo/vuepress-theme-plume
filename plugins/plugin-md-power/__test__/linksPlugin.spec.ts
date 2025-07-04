import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { linksPlugin } from '../src/node/enhance/links.js'

describe('linksPlugin', () => {
  const md = new MarkdownIt({
    html: true,
  }).use(linksPlugin)

  it('should work with external link', () => {
    expect(md.render('[link](https://github.com)')).toContain('<a')
    expect(md.render('[link](https://github.com)')).toContain('href="https://github.com"')
    expect(md.render('[link](https://github.com)')).toContain('target="_blank"')
    expect(md.render('[link](https://github.com)')).toContain('rel="noopener noreferrer"')
  })

  it('should work with hash link', () => {
    expect(md.render('[link](#anchor)')).toContain('<a')
    expect(md.render('[link](#anchor)')).toContain('href="#anchor"')
    expect(md.render('[link](#anchor)')).not.toContain('target="_blank"')
    expect(md.render('[link](#anchor)')).not.toContain('rel="noopener noreferrer"')
  })

  it('should work with internal link', () => {
    expect(md.render('[link](/path)')).toContain('<VPLink')
    expect(md.render('[link](/path)')).toContain('href="/path"')
    expect(md.render('[link](/path)')).toContain('</VPLink>')
  })

  it('should work with internal link extension and empty env', () => {
    const env = {}
    expect(md.render('[link](/path.md)', env)).toContain('href="/path.md"')
    expect(md.render('[link](../path.md)', env)).toContain('href="../path.md"')
  })

  it('should work with internal link extension and env', () => {
    const env = { base: '/', filePathRelative: '../foo.md' }
    expect(md.render('[link](/path.html)', env)).toContain('href="/path.html"')
    expect(md.render('[link](/path.md)', env)).toContain('href="/path.md"')
    expect(md.render('[link](../path.md)', env)).toContain('href="../path.md"')
  })
})
