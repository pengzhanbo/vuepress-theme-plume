import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { alignPlugin } from '../src/node/container/align.js'

describe('alignPlugin', () => {
  const md = new MarkdownIt().use(alignPlugin)
  it('should work with align', () => {
    expect(md.render(':::left\n:::')).toContain('style="text-align:left"')
    expect(md.render(':::center\n:::')).toContain('style="text-align:center"')
    expect(md.render(':::right\n:::')).toContain('style="text-align:right"')
    expect(md.render(':::justify\n:::')).toContain('style="text-align:justify"')
  })

  it('should work with flex', () => {
    expect(md.render(':::flex\n:::')).toContain('display:flex')
    expect(md.render(':::flex start\n:::')).toContain('align-items:flex-start')
    expect(md.render(':::flex end\n:::')).toContain('align-items:flex-end')
    expect(md.render(':::flex center\n:::')).toContain('align-items:center')
    expect(md.render(':::flex between\n:::')).toContain('justify-content:space-between')
    expect(md.render(':::flex around\n:::')).toContain('justify-content:space-around')
    expect(md.render(':::flex wrap\n:::')).toContain('flex-wrap:wrap')
    expect(md.render(':::flex column\n:::')).toContain('flex-direction:column')
  })
})
