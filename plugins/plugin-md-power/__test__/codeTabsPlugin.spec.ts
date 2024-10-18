import type { CodeTabsOptions } from '../src/shared/codeTabs.js'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { codeTabs } from '../src/node/container/codeTabs.js'

function createMarkdown(options?: CodeTabsOptions) {
  const md = new MarkdownIt()
  md.options.highlight = str => `<pre><code>${str}</code></pre>`
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => `<div class="language-lang">${fence(...args)}</div>`

  md.use(codeTabs, options)
  return md
}

const FENCE = '```'

describe('codeTabsPlugin', () => {
  const code = `\
::: code-tabs
@tab tab-1
${FENCE}js
const a = 1
${FENCE}
@tab tab-2
${FENCE}js
const b = 2
${FENCE}
@tab tab-3
${FENCE}js
const c = 3
${FENCE}
:::

::: code-tabs
@tab npm
${FENCE}sh
npm i
${FENCE}
@tab:active pnpm
${FENCE}sh
pnpm i
${FENCE}
@tab yarn
${FENCE}sh
yarn
${FENCE}
:::

::: code-tabs#pm
@tab a.ts
${FENCE}ts
const a = 1
${FENCE}
@tab a.js
${FENCE}js
const a = 1
${FENCE}
:::
`
  it('should work with default', () => {
    const md = createMarkdown()
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work with no icon', () => {
    const md = createMarkdown({ icon: false })
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work with options: `{ named: false, extensions: false }`', () => {
    const md = createMarkdown({ icon: { named: false, extensions: false } })
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work with options: { named: [npm,pnpm,yarn], extensions: [.js,.ts] }', () => {
    const md = createMarkdown({ icon: { named: ['npm', 'pnpm', 'yarn'], extensions: ['.js', '.ts'] } })
    expect(md.render(code)).toMatchSnapshot()
  })
})
