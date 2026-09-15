import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { windowPlugin } from '../src/node/container/window.js'

describe('windowPlugin', () => {
  const md = new MarkdownIt({ html: true }).use(windowPlugin)
  it('should work', () => {
    const code = `\
::: window
content
:::

::: window title="test"
content
:::

::: window height="100px"
![xxx](/img.jpg)
:::

::: window height="100" gap="20px"
![xxx](/img.jpg)
:::

::: window

  <img src="/img.jpg" alt="xxx">
:::

::: window

  <picture>
    <source srcset="/img.jpg" type="image/webp" />
    <img src="/img.jpg" alt="xxx" />
  </picture>
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should handle single non-html element content', () => {
    const code = `\
::: window
\`\`\`js
const a = 1
\`\`\`
:::
`
    const result = md.render(code)
    // 单个非 html_block 元素不会被识别为图片，使用默认间距
    expect(result).toContain('--window-gap:20px')
  })

  it('legacy demo-wrapper container', () => {
    const code = `\
::: demo-wrapper
content
:::

::: demo-wrapper title="test"
content
:::

::: demo-wrapper height="100px"
![xxx](/img.jpg)
:::

::: demo-wrapper height="100" gap="20px"
![xxx](/img.jpg)
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })
})
