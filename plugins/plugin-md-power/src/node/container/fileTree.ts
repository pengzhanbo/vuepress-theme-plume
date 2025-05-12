import type { Markdown } from 'vuepress/markdown'
import type { FileTreeIconMode, FileTreeOptions } from '../../shared/index.js'
import { removeEndingSlash } from 'vuepress/shared'
import { defaultFile, defaultFolder, getFileIcon } from '../fileIcons/index.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerSyntaxPlugin } from './createContainer.js'

interface FileTreeNode {
  info: string
  level: number
  children: FileTreeNode[]
}

interface FileTreeAttrs {
  title?: string
  icon?: FileTreeIconMode
}

export interface FileTreeNodeProps {
  filename: string
  comment?: string
  focus?: boolean
  expanded?: boolean
  type: 'folder' | 'file'
  diff?: 'add' | 'remove'
  level?: number
}

export function parseFileTreeRawContent(content: string): FileTreeNode[] {
  const root: FileTreeNode = { info: '', level: -1, children: [] }
  const stack: FileTreeNode[] = [root]
  const lines = content.trim().split('\n')
  for (const line of lines) {
    const match = line.match(/^(\s*)-(.*)$/)
    if (!match)
      continue

    const level = Math.floor(match[1].length / 2) // 每两个空格为一个层级
    const info = match[2].trim()

    // 检索当前层级的父节点
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }

    const parent = stack[stack.length - 1]
    const node: FileTreeNode = { info, level, children: [] }
    parent.children.push(node)
    stack.push(node)
  }

  return root.children
}

const RE_FOCUS = /^\*\*(.*)\*\*(?:$|\s+)/

export function parseFileTreeNodeInfo(info: string): FileTreeNodeProps {
  let filename = ''
  let comment = ''
  let focus = false
  let expanded: boolean | undefined = true
  let type: 'folder' | 'file' = 'file'
  let diff: 'add' | 'remove' | undefined

  if (info.startsWith('++')) {
    info = info.slice(2).trim()
    diff = 'add'
  }
  else if (info.startsWith('--')) {
    info = info.slice(2).trim()
    diff = 'remove'
  }

  info = info.replace(RE_FOCUS, (_, matched) => {
    filename = matched
    focus = true
    return ''
  })

  if (filename === '' && !focus) {
    const spaceIndex = info.indexOf(' ')
    filename = info.slice(0, spaceIndex === -1 ? info.length : spaceIndex)
    info = spaceIndex === -1 ? '' : info.slice(spaceIndex)
  }

  comment = info.trim()

  if (filename.endsWith('/')) {
    type = 'folder'
    expanded = false
    filename = removeEndingSlash(filename)
  }

  return { filename, comment, focus, expanded, type, diff }
}

export function fileTreePlugin(md: Markdown, options: FileTreeOptions = {}): void {
  const getIcon = (filename: string, type: 'folder' | 'file', mode?: FileTreeIconMode): string => {
    mode ||= options.icon || 'colored'
    if (mode === 'simple')
      return type === 'folder' ? defaultFolder : defaultFile
    return getFileIcon(filename, type)
  }

  const renderFileTree = (nodes: FileTreeNode[], meta: FileTreeAttrs): string =>
    nodes.map((node) => {
      const { info, level, children } = node
      const { filename, comment, focus, expanded, type, diff } = parseFileTreeNodeInfo(info)
      const isOmit = filename === '…' || filename === '...' /* fallback */

      if (children.length === 0 && type === 'folder') {
        children.push({ info: '…', level: level + 1, children: [] })
      }

      const nodeType = children.length > 0 ? 'folder' : type
      const renderedComment = comment
        ? `<template #comment>${md.renderInline(comment.replaceAll('#', '\#'))}</template>`
        : ''
      const renderedIcon = !isOmit
        ? `<template #icon><VPIcon name="${getIcon(filename, nodeType, meta.icon)}" /></template>`
        : ''
      const props: FileTreeNodeProps = {
        expanded: nodeType === 'folder' ? expanded : false,
        focus,
        type: nodeType,
        diff,
        filename,
        level,
      }
      return `<FileTreeNode${stringifyAttrs(props)}>
${renderedIcon}${renderedComment}${children.length > 0 ? renderFileTree(children, meta) : ''}
</FileTreeNode>`
    }).join('\n')

  return createContainerSyntaxPlugin(
    md,
    'file-tree',
    (tokens, index) => {
      const token = tokens[index]
      const nodes = parseFileTreeRawContent(token.content)
      const meta = token.meta as FileTreeAttrs
      return `<div class="vp-file-tree">${
        meta.title ? `<p class="vp-file-tree-title">${meta.title}</p>` : ''
      }${renderFileTree(nodes, meta)}</div>\n`
    },
  )
}
