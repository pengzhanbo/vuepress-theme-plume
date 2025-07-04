import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { iconPlugin } from '../src/node/icon/icon.js'

describe('iconPlugin', () => {
  it('should work with default', () => {
    const md = MarkdownIt().use(iconPlugin)

    expect(md.render('::mdi:11::')).toContain('<VPIcon provider="iconify" name="mdi:11" />')
    expect(md.render('::mdi:11 =32px::')).toContain('<VPIcon provider="iconify" size="32px" name="mdi:11" />')
    expect(md.render('::mdi:11 /#fff::')).toContain('<VPIcon provider="iconify" color="#fff" name="mdi:11" />')
    expect(md.render('::mdi:11 =32px /#fff::')).toContain('<VPIcon provider="iconify" size="32px" color="#fff" name="mdi:11" />')
    expect(md.render('::mdi:11 =32px /#fff fa data-fa-transform="shrink-8::"'))
      .toContain('<VPIcon provider="iconify" size="32px" color="#fff" name="mdi:11" extra="fa" data-fa-transform=""shrink-8" />')

    expect(md.render('::iconify mdi:11::')).toContain('<VPIcon provider="iconify" name="mdi:11" />')
  })

  it('should work with options -> { size, color }', () => {
    const md = MarkdownIt().use(iconPlugin, { size: '1.25em', color: '#ccc' })

    expect(md.render('::mdi:11::')).toContain('<VPIcon provider="iconify" size="1.25em" color="#ccc" name="mdi:11" />')
    expect(md.render('::mdi:11 =32px::')).toContain('<VPIcon provider="iconify" size="32px" color="#ccc" name="mdi:11" />')
    expect(md.render('::mdi:11 /#fff::')).toContain('<VPIcon provider="iconify" size="1.25em" color="#fff" name="mdi:11" />')
    expect(md.render('::mdi:11 =32px /#fff::')).toContain('<VPIcon provider="iconify" size="32px" color="#fff" name="mdi:11" />')
  })

  it('should work with options -> { provider: "iconify", prefix } ', () => {
    const md = MarkdownIt().use(iconPlugin, { prefix: 'mdi' })

    expect(md.render('::11::')).toMatchSnapshot()
    expect(md.render('::11 =32px /#eee::')).toMatchSnapshot()
    expect(md.render('::mdi:11 /#eee::')).toMatchSnapshot()
    expect(md.render('::fas:11 =32px/::')).toMatchSnapshot()
  })

  it('should work with options -> { provider: "iconfont", prefix } ', () => {
    const md = MarkdownIt().use(iconPlugin, { provider: 'iconfont', prefix: 'iconfont icon-' })

    expect(md.render('::home::')).toMatchSnapshot()
    expect(md.render('::home =32px::')).toMatchSnapshot()
    expect(md.render('::home /#eee::')).toMatchSnapshot()
    expect(md.render('::home =32px /#eee::')).toMatchSnapshot()
  })

  it('should work with options -> { provider: "fontawesome", prefix } ', () => {
    const md = MarkdownIt().use(iconPlugin, { provider: 'fontawesome', prefix: 'iconfont icon-' })

    expect(md.render('::home::')).toMatchSnapshot()
    expect(md.render('::home =32px::')).toMatchSnapshot()
    expect(md.render('::home /#eee::')).toMatchSnapshot()
    expect(md.render('::home =32px /#eee::')).toMatchSnapshot()

    expect(md.render('::fas:home::')).toMatchSnapshot()
    expect(md.render('::fas:home 2xl data-fa-transform="shrink-8"::')).toMatchSnapshot()
  })

  it('should not work with invalid icon', () => {
    const md = MarkdownIt().use(iconPlugin)

    expect(md.render(':: mdi:11 ::')).toMatchSnapshot()
    expect(md.render('::::')).toMatchSnapshot()
    expect(md.render('::]&')).toMatchSnapshot()
    expect(md.render('::mdi:11')).toMatchSnapshot()
  })
})
