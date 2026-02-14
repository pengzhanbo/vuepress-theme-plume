import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import type { CommonLocaleData, FileTreeIconMode, FileTreeOptions } from '../../shared/index.js'
import { encodeData } from '@vuepress/helper'
import { ensureLeadingSlash, removeEndingSlash, resolveLocalePath } from 'vuepress/shared'
import { defaultFile, defaultFolder, getFileIcon } from '../fileIcons/index.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerSyntaxPlugin } from './createContainer.js'

/**
 * File tree node structure
 *
 * 文件树节点结构
 */
interface FileTreeNode extends FileTreeNodeProps {
  level: number
  children: FileTreeNode[]
}

/**
 * File tree container attributes
 *
 * 文件树容器属性
 */
interface FileTreeAttrs {
  title?: string
  icon?: FileTreeIconMode
}

/**
 * File tree node props (for rendering component)
 *
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
 * Parse raw file tree content to node tree structure
 *
 * 解析原始文件树内容为节点树结构
 *
 * @param content - Raw file tree text content / 文件树的原始文本内容
 * @returns File tree node array / 文件树节点数组
 */
export function parseFileTreeRawContent(content: string): FileTreeNode[] {
  const root: FileTreeNode = { level: -1, children: [] } as unknown as FileTreeNode
  const stack: FileTreeNode[] = [root]
  const lines = content.trimEnd().split('\n')
  const spaceLength = lines[0].match(/^\s*/)?.[0].length ?? 0 // Remove leading spaces

  for (const line of lines) {
    const match = line.match(/^(\s*)-(.*)$/)
    if (!match)
      continue

    const level = Math.floor((match[1].length - spaceLength) / 2) // Two spaces per level
    const info = match[2].trim()

    // Find parent node at current level
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

/**
 * Regex for focus marker
 *
 * 高亮标记正则
 */
const RE_FOCUS = /^\*\*(.*)\*\*(?:$|\s+)/

/**
 * Parse single node info string, extract filename, comment, type, etc.
 *
 * 解析单个节点的 info 字符串，提取文件名、注释、类型等属性
 *
 * @param info - Node description string / 节点描述字符串
 * @returns File tree node props / 文件树节点属性
 */
export function parseFileTreeNodeInfo(info: string): FileTreeNodeProps {
  let filename = ''
  let comment = ''
  let focus = false
  let expanded: boolean | undefined = true
  let type: 'folder' | 'file' = 'file'
  let diff: 'add' | 'remove' | undefined

  // Process diff marker
  if (info.startsWith('++')) {
    info = info.slice(2).trim()
    diff = 'add'
  }
  else if (info.startsWith('--')) {
    info = info.slice(2).trim()
    diff = 'remove'
  }

  // Process focus marker
  info = info.replace(RE_FOCUS, (_, matched) => {
    filename = matched
    focus = true
    return ''
  })

  // Extract filename and comment
  if (filename === '' && !focus) {
    const spaceIndex = info.indexOf(' ')
    filename = info.slice(0, spaceIndex === -1 ? info.length : spaceIndex)
    info = spaceIndex === -1 ? '' : info.slice(spaceIndex)
  }

  comment = info.trim()

  // Determine if folder
  if (filename.endsWith('/')) {
    type = 'folder'
    expanded = false
    filename = removeEndingSlash(filename)
  }

  return { filename, comment, focus, expanded, type, diff }
}

/**
 * File tree markdown plugin main function
 *
 * 文件树 markdown 插件主函数
 *
 * @param md - Markdown instance / markdown 实例
 * @param options - File tree render options / 文件树渲染选项
 * @param locales - Locale data / 本地化数据
 */
export function fileTreePlugin(
  md: Markdown,
  options: FileTreeOptions = {},
  locales: Record<string, CommonLocaleData>,
): void {
  /**
   * Get file or folder icon
   *
   * 获取文件或文件夹的图标
   */
  const getIcon = (filename: string, type: 'folder' | 'file', mode?: FileTreeIconMode): string => {
    mode ||= options.icon || 'colored'
    if (mode === 'simple')
      return type === 'folder' ? defaultFolder : defaultFile
    return getFileIcon(filename, type)
  }

  /**
   * Recursively render file tree nodes
   *
   * 递归渲染文件树节点
   */
  const renderFileTree = (nodes: FileTreeNode[], meta: FileTreeAttrs): string =>
    nodes.map((node) => {
      const { level, children, filename, comment, focus, expanded, type, diff } = node
      const isOmit = filename === '…' || filename === '...' /* fallback */

      // Add ellipsis for folder without children
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

  // Register custom container syntax plugin
  return createContainerSyntaxPlugin(
    md,
    'file-tree',
    (tokens, index, _, env: MarkdownEnv) => {
      const token = tokens[index]
      const nodes = parseFileTreeRawContent(token.content)
      const meta = token.meta as FileTreeAttrs
      const cmdText = fileTreeToCMDText(nodes).trim()
      const localePath = resolveLocalePath(locales, ensureLeadingSlash(env.filePathRelative || ''))
      const data = locales[localePath] ?? {}
      return `<div class="vp-file-tree">${
        meta.title ? `<p class="vp-file-tree-title">${meta.title}</p>` : ''
      }<VPCopyButton text="${encodeData(cmdText)}" encode aria-label="${data.copy || 'Copy'}" data-copied="${data.copied || 'Copied'}" />${
        renderFileTree(nodes, meta)
      }</div>\n`
    },
  )
}

/**
 * Convert file tree to command line text format
 *
 * 将文件树转换为命令行文本格式
 *
 * @param nodes - File tree nodes / 文件树节点
 * @param prefix - Line prefix / 行前缀
 * @returns CMD text / CMD 文本
 */
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
