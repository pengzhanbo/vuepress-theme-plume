import { describe, expect, it } from 'vitest'
import { sanitizeContent } from '../features/feed/sanitize.js'

const ctx = {
  url: 'https://example.com/blog/a/',
  hostname: 'https://example.com',
  base: '/',
}

describe('sanitizeContent', () => {
  it('removes script and style blocks', () => {
    const content = sanitizeContent('<script>alert(1)</script><style>.a{}</style><p>ok</p>', ctx)

    expect(content).not.toContain('alert(1)')
    expect(content).not.toContain('.a{}')
    expect(content).toContain('<p>ok</p>')
  })

  it('removes header anchors but keeps the heading text', () => {
    const content = sanitizeContent(
      '<h2 id="a">Title<a class="header-anchor" href="#a" aria-hidden="true">#</a></h2>',
      ctx,
    )

    expect(content).not.toContain('header-anchor')
    expect(content).toContain('Title')
  })

  it('removes a leading H1', () => {
    const content = sanitizeContent('<h1>Title</h1><p>body</p>', ctx)

    expect(content).not.toMatch(/^<h1/)
    expect(content).toContain('<p>body</p>')
  })

  it('strips component tags but keeps their text', () => {
    expect(sanitizeContent('<p><VPBadge>新</VPBadge></p>', ctx)).toBe('<p>新</p>')
  })

  it('drops self-closing components entirely', () => {
    const content = sanitizeContent('<p>a</p><VPEncryptSnippet hint="secret" /><p>b</p>', ctx)

    expect(content).not.toContain('VPEncryptSnippet')
    expect(content).not.toContain('secret')
    expect(content).toContain('<p>a</p>')
    expect(content).toContain('<p>b</p>')
  })

  it('absolutizes site absolute links with the base path', () => {
    const content = sanitizeContent('<a href="/guide/x/">x</a>', {
      url: 'https://example.com/docs/blog/a/',
      hostname: 'https://example.com',
      base: '/docs/',
    })

    expect(content).toContain('href="https://example.com/docs/guide/x/"')
  })

  it('absolutizes relative links against the page url', () => {
    expect(sanitizeContent('<a href="../b/">b</a>', ctx))
      .toContain('href="https://example.com/blog/b/"')
  })

  it('absolutizes anchor links', () => {
    expect(sanitizeContent('<a href="#a">a</a>', ctx))
      .toContain('href="https://example.com/blog/a/#a"')
  })

  it('absolutizes every URL of a srcset and keeps the descriptors', () => {
    const content = sanitizeContent('<img srcset="/a.png 1x, ../b.png 2x" src="/c.png">', ctx)

    expect(content).toContain('srcset="https://example.com/a.png 1x, https://example.com/blog/b.png 2x"')
    expect(content).toContain('src="https://example.com/c.png"')
  })

  it('removes `javascript:` attributes', () => {
    const content = sanitizeContent('<a href="javascript:alert(1)">x</a>', ctx)

    expect(content).not.toContain('javascript:')
    expect(content).toContain('>x</a>')
  })

  it('removes event handler attributes', () => {
    const content = sanitizeContent('<div onclick="alert(1)" data-v-abc="1">x</div>', ctx)

    expect(content).not.toContain('onclick')
    expect(content).not.toContain('data-v-abc')
    expect(content).toContain('x')
  })

  it('keeps shiki classes and inline styles', () => {
    const content = sanitizeContent('<pre class="shiki" style="color:red"><code>x</code></pre>', ctx)

    expect(content).toContain('class="shiki"')
    expect(content).toContain('style="color:red"')
  })

  it('returns an empty string for empty content', () => {
    expect(sanitizeContent('', ctx)).toBe('')
  })
})
