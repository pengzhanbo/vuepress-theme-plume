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

  it('should not break when a list item starts with a nested list', () => {
    const code = `\
::: collapse
-
  - 嵌套列表

- :- 标题

  内容
:::
`
    const html = md.render(code)

    // 首块为嵌套列表的项没有标题段落，不应被误判为标题，只会生成一个标题插槽。
    // An item whose first block is a nested list has no title paragraph and must
    // not be mistaken for a title, so only one title slot is rendered.
    expect(html.match(/<template #title>/g)).toHaveLength(1)
    expect(html).toContain('嵌套列表')
  })

  it('should not treat a paragraph inside a blockquote as the title', () => {
    const code = `\
::: collapse
- > 引用内容

- :- 标题

  内容
:::
`
    const html = md.render(code)

    // 块引用内部的段落不能作为标题，否则 title 插槽会落在 blockquote 内部。
    // A paragraph inside a blockquote must not become the title, otherwise the
    // title slot would end up inside the blockquote.
    expect(html.match(/<template #title>/g)).toHaveLength(1)
    expect(html.indexOf('<template #title>')).toBeGreaterThan(html.indexOf('</blockquote>'))
  })
})
