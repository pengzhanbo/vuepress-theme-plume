import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { audioReaderPlugin } from '../src/node/embed/audio/reader.js'

function createMarkdown() {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  }).use(audioReaderPlugin)
}

describe('artPlayerPlugin', () => {
  it('should work', () => {
    const md = createMarkdown()
    const code = `\
@[audioReader](/xxx.mp3) @[audioReader](/xxx.mp3)

@[audioReader autoplay title="title"](/xxx.mp3)

@[audioReader autoplay start-time="0" end-time="99" volume="0.55"](/xxx.mp3)

xxx @[audioReader type="audio/mp3"](/xxx.mp3) xxx
`

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work', () => {
    const md = createMarkdown()
    const code = `\
@[audioReader @[audioReader]()

@[audioReader]xxx

@[ audioReader](123456

@[audioReader]((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((()

@[ audioReader](/xxx.mp3) xxx

@[audioReader]( xxx.mp3) xxx

@[audioReader](javascript:alert(1)) xxx
`

    expect(md.render(code)).toMatchSnapshot()
  })
})
