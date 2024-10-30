import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { demoWrapperPlugin } from '../src/node/container/demoWrapper.js'

describe('demoWrapperPlugin', () => {
  const md = new MarkdownIt().use(demoWrapperPlugin)
  it('should work', () => {
    const code = `\
::: demo-wrapper
content
:::

::: demo-wrapper title="test"
content
:::

::: demo-wrapper no-padding img height="100px"

[xxx](/img.jpg)
:::

::: demo-wrapper no-padding img height="100"

[xxx](/img.jpg)
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })
})
