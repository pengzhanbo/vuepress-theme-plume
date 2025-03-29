import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { chatPlugin } from '../src/node/container/chat.js'

describe('chatPlugin', () => {
  const md = new MarkdownIt().use(chatPlugin)
  it('should work', () => {
    const code = `\
::: chat title="用户聊天"
{:2025-06-01 12:00:00}
{用户一}
这是用户一的消息
{.}
这是本人的消息
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work multiple users', () => {
    const code = `\
::: chat
{:2025-06-01 12:00:00}
{用户一}
这是用户一的消息

{.}
这是本人的消息

{用户二}
这是用户二的消息

{.}
这是本人的消息
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should work multiple date and user', () => {
    const code = `\
::: chat

{:2025-06-01 12:00:00}
{用户一}
这是用户一的消息

{.}
这是本人的消息

{用户二}
这是用户二的消息

{.}
这是本人的消息

{:2025-06-05 12:00:00}
{用户一}
这是用户一的消息

{.}
这是本人的消息

{用户二}
这是用户二的消息

{.}
这是本人的消息
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })

  it('should not work', () => {
    const code = `\
::: char
not work
:::
`
    expect(md.render(code)).toMatchSnapshot()
  })
})
