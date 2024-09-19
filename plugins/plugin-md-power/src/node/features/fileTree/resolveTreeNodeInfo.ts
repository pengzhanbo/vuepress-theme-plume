import Token from 'markdown-it/lib/token.mjs'
import { removeEndingSlash, removeLeadingSlash } from 'vuepress/shared'

interface FileTreeNode {
  filename: string
  type: 'folder' | 'file'
  expanded: boolean
  focus: boolean
  empty: boolean
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

  const children = inline.children?.filter(token => (token.type === 'text' && token.content) || token.tag === 'strong') || []
  const filename = children.filter(token => token.type === 'text').map(token => token.content).join(' ').split(/\s+/)[0] ?? ''
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
  const children = inline.children
  if (!children)
    return

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
        text.content = first
        tokens.push(text)
        const comment = new Token('text', '', 0)
        comment.content = other.join(' ')
        children.unshift(comment)
      }
      else {
        tokens.push(token)
      }
      if (!isStrongTag)
        break
    }
    else if (token.tag === 'strong') {
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
