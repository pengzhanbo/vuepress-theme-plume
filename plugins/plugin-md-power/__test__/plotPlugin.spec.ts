import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { plotPlugin } from '../src/node/inline/plot.js'

describe('plotPlugin', () => {
  it('should work', () => {
    const md = MarkdownIt().use(plotPlugin)

    expect(md.render('!!plot!!')).toMatchSnapshot()
    expect(md.render('hidden:  !!plot!!  **strong**')).toMatchSnapshot()
    expect(md.render('hidden:  \n!!plot!!  \n!!plot!!')).toMatchSnapshot()
  })

  it('should not work with invalid tag', () => {
    const md = MarkdownIt().use(plotPlugin)

    expect(md.render('!!!!')).toMatchSnapshot()
    expect(md.render('!!plot!')).toMatchSnapshot()
    expect(md.render('!!!')).toMatchSnapshot()
    expect(md.render('!! plot !!')).toMatchSnapshot()
  })
})
