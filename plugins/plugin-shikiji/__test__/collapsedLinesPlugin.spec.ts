import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { collapsedLinesPlugin } from '../src/node/markdown/collapsedLinesPlugin.js'

const FENCE = '```'

function createMarkdown(collapsedLines?: boolean | number, hasStyles = false) {
  const md = new MarkdownIt()

  md.options.highlight = str => `<pre><code>${str}</code></pre>`
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) =>
    `<div class="language-"${hasStyles ? ' style="color: red;"' : ''}>${fence(...args)}</div>`

  md.use(collapsedLinesPlugin, collapsedLines ? { collapsedLines } : undefined)

  return md
}

describe('collapsedLinesPlugin', () => {
  const genLines = (n: number) =>
    Array.from({ length: n }).map((_, i) => `const line${i + 1} = ${i + 1}`).join('\n')
  const code = `\
${FENCE}
${genLines(10)}
${FENCE}

${FENCE}js
${genLines(20)}
${FENCE}

${FENCE}js :collapsed-lines
${genLines(20)}
${FENCE}

${FENCE}js :collapsed-lines=10
${genLines(12)}
${FENCE}

${FENCE}js :no-collapsed-lines
${genLines(20)}
${FENCE}
`
  it('should work with default', () => {
    const md = createMarkdown()
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work with true', () => {
    const md = createMarkdown(true)
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work with number', () => {
    const md = createMarkdown(10)
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work with includes styles', () => {
    const md = createMarkdown(true, true)
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work with false', () => {
    const md = createMarkdown(false)
    expect(md.render(code)).toMatchSnapshot()
  })
})
