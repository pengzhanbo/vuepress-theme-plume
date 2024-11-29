import type { Markdown } from 'vuepress/markdown'
import type { FileTreeIconMode, FileTreeOptions } from '../../shared/index.js'
import container from 'markdown-it-container'
import Token from 'markdown-it/lib/token.mjs'
import { removeEndingSlash, removeLeadingSlash } from 'vuepress/shared'
import { defaultFile, defaultFolder, getFileIcon } from '../fileIcons/index.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'

interface FileTreeNode {
  filename: string
  type: 'folder' | 'file'
  expanded: boolean
  focus: boolean
  empty: boolean
}

interface FileTreeAttrs {
  title?: string
  icon?: FileTreeIconMode
}

const type = 'file-tree'
const closeType = `container_${type}_close`
const componentName = 'FileTreeItem'
const itemOpen = 'file_tree_item_open'
const itemClose = 'file_tree_item_close'

export function fileTreePlugin(md: Markdown, options: FileTreeOptions = {}) {
  const getIcon = (filename: string, type: 'folder' | 'file', mode?: FileTreeIconMode): string => {
    mode ||= options.icon || 'colored'
    if (mode === 'simple')
      return type === 'folder' ? defaultFolder : defaultFile
    return getFileIcon(filename, type)
  }

  const render = (tokens: Token[], idx: number): string => {
    const { attrs } = resolveAttrs<FileTreeAttrs>(tokens[idx].info.slice(type.length - 1))

    if (tokens[idx].nesting === 1) {
      const hasRes: number[] = [] // level stack
      for (
        let i = idx + 1;
        !(tokens[i].nesting === -1
          && tokens[i].type === closeType);
        ++i
      ) {
        const token = tokens[i]
        if (token.type === 'list_item_open') {
          const result = resolveTreeNodeInfo(tokens, token, i)
          if (result) {
            hasRes.push(token.level)
            const [info, inline] = result
            const { filename, type, expanded, empty } = info
            const icon = getIcon(filename, type, attrs.icon)

            token.type = itemOpen
            token.tag = componentName
            token.attrSet('type', type)
            token.attrSet(':expanded', expanded ? 'true' : 'false')
            token.attrSet(':empty', empty ? 'true' : 'false')
            updateInlineToken(inline, info, icon)
          }
          else {
            hasRes.push(-1)
          }
        }
        else if (token.type === 'list_item_close') {
          if (token.level === hasRes.pop()) {
            token.type = itemClose
            token.tag = componentName
          }
        }
      }
      const title = attrs.title
      return `<div class="vp-file-tree">${title ? `<p class="vp-file-tree-title">${title}</p>` : ''}`
    }
    else {
      return '</div>'
    }
  }

  md.use(container, type, { render })
}

export function resolveTreeNodeInfo(
  tokens: Token[],
  current: Token,
  idx: number,
): [FileTreeNode, Token] | undefined {
  let hasInline = false
  let hasChildren = false
  let inline!: Token
  for (
    let i = idx + 1;
    !(tokens[i].level === current.level && tokens[i].type === 'list_item_close');
    ++i
  ) {
    if (tokens[i].type === 'inline' && !hasInline) {
      inline = tokens[i]
      hasInline = true
    }
    else if (tokens[i].tag === 'ul') {
      hasChildren = true
    }

    if (hasInline && hasChildren)
      break
  }

  if (!hasInline)
    return undefined

  const children = inline.children!.filter(token => (token.type === 'text' && token.content) || token.tag === 'strong')
  const filename = children.filter(token => token.type === 'text').map(token => token.content).join(' ').split(/\s+/)[0]
  const focus = children[0]?.tag === 'strong'
  const type = hasChildren || filename.endsWith('/') ? 'folder' : 'file'
  const info: FileTreeNode = {
    filename: removeLeadingSlash(removeEndingSlash(filename)),
    type,
    focus,
    empty: !hasChildren,
    expanded: type === 'folder' && !filename.endsWith('/'),
  }

  return [info, inline] as const
}

export function updateInlineToken(inline: Token, info: FileTreeNode, icon: string) {
  const children = inline.children!

  const tokens: Token[] = []
  const wrapperOpen = new Token('span_open', 'span', 1)
  const wrapperClose = new Token('span_close', 'span', -1)

  wrapperOpen.attrSet('class', `tree-node ${info.type}`)
  tokens.push(wrapperOpen)

  if (info.filename !== '...' && info.filename !== '…') {
    const iconOpen = new Token('vp_iconify_open', 'VPIcon', 1)
    iconOpen.attrSet('name', icon)
    const iconClose = new Token('vp_iconify_close', 'VPIcon', -1)

    tokens.push(iconOpen, iconClose)
  }

  const fileOpen = new Token('span_open', 'span', 1)
  fileOpen.attrSet('class', `name${info.focus ? ' focus' : ''}`)
  tokens.push(fileOpen)

  let isStrongTag = false
  while (children.length) {
    const token = children.shift()!
    if (token.type === 'text' && token.content) {
      if (token.content.includes(' ')) {
        const [first, ...other] = token.content.split(' ')
        const text = new Token('text', '', 0)
        text.content = removeEndingSlash(first)
        tokens.push(text)
        const comment = new Token('text', '', 0)
        comment.content = other.join(' ')
        children.unshift(comment)
      }
      else {
        token.content = removeEndingSlash(token.content)
        tokens.push(token)
      }
      if (!isStrongTag)
        break
    }
    else if (token.tag === 'strong') {
      token.content = removeEndingSlash(token.content)
      tokens.push(token)
      if (token.nesting === 1) {
        isStrongTag = true
      }
      else {
        break
      }
    }
    else {
      tokens.push(token)
    }
  }

  const fileClose = new Token('span_close', 'span', -1)
  tokens.push(fileClose)

  if (children.filter(token => token.type === 'text' && token.content.trim()).length) {
    const commentOpen = new Token('span_open', 'span', 1)
    commentOpen.attrSet('class', 'comment')
    const commentClose = new Token('span_close', 'span', -1)

    tokens.push(commentOpen, ...children, commentClose)
  }

  tokens.push(wrapperClose)
  inline.children = tokens
}
