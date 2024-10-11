import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { codepenPlugin } from '../src/node/embed/code/codepen.js'

function createMarkdown() {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  }).use(codepenPlugin)
}

describe('codepenPlugin', () => {
  it('should work', () => {
    const md = createMarkdown()
    const code = `\
@[codepen](user/slash)

@[codepen preview](user/slash)

@[codepen preview editable title="codepen" width="100%" height="400px" tab="css,result" theme="dark"](user/slash)
`

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work', () => {
    const md = createMarkdown()
    const code = `\
@[codepen]()

@[codepen]xxx

@[codepen preview](
`

    expect(md.render(code)).toMatchSnapshot()
  })
})
