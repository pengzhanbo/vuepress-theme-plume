import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { collapsePlugin } from '../src/node/container/collapse.js'

describe('collapsePlugin', () => {
  const md = new MarkdownIt().use(collapsePlugin)
  it('should work', () => {
    const code = `\
::: collapse
- :+ 标题

  内容

- :- \`code\`标题

  内容
  - 列表 1
  - 列表 2

- \`code\` 标题

  内容
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work with expand', () => {
    const code = `\
::: collapse expand
- 标题

  内容

- 标题

  内容

- :- 标题

  内容
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work with accordion', () => {
    const code = `\
::: collapse accordion
- 标题

  内容

- 标题

  内容

- 标题

  内容
:::

::: collapse accordion expand
- 标题

  内容

- 标题

  内容

- 标题

  内容
:::

::: collapse accordion
- 标题

  内容

- :+ 标题

  内容

- 标题

  内容
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })
})
