import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { annotationPlugin } from '../src/node/inline/annotation.js'

function createMarkdown(globalAnnotations?: Record<string, string | string[]>) {
  return MarkdownIt().use(annotationPlugin, globalAnnotations)
}

describe('annotationPlugin', () => {
  it('should parse annotation definition and reference', () => {
    const md = createMarkdown()
    const code = `[+note]: This is a note annotation

This is a paragraph with a [+note] annotation.`

    const result = md.render(code)
    expect(result).toContain('Annotation')
    expect(result).toContain('note')
    expect(result).toContain('This is a note annotation')
  })

  it('should parse multiple annotation definitions', () => {
    const md = createMarkdown()
    const code = `[+note]: First note
[+tip]: Second tip

This has [+note] and [+tip].`

    const result = md.render(code)
    expect(result).toContain('note')
    expect(result).toContain('tip')
  })

  it('should merge local and global annotations', () => {
    const md = createMarkdown({ global: 'Global annotation' })
    const code = `[+local]: Local annotation

This uses [+global] and [+local].`

    const result = md.render(code)
    expect(result).toContain('global')
    expect(result).toContain('local')
  })

  it('should handle multiple references to same annotation', () => {
    const md = createMarkdown()
    const code = `[+note]: Same note

First [+note], second [+note], third [+note].`

    const result = md.render(code)
    expect(result).toContain('note')
    expect(result).toContain('Same note')
  })

  it('should handle multi-line annotation', () => {
    const md = createMarkdown()
    const code = `[+note]: This is a
  multi-line annotation
  with multiple lines

This has [+note].`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle annotation with markdown content', () => {
    const md = createMarkdown()
    const code = `[+note]: This is **bold** and *italic*

This has [+note].`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle annotation with code', () => {
    const md = createMarkdown()
    const code = `[+code]: Use \`code\` syntax

This has [+code].`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle annotation with links', () => {
    const md = createMarkdown()
    const code = `[+link]: See [documentation](https://example.com)

Check [+link].`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle multiple annotations for same label', () => {
    const md = createMarkdown()
    const code = `[+multi]: First annotation
[+multi]: Second annotation

This has [+multi].`

    const result = md.render(code)
    expect(result).toContain('total="2"')
  })

  it('should not render undefined annotation reference', () => {
    const md = createMarkdown()
    const code = `This has [+undefined] annotation.`

    const result = md.render(code)
    expect(result).not.toContain('Annotation')
    expect(result).toContain('[+undefined]')
  })

  it('should handle empty annotation label gracefully', () => {
    const md = createMarkdown()
    const code = `[+]: Empty label

Some text.`

    const result = md.render(code)
    expect(result).toBeDefined()
  })

  it('should handle annotation with special characters in label', () => {
    const md = createMarkdown()
    const code = `[+note-1]: Note with hyphen and number

Use [+note-1].`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle annotation with unicode content', () => {
    const md = createMarkdown()
    const code = `[+中文]: 这是一个中文注释

使用 [+中文]。`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle annotation in list', () => {
    const md = createMarkdown()
    const code = `[+item]: List item annotation

- Item 1 [+item]
- Item 2 [+item]`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle annotation in blockquote', () => {
    const md = createMarkdown()
    const code = `[+quote]: Quote annotation

> This is a quote [+quote]`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle empty global annotations', () => {
    const md = createMarkdown({})
    const code = `[+test]: Test annotation

Use [+test].`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle space in annotation label', () => {
    const md = createMarkdown()
    const code = `[+ note]: Invalid label

Some text.`

    const result = md.render(code)
    expect(result).not.toContain('Annotation')
  })

  it('should handle space in annotation reference', () => {
    const md = createMarkdown()
    const code = `[+note]: Test annotation

Use [+ note].`

    const result = md.render(code)
    expect(result).toContain('[+ note]')
  })

  it('should handle newline in annotation reference', () => {
    const md = createMarkdown()
    const code = `[+note]: Test annotation

Use [+
note].`

    const result = md.render(code)
    expect(result).not.toContain('Annotation')
  })

  it('should handle unclosed annotation reference', () => {
    const md = createMarkdown()
    const code = `[+note]: Test annotation

Use [+note.`

    const result = md.render(code)
    expect(result).not.toContain('Annotation')
  })

  it('should handle global annotations with colon prefix', () => {
    const md = createMarkdown({ ':test': 'Test annotation' })
    const code = `[+test]: Local test

Use [+test].`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle annotation reference at end of text', () => {
    const md = createMarkdown()
    const code = `[+note]: Test annotation

End with [+note]`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle annotation reference at start of text', () => {
    const md = createMarkdown()
    const code = `[+note]: Test annotation

[+note] at start.`

    const result = md.render(code)
    expect(result).toContain('Annotation')
  })

  it('should handle definition without colon', () => {
    const md = createMarkdown()
    const code = `[+note] Test annotation

Some text.`

    const result = md.render(code)
    expect(result).not.toContain('Annotation')
  })

  it('should handle annotation reference in code block', () => {
    const md = createMarkdown()
    const code = `[+note]: Test annotation

\`[+note]\` is code.`

    const result = md.render(code)
    expect(result).toContain('[+note]')
  })
})
