import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { youtubePlugin } from '../src/node/embed/video/youtube.js'

function createMarkdown() {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  }).use(youtubePlugin)
}

describe('youtubePlugin', () => {
  it('should work', () => {
    const md = createMarkdown()
    const code = `\
@[youtube](123456)

@[youtube loop autoplay title="test"](123456)

@[youtube autoplay start="40" end="1:20"](123456)

@[youtube width="100%" height="600px"](123456)

@[youtube width="100%" ratio="16:9"](123456)
`

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work', () => {
    const md = createMarkdown()
    const code = `\
@[youtube]()

@[youtube]xxx

@[ youtube]123456

@[ youtube](123456)
`

    expect(md.render(code)).toMatchSnapshot()
  })
})
