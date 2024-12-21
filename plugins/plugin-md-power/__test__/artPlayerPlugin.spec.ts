import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { artPlayerPlugin } from '../src/node/embed/video/artPlayer.js'

function createMarkdown() {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  }).use(artPlayerPlugin)
}

describe('artPlayerPlugin', () => {
  it('should work', () => {
    const md = createMarkdown()
    const code = `\
@[artPlayer](/xxx.mp4)

@[artPlayer loop autoplay](/xxx.m3u8)

@[artPlayer autoplay muted volume="0.55"](/xxx.flv)

@[artPlayer width="100%" height="600px" ratio="16:9" auto-mini poster="xx.jpg"](/xxx.mpd)

@[artPlayer type="mp3"](/xxx)
`

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work', () => {
    const md = createMarkdown()
    const code = `\
@[artPlayer]()

@[artPlayer]xxx

@[ artPlayer]123456

@[ artPlayer](/xxx.mp4)

@[artPlayer type="xxx"](/xxx.xxx)
`

    expect(md.render(code)).toMatchSnapshot()
  })
})
