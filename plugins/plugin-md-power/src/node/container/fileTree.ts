import type { Markdown } from 'vuepress/markdown'
import type { FileTreeIconMode, FileTreeOptions } from '../../shared/index.js'
import { encodeData } from '@vuepress/helper'
import { removeEndingSlash } from 'vuepress/shared'
import { defaultFile, defaultFolder, getFileIcon } from '../fileIcons/index.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerSyntaxPlugin } from './createContainer.js'

/**
 * 文件树节点结构
 */
interface FileTreeNode extends FileTreeNodeProps {
  level: number
  children: FileTreeNode[]
}

/**
 * 文件树容器属性
 */
interface FileTreeAttrs {
  title?: string
  icon?: FileTreeIconMode
}

/**
 * 文件树节点属性（用于渲染组件）
 */
export interface FileTreeNodeProps {
  filename: string
  comment?: string
  focus?: boolean
  expanded?: boolean
  type: 'folder' | 'file'
  diff?: 'add' | 'remove'
  level?: number
}

/**
 * 解析原始文件树内容为节点树结构
 * @param content 文件树的原始文本内容
 * @returns 文件树节点数组
 */
export function parseFileTreeRawContent(content: string): FileTreeNode[] {
  const root: FileTreeNode = { level: -1, children: [] } as unknown as FileTreeNode
  const stack: FileTreeNode[] = [root]
  const lines = content.trimEnd().split('\n')
  const spaceLength = lines[0].match(/^\s*/)?.[0].length ?? 0 // 去除行首空格/)

  for (const line of lines) {
    const match = line.match(/^(\s*)-(.*)$/)
    if (!match)
      continue

    const level = Math.floor((match[1].length - spaceLength) / 2) // 每两个空格为一个层级
    const info = match[2].trim()

    // 检索当前层级的父节点
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }

    const parent = stack[stack.length - 1]
    const node: FileTreeNode = { level, children: [], ...parseFileTreeNodeInfo(info) }
    parent.children.push(node)
    stack.push(node)
  }

  return root.children
}

const RE_FOCUS = /^\*\*(.*)\*\*(?:$|\s+)/

/**
 * 解析单个节点的 info 字符串，提取文件名、注释、类型等属性
 * @param info 节点描述字符串
 * @returns 文件树节点属性
 */
export function parseFileTreeNodeInfo(info: string): FileTreeNodeProps {
  let filename = ''
  let comment = ''
  let focus = false
  let expanded: boolean | undefined = true
  let type: 'folder' | 'file' = 'file'
  let diff: 'add' | 'remove' | undefined

  // 处理 diff 标记
  if (info.startsWith('++')) {
    info = info.slice(2).trim()
    diff = 'add'
  }
  else if (info.startsWith('--')) {
    info = info.slice(2).trim()
    diff = 'remove'
  }

  // 处理高亮（focus）标记
  info = info.replace(RE_FOCUS, (_, matched) => {
    filename = matched
    focus = true
    return ''
  })

  // 提取文件名和注释
  if (filename === '' && !focus) {
    const spaceIndex = info.indexOf(' ')
    filename = info.slice(0, spaceIndex === -1 ? info.length : spaceIndex)
    info = spaceIndex === -1 ? '' : info.slice(spaceIndex)
  }

  comment = info.trim()

  // 判断是否为文件夹
  if (filename.endsWith('/')) {
    type = 'folder'
    expanded = false
    filename = removeEndingSlash(filename)
  }

  return { filename, comment, focus, expanded, type, diff }
}

/**
 * 文件树 markdown 插件主函数
 * @param md markdown 实例
 * @param options 文件树渲染选项
 */
export function fileTreePlugin(md: Markdown, options: FileTreeOptions = {}): void {
  /**
   * 获取文件或文件夹的图标
   */
  const getIcon = (filename: string, type: 'folder' | 'file', mode?: FileTreeIconMode): string => {
    mode ||= options.icon || 'colored'
    if (mode === 'simple')
      return type === 'folder' ? defaultFolder : defaultFile
    return getFileIcon(filename, type)
  }

  /**
   * 递归渲染文件树节点
   */
  const renderFileTree = (nodes: FileTreeNode[], meta: FileTreeAttrs): string =>
    nodes.map((node) => {
      const { level, children, filename, comment, focus, expanded, type, diff } = node
      const isOmit = filename === '…' || filename === '...' /* fallback */

      // 文件夹无子节点时补充省略号
      if (children.length === 0 && type === 'folder') {
        children.push({ level: level + 1, children: [], filename: '…', type: 'file' } as unknown as FileTreeNode)
      }

      const nodeType = children.length > 0 ? 'folder' : type
      const renderedComment = comment
        ? `<template #comment>${md.renderInline(comment.replaceAll('#', '\#'))}</template>`
        : ''
      const renderedIcon = !isOmit
        ? `<template #icon><VPIcon provider="iconify" name="${getIcon(filename, nodeType, meta.icon)}" /></template>`
        : ''
      const props: FileTreeNodeProps = {
        expanded: nodeType === 'folder' ? expanded : false,
        focus,
        type: nodeType,
        diff,
        filename,
        level,
      }
      return `<FileTreeNode${stringifyAttrs(props, false, ['filename'])}>
${renderedIcon}${renderedComment}${children.length > 0 ? renderFileTree(children, meta) : ''}
</FileTreeNode>`
    }).join('\n')

  // 注册自定义容器语法插件
  return createContainerSyntaxPlugin(
    md,
    'file-tree',
    (tokens, index) => {
      const token = tokens[index]
      const nodes = parseFileTreeRawContent(token.content)
      const meta = token.meta as FileTreeAttrs
      const cmdText = fileTreeToCMDText(nodes).trim()
      return `<div class="vp-file-tree">${
        meta.title ? `<p class="vp-file-tree-title">${meta.title}</p>` : ''
      }<VPCopyButton text="${encodeData(cmdText)}" encode />${
        renderFileTree(nodes, meta)
      }</div>\n`
    },
  )
}

function fileTreeToCMDText(nodes: FileTreeNode[], prefix = ''): string {
  let content = prefix ? '' : '.\n'
  for (let i = 0, l = nodes.length; i < l; i++) {
    const { filename, children } = nodes[i]
    content += `${prefix + (i === l - 1 ? '└── ' : '├── ')}${filename}\n`
    const child = children.filter(n => n.filename !== '…')
    if (child.length)
      content += fileTreeToCMDText(child, prefix + (i === l - 1 ? '    ' : '│   '))
  }
  return content
}
