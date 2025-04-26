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
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'
import { createContainerSyntaxPlugin } from './createContainer.js'

interface ChatMessage {
  sender: 'user' | 'self'
  date: string
  username: string
  content: string[]
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

export const chatPlugin: PluginSimple = md => createContainerSyntaxPlugin(
  md,
  'chat',
  (tokens, idx, _, env) => `<div class="vp-chat">
  <div class="vp-chat-header">
    <p class="vp-chat-title">${tokens[idx].meta?.title || 'Chat'}</p>
  </div>
  <div class="vp-chat-content">
    ${chatMessagesRender(md, env, parseChatContent(tokens[idx].content))}
  </div>
</div>`,
)
