import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { codeSandboxPlugin } from '../src/node/embed/code/codeSandbox.js'

function createMarkdown() {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  }).use(codeSandboxPlugin)
}

describe('codeSandboxPlugin', () => {
  it('should work', () => {
    const md = createMarkdown()
    const code = `\
@[codesandbox](user/id)

@[codesandbox embed](user/id)

@[codesandbox button](user/id)

@[codesandbox title="xxx" layout="Editor+Preview" width="100%" height="500px" navbar="false" console="false"](user/slash#filepath)
`

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work', () => {
    const md = createMarkdown()
    const code = `\
@[codesandbox]()

@[codesandbox]xxx

@[codesandbox embed](
`

    expect(md.render(code)).toMatchSnapshot()
  })
})
