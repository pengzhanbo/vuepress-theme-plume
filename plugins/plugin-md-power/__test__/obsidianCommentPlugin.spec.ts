import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { commentPlugin } from '../src/node/obsidian/comment.js'

describe('commentPlugin', () => {
  const md = new MarkdownIt().use(commentPlugin)

  it('should ignore inline comment', () => {
    const result = md.render('This is %%inline comment%% text.')
    expect(result).not.toContain('inline comment')
    expect(result).toContain('This is  text.')
  })

  it('should ignore block comment', () => {
    const result = md.render(`%% block comment %%
more text`)
    expect(result).not.toContain('block comment')
    expect(result).toContain('more text')
  })

  it('should handle multi-line block comment', () => {
    const result = md.render(`%%
This is a block comment
spanning multiple lines
%%

This is after.`)
    expect(result).not.toContain('block comment')
    expect(result).not.toContain('spanning multiple lines')
    expect(result).toContain('This is after.')
  })

  it('should handle comment at start of line', () => {
    const result = md.render('%%comment%% start')
    expect(result).toContain('start')
    expect(result).not.toContain('comment')
  })

  it('should handle empty comment', () => {
    const result = md.render('%%%%')
    expect(result).toBeDefined()
  })

  it('should not treat single % as comment', () => {
    const result = md.render('50% off')
    expect(result).toContain('50%')
    expect(result).not.toContain('%%')
  })

  it('should handle nested content after comment', () => {
    const result = md.render(`%%
block comment
%%

## Heading

paragraph`)
    expect(result).toContain('<h2')
    expect(result).toContain('Heading')
    expect(result).not.toContain('block comment')
  })

  it('should not parse incomplete comment without closing', () => {
    const result = md.render('%%incomplete')
    expect(result).toContain('%%incomplete')
  })

  it('should not parse single opening percent', () => {
    const result = md.render('% test')
    expect(result).toContain('% test')
  })
})
