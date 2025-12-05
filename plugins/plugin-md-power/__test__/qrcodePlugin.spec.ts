import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { qrcodePlugin } from '../src/node/embed/qrcode.js'

describe('qrcodePlugin', () => {
  it('should work with embed syntax', () => {
    const md = MarkdownIt().use((md) => {
      md.block.ruler.before('code', 'import_code', () => false)
      md.renderer.rules.import_code = () => ''
    }).use(qrcodePlugin)

    expect(md.render('@[qrcode](text)')).toMatchSnapshot()
    expect(md.render('@[qrcode svg card](text)')).toMatchSnapshot()
    expect(md.render('@[qrcode title="title"](text)')).toMatchSnapshot()
  })

  it('should not work with container syntax', () => {
    const md = MarkdownIt().use((md) => {
      md.block.ruler.before('code', 'import_code', () => false)
      md.renderer.rules.import_code = () => ''
    }).use(qrcodePlugin)

    expect(md.render(':::qrcode\ntext\n:::')).toMatchSnapshot()
    expect(md.render(':::qrcode svg card\ntext\n:::')).toMatchSnapshot()
    expect(md.render(':::qrcode title="title"\ntext\n:::')).toMatchSnapshot()
  })
})
