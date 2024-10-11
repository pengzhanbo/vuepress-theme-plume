import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { jsfiddlePlugin } from '../src/node/embed/code/jsfiddle.js'

function createMarkdown() {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  }).use(jsfiddlePlugin)
}

describe('codeSandboxPlugin', () => {
  it('should work', () => {
    const md = createMarkdown()
    const code = `\
@[jsfiddle](user/id)

@[jsfiddle](user/id)

@[jsfiddle theme="light"](user/id)

@[jsfiddle title="xxx" width="100%" height="500px" theme="dark" tab="js,css,html,result"](user/id)
`

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work', () => {
    const md = createMarkdown()
    const code = `\
@[jsfiddle]()

@[jsfiddle]xxx

@[jsfiddle](
`

    expect(md.render(code)).toMatchSnapshot()
  })
})
