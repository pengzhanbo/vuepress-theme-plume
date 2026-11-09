import { describe, expect, it } from 'vitest'
import { RAW_TEXT_TAGS, removeElements, stripHtml } from '../features/feed/html.js'
import { toPlainText } from '../features/feed/summary.js'

const isComponent = (name: string) => /^[A-Z]/.test(name) || name.includes('-')

describe('stripHtml', () => {
  it('removes tags and keeps the text', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world')
  })

  it('converts block tags into spaces', () => {
    expect(stripHtml('<p>a</p><p>b</p>', { blockTags: new Set(['p', 'div']) })).toBe(' a  b ')
  })

  it('drops raw text elements with their content', () => {
    const html = '<script type="module">alert(1)</script><style>.a{}</style><p>ok</p>'

    expect(stripHtml(html, { removeWithContent: RAW_TEXT_TAGS })).toBe('ok')
  })

  it('drops comments', () => {
    expect(stripHtml('a<!-- hidden -->b')).toBe('ab')
  })

  it('handles `>` inside quoted attributes', () => {
    expect(stripHtml('<div title="a > b">x</div>')).toBe('x')
  })

  it('does not leave script markup behind for malformed input', () => {
    const result = stripHtml('<scr<script>ipt>alert(1)</script>')

    expect(result).not.toContain('<script')
  })

  it('keeps `<` used as text', () => {
    expect(stripHtml('a < b')).toBe('a < b')
  })
})

describe('removeElements', () => {
  it('removes the requested tags and keeps the rest of the markup', () => {
    expect(removeElements('<p>a</p><VPBadge>x</VPBadge>', { removeTag: isComponent }))
      .toBe('<p>a</p>x')
  })

  it('drops self-closing components entirely', () => {
    expect(removeElements('<p>a</p><VPEncryptSnippet hint="secret" /><p>b</p>', { removeTag: isComponent }))
      .toBe('<p>a</p><p>b</p>')
  })

  it('removes raw text elements with their content', () => {
    expect(removeElements('<p>a</p><script>x()</script><p>b</p>', {
      removeWithContent: RAW_TEXT_TAGS,
      removeTag: isComponent,
    })).toBe('<p>a</p><p>b</p>')
  })

  it('handles `>` inside the attributes of a component', () => {
    expect(removeElements('<VPCard title="a > b">x</VPCard>', { removeTag: isComponent })).toBe('x')
  })

  it('keeps comments out of the output', () => {
    expect(removeElements('<p>a</p><!-- c --><p>b</p>')).toBe('<p>a</p><p>b</p>')
  })
})

describe('toPlainText', () => {
  it('decodes entities and collapses whitespace', () => {
    expect(toPlainText('<p>Hello&nbsp;<strong>world</strong></p>')).toBe('Hello world')
  })

  it('drops script and style content', () => {
    expect(toPlainText('<script>var a = 1</script>Text<style>.a{}</style>')).toBe('Text')
  })

  it('separates block elements with a space', () => {
    expect(toPlainText('<div>a<br>b</div>')).toBe('a b')
  })

  it('returns an empty string for empty input', () => {
    expect(toPlainText('')).toBe('')
  })
})
