/**
 * ::: chat
 * {:time}
 *
 * {user-1}
 * xxxxxxxx
 *
 * {.}
 * xxxxxx
 * :::
 */
import type { PluginSimple } from 'markdown-it'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'
import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { resolveAttrs } from '.././utils/resolveAttrs.js'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'

interface ChatMeta {
  title?: string
}

interface ChatMessage {
  sender: 'user' | 'self'
  date: string
  username: string
  content: string[]
}

export const chatPlugin: PluginSimple = (md) => {
  md.block.ruler.before('fence', 'chat_def', chatDef)

  md.renderer.rules.chat_container = (tokens: Token[], idx: number, _, env) => {
    const { meta, content } = tokens[idx]
    const { title } = meta as ChatMeta
    const messages = parseChatContent(content)
    return `<div class="vp-chat">
  <div class="vp-chat-header">
    <p class="vp-chat-title">${title || 'Chat'}</p>
  </div>
  <div class="vp-chat-content">
    ${chatMessagesRender(md, env, messages)}
  </div>
</div>`
  }
}

function chatDef(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
  const start = state.bMarks[startLine] + state.tShift[startLine]
  const max = state.eMarks[startLine]
  let pos = start

  if (state.src.slice(pos, pos + 3) !== ':::')
    return false

  pos += 3

  const info = state.src.slice(start + 3, max).trim()
  if (!info.startsWith('chat'))
    return false

  /* istanbul ignore if -- @preserve */
  if (silent)
    return true

  let line = startLine
  let content = ''
  while (++line < endLine) {
    if (state.src.slice(state.bMarks[line], state.eMarks[line]).trim() === ':::') {
      break
    }

    content += `${state.src.slice(state.bMarks[line], state.eMarks[line])}\n`
  }

  const token = state.push('chat_container', '', 0)
  token.meta = resolveAttrs<ChatMeta>(info).attrs
  token.content = content
  token.markup = '::: chat'
  token.map = [startLine, line + 1]

  state.line = line + 1

  return true
}

function chatMessagesRender(md: Markdown, env: MarkdownEnv, messages: ChatMessage[]): string {
  let currentDate = ''
  return messages.map(({ sender, username, date, content }) => {
    let messageContent = ''
    if (!currentDate || currentDate !== date) {
      currentDate = date
      messageContent += `<div class="vp-chat-date"><span>${currentDate}</span></div>\n`
    }
    messageContent += `<div class="vp-chat-message ${sender}">
      <div class="vp-chat-message-body">\
      ${sender === 'user' ? `\n<p class="vp-chat-username">${username}</p>` : ''}
        <div class="message-content">
          ${md.render(content.join('\n'), cleanMarkdownEnv(env)).trim()}
        </div>
      </div>
    </div>`

    return messageContent
  })
    .join('\n')
}

// 解析聊天内容的核心逻辑
function parseChatContent(content: string): ChatMessage[] {
  const lines = content.split('\n')
  const messages: ChatMessage[] = []

  let currentDate = ''
  let message!: ChatMessage

  for (const line of lines) {
    const lineStr = line.trim()
    // 解析时间标记
    if (lineStr.startsWith('{:') && lineStr.endsWith('}')) {
      currentDate = lineStr.slice(2, -1).trim()
      continue
    }

    // 解析用户 / 本人标记
    if (lineStr.startsWith('{') && lineStr.endsWith('}')) {
      const username = lineStr.slice(1, -1).trim()
      message = {
        sender: username === '.' ? 'self' : 'user',
        username,
        date: currentDate,
        content: [],
      }
      messages.push(message)
      continue
    }

    // 收集消息内容
    if (message?.sender) {
      message.content.push(line)
    }
  }
  return messages
}
