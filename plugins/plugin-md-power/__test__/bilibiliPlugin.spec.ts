import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { bilibiliPlugin } from '../src/node/embed/video/bilibili.js'

function createMarkdown() {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  }).use(bilibiliPlugin)
}

describe('bilibiliPlugin', () => {
  it('should work', () => {
    const md = createMarkdown()
    const code = `\
@[bilibili](BV12345)

@[bilibili](12432 12345)

@[bilibili](BV12345 12343 45678)

@[bilibili p1 autoplay time="1"](BV12345)

@[bilibili p1 autoplay width="100%" height="600px"](BV12345)

@[bilibili p1 autoplay width="100%" ratio="16:9"](BV12345)
`
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work', () => {
    const md = createMarkdown()
    const code = `\
@[bilibili]()

@[bilibili]xxx

@[ bilibili]BV12345

@[bilibili](BV12345
`
    expect(md.render(code)).toMatchSnapshot()
  })
})
