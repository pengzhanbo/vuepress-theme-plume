import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { acfunPlugin } from '../src/node/embed/video/acfun.js'

function createMarkdown() {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  }).use(acfunPlugin)
}

describe('acfunPlugin', () => {
  it('should work', () => {
    const md = createMarkdown()
    const code = `\
@[acfun](123456)

@[acfun title="test"](123456)

@[acfun width="100%" height="600px"](123456)

@[acfun width="100%" ratio="16:9"](123456)
`

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work', () => {
    const md = createMarkdown()
    const code = `\
@[acfun]()

@[acfun]xxx

@[ acfun]123456

@[ acfun](123456)
`

    expect(md.render(code)).toMatchSnapshot()
  })
})
