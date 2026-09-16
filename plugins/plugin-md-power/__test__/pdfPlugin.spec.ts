import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { pdfPlugin } from '../src/node/embed/pdf.js'

function createMarkdown() {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  }).use(pdfPlugin)
}

describe('pdfPlugin', () => {
  it('should work', () => {
    const md = createMarkdown()
    const code = `\
@[pdf](foo.pdf)

@[pdf 2](foo.pdf)

@[pdf page="2"](foo.pdf)

@[pdf page="3" width="100%" height="600px" ratio="1:1"](foo.pdf)

@[pdf width="100%" height="600px" ratio="1:1"](foo.pdf)

@[pdf no-toolbar](foo.pdf)
`

    expect(md.render('@[pdf](foo.pdf)')).toMatchSnapshot()
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should fallback to page 1 when page is invalid', () => {
    const md = createMarkdown()

    expect(md.render('@[pdf page="abc"](foo.pdf)')).toMatchSnapshot()
  })

  it('should not work', () => {
    const md = createMarkdown()
    const code = `\
@[pdf]()

@[pdf]xxx

@[ pdf]()

@[pdf]
`

    expect(md.render(code)).toMatchSnapshot()
  })
})
