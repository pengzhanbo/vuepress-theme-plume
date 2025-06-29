import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { fieldPlugin } from '../src/node/container/field.js'

describe('fieldPlugin', () => {
  const md = new MarkdownIt().use(fieldPlugin)

  it('::: field', () => {
    const code = `\
::: field name="foo" type="string" required
description
:::

::: field name="bar" type="string" optional
description
:::

::: field name="bar" type="string" deprecated default="baz"
description
:::

::: field name="foo" default="undefined"
description
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })

  it('::: field-group', () => {
    const code = `\
:::: field-group
::: field name="foo" type="string" required
description
:::

::: field name="bar" type="string" optional
description
:::
::::
`
    expect(md.render(code)).toMatchSnapshot()
  })
})
