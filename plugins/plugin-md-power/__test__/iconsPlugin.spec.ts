import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { iconsPlugin } from '../src/node/inline/icons.js'

describe('iconsPlugin', () => {
  it('should work', () => {
    const md = MarkdownIt().use(iconsPlugin)

    expect(md.render(':[mdi:11]:')).toMatchSnapshot()
    expect(md.render('**strong** :[mdi:11]: :[mdi:11]:')).toMatchSnapshot()
    expect(md.render('**strong**\n:[mdi:11]:\n :[mdi:11]:')).toMatchSnapshot()
  })

  it('should work with options', () => {
    const md = MarkdownIt().use(iconsPlugin, { size: '1.25em', color: '#ccc' })

    expect(md.render(':[mdi:11]:')).toMatchSnapshot()
    expect(md.render('**strong** :[mdi:11]: :[mdi:11]:')).toMatchSnapshot()
  })

  it('should work with single icon options', () => {
    const md = MarkdownIt().use(iconsPlugin)

    expect(md.render(':[mdi:11 36px]:')).toMatchSnapshot()
    expect(md.render(':[mdi:11 32px/#eee]:')).toMatchSnapshot()
    expect(md.render(':[mdi:11 /#eee]:')).toMatchSnapshot()
    expect(md.render(':[mdi:11 32px/]:')).toMatchSnapshot()
    expect(md.render(':[mdi:11 /]:')).toMatchSnapshot()

    const md2 = MarkdownIt().use(iconsPlugin, { size: '1.25em', color: '#ccc' })
    expect(md2.render(':[mdi:11]:')).toMatchSnapshot()
    expect(md2.render(':[mdi:11 36px]:')).toMatchSnapshot()
    expect(md2.render(':[mdi:11 32px/#eee]:')).toMatchSnapshot()
    expect(md2.render(':[mdi:11 /#eee]:')).toMatchSnapshot()
    expect(md2.render(':[mdi:11 32px/]:')).toMatchSnapshot()
    expect(md2.render(':[mdi:11 /]:')).toMatchSnapshot()
  })

  it('should not work with invalid icon', () => {
    const md = MarkdownIt().use(iconsPlugin)

    expect(md.render(':[ mdi:11 ]:')).toMatchSnapshot()
    expect(md.render(':[]:')).toMatchSnapshot()
    expect(md.render(':[]&')).toMatchSnapshot()
    expect(md.render(':[:[')).toMatchSnapshot()
    expect(md.render(':[mdi:11')).toMatchSnapshot()
  })
})
