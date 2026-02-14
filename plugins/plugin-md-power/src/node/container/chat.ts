/**
 * Chat container plugin
 *
 * 聊天容器插件
 *
 * Syntax:
 * ```md
 * ::: chat
 * {:time}
 *
 * {user-1}
 * xxxxxxxx
 *
 * {.}
 * xxxxxx
 * :::
 * ```
 */
import type { PluginSimple } from 'markdown-it'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'
import { createContainerSyntaxPlugin } from './createContainer.js'

/**
 * Chat message structure
 *
 * 聊天消息结构
 */
interface ChatMessage {
  sender: 'user' | 'self'
  date: string
  username: string
  content: string[]
}

/**
 * Render chat messages to HTML
 *
 * 渲染聊天消息为 HTML
 *
 * @param md - Markdown instance / Markdown 实例
 * @param env - Markdown environment / Markdown 环境
 * @param messages - Chat messages / 聊天消息数组
 * @returns Rendered HTML / 渲染后的 HTML
 */
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

/**
 * Parse chat content to messages
 *
 * 解析聊天内容为消息数组
 *
 * @param content - Raw chat content / 原始聊天内容
 * @returns Parsed chat messages / 解析后的聊天消息
 */
function parseChatContent(content: string): ChatMessage[] {
  const lines = content.split('\n')
  const messages: ChatMessage[] = []

  let currentDate = ''
  let message!: ChatMessage

  for (const line of lines) {
    const lineStr = line.trim()
    // Parse time marker
    if (lineStr.startsWith('{:') && lineStr.endsWith('}')) {
      currentDate = lineStr.slice(2, -1).trim()
      continue
    }

    // Parse user/self marker
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

    // Collect message content
    if (message?.sender) {
      message.content.push(line)
    }
  }
  return messages
}

/**
 * Chat plugin - Enable chat container
 *
 * 聊天插件 - 启用聊天容器
 *
 * @param md - Markdown-it instance / Markdown-it 实例
 */
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
