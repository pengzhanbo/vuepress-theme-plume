import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { alignPlugin } from '../src/node/container/align.js'

describe('alignPlugin', () => {
  const md = new MarkdownIt().use(alignPlugin)
  it('should work', () => {
    expect(md.render(':::left\n:::')).toContain('style="text-align:left"')
    expect(md.render(':::center\n:::')).toContain('style="text-align:center"')
    expect(md.render(':::right\n:::')).toContain('style="text-align:right"')
    expect(md.render(':::justify\n:::')).toContain('style="text-align:justify"')
  })
})
