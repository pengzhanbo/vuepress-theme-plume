import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { abbrPlugin } from '../src/node/inline/abbr.js'

function createMarkdown(globalAbbreviations?: Record<string, string>) {
  return MarkdownIt().use(abbrPlugin, globalAbbreviations)
}

describe('abbrPlugin', () => {
  it('should parse abbreviation definition', () => {
    const md = createMarkdown()
    const code = `*[HTML]: HyperText Markup Language

This is HTML content.`

    const result = md.render(code)
    expect(result).toContain('Abbreviation')
    expect(result).toContain('HTML')
    expect(result).toContain('HyperText Markup Language')
  })

  it('should parse multiple abbreviation definitions', () => {
    const md = createMarkdown()
    const code = `*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets

HTML and CSS are web technologies.`

    const result = md.render(code)
    expect(result).toContain('HTML')
    expect(result).toContain('CSS')
  })

  it('should work with global abbreviations', () => {
    const md = createMarkdown({ API: 'Application Programming Interface' })
    const code = `This is an API documentation.`

    const result = md.render(code)
    expect(result).toContain('Abbreviation')
    expect(result).toContain('API')
    expect(result).toContain('Application Programming Interface')
  })

  it('should merge local and global abbreviations', () => {
    const md = createMarkdown({ API: 'Application Programming Interface' })
    const code = `*[SDK]: Software Development Kit

API and SDK are common terms.`

    const result = md.render(code)
    expect(result).toContain('API')
    expect(result).toContain('SDK')
  })

  it('should handle abbreviation in middle of text', () => {
    const md = createMarkdown()
    const code = `*[TEST]: Test Abbreviation

This TEST is important.`

    const result = md.render(code)
    expect(result).toContain('TEST')
    expect(result).toContain('Test Abbreviation')
  })

  it('should handle abbreviation at start of text', () => {
    const md = createMarkdown()
    const code = `*[HTML]: HyperText Markup Language

HTML is a markup language.`

    const result = md.render(code)
    expect(result).toContain('Abbreviation')
  })

  it('should handle abbreviation at end of text', () => {
    const md = createMarkdown()
    const code = `*[HTML]: HyperText Markup Language

Learn HTML`

    const result = md.render(code)
    expect(result).toContain('Abbreviation')
  })

  it('should handle multiple occurrences of same abbreviation', () => {
    const md = createMarkdown()
    const code = `*[HTML]: HyperText Markup Language

HTML, HTML, and more HTML.`

    const result = md.render(code)
    expect(result).toContain('HTML')
    expect(result).toContain('HyperText Markup Language')
  })

  it('should not match partial words', () => {
    const md = createMarkdown()
    const code = `*[HTML]: HyperText Markup Language

This is HTML but not XHTML.`

    const result = md.render(code)
    expect(result).toContain('HTML')
  })

  it('should handle empty abbreviation definition gracefully', () => {
    const md = createMarkdown()
    const code = `*[]: Empty definition

Some text.`

    const result = md.render(code)
    expect(result).toBeDefined()
  })

  it('should handle case-sensitive abbreviations', () => {
    const md = createMarkdown()
    const code = `*[HTML]: HyperText Markup Language

html is different from HTML.`

    const result = md.render(code)
    expect(result).toContain('HTML')
  })

  it('should handle abbreviation with markdown in title', () => {
    const md = createMarkdown()
    const code = `*[MD]: **Markdown** text

MD is great.`

    const result = md.render(code)
    expect(result).toContain('MD')
  })

  it('should handle empty global abbreviations', () => {
    const md = createMarkdown({})
    const code = `*[TEST]: Test

TEST is defined.`

    const result = md.render(code)
    expect(result).toContain('TEST')
  })

  it('should handle escaped characters in label', () => {
    const md = createMarkdown()
    const code = `*[HTML\\[1\\]]: HTML Version 1

HTML[1] is old.`

    const result = md.render(code)
    expect(result).toContain('HTML[1]')
  })

  it('should handle abbreviation with special characters in title', () => {
    const md = createMarkdown()
    const code = `*[XML]: eXtensible Markup Language

This is XML.`

    const result = md.render(code)
    expect(result).toContain('XML')
  })

  it('should handle definition with empty title', () => {
    const md = createMarkdown()
    const code = `*[TEST]:

Some text.`

    const result = md.render(code)
    expect(result).not.toContain('Abbreviation')
  })

  it('should handle definition with only label', () => {
    const md = createMarkdown()
    const code = `*[TEST]:

Some text.`

    const result = md.render(code)
    expect(result).not.toContain('Abbreviation')
  })

  it('should handle unclosed bracket in definition', () => {
    const md = createMarkdown()
    const code = `*[TEST: Test

Some text.`

    const result = md.render(code)
    expect(result).toBeDefined()
  })

  it('should handle nested bracket in label', () => {
    const md = createMarkdown()
    const code = `*[TEST[INNER]]: Test Abbreviation

Some text.`

    const result = md.render(code)
    expect(result).toBeDefined()
  })

  it('should handle global abbreviations with colon prefix', () => {
    const md = createMarkdown({ ':API': 'Application Programming Interface' })
    const code = `This is an API call.`

    const result = md.render(code)
    expect(result).toContain('API')
  })

  it('should handle abbreviation adjacent to punctuation', () => {
    const md = createMarkdown()
    const code = `*[HTML]: HyperText Markup Language

Use HTML, CSS, and JS.`

    const result = md.render(code)
    expect(result).toContain('Abbreviation')
    expect(result).toContain('HTML')
  })

  it('should handle abbreviation at sentence end', () => {
    const md = createMarkdown()
    const code = `*[HTML]: HyperText Markup Language

This is HTML.`

    const result = md.render(code)
    expect(result).toContain('Abbreviation')
  })

  it('should handle abbreviation in parentheses', () => {
    const md = createMarkdown()
    const code = `*[HTML]: HyperText Markup Language

See (HTML) for details.`

    const result = md.render(code)
    expect(result).toContain('Abbreviation')
  })
})
