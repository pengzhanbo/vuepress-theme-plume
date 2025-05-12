/**
 * @module CodeTree
 *
 * code-tree 容器
 * ````md
 * ::: code-tree title="Project Name" height="400px" entry="filepath"
 * ``` lang :active title="filepath"
 * ```
 * <!-- more code block -->
 * :::
 * ````
 *
 * embed syntax
 *
 * `@[code-tree title="Project Name" height="400px" entry="filepath"](dir_path)`
 */

import type { App, Page } from 'vuepress/core'
import type { Markdown } from 'vuepress/markdown'
import type { CodeTreeOptions } from '../../shared/codeTree.js'
import type { FileTreeIconMode } from '../../shared/fileTree.js'
import type { FileTreeNodeProps } from './fileTree.js'
import path from 'node:path'
import { globSync } from 'tinyglobby'
import { removeLeadingSlash } from 'vuepress/shared'
import { findFile, readFileSync } from '../demo/supports/file.js'
import { createEmbedRuleBlock } from '../embed/createEmbedRuleBlock.js'
import { defaultFile, defaultFolder, getFileIcon } from '../fileIcons/index.js'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'
import { parseRect } from '../utils/parseRect.js'
import { resolveAttr, resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

const UNSUPPORTED_FILE_TYPES = [
  /* image */
  'jpg',
  'jpeg',
  'png',
  'gif',
  'avif',
  'webp',
  /* media */
  'mp3',
  'mp4',
  'ogg',
  'm3u8',
  'm3u',
  'flv',
  'webm',
  'wav',
  'flac',
  'aac',
  /* document */
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
]

interface CodeTreeMeta {
  title?: string
  /**
   * 文件图标类型
   */
  icon?: FileTreeIconMode
  /**
   * 代码树容器高度
   */
  height?: string

  /**
   * 入口文件，默认打开
   */
  entry?: string
}

interface FileTreeNode {
  level: number
  children?: FileTreeNode[]
  filename: string
  filepath?: string
}

function parseFileNodes(files: string[]): FileTreeNode[] {
  const nodes: FileTreeNode[] = []
  for (const file of files) {
    const parts = removeLeadingSlash(file).split('/')
    let node = nodes
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1
      let child = node.find(n => n.filename === part)
      if (!child) {
        child = {
          level: i + 1,
          filename: part,
          filepath: isFile ? file : undefined,
          children: isFile ? undefined : [],
        }
        node.push(child)
      }
      if (!isFile && child.children)
        node = child.children
    }
  }

  return nodes
}

export function codeTreePlugin(md: Markdown, app: App, options: CodeTreeOptions = {}): void {
  const getIcon = (filename: string, type: 'folder' | 'file', mode?: FileTreeIconMode): string => {
    mode ||= options.icon || 'colored'
    if (mode === 'simple')
      return type === 'folder' ? defaultFolder : defaultFile
    return getFileIcon(filename, type)
  }

  function renderFileTree(nodes: FileTreeNode[], mode?: FileTreeIconMode): string {
    return nodes.map((node) => {
      const props: FileTreeNodeProps & { filepath?: string } = {
        filename: node.filename,
        level: node.level,
        type: node.children?.length ? 'folder' : 'file',
        expanded: true,
        filepath: node.filepath,
      }
      return `<FileTreeNode${stringifyAttrs(props)}>
  <template #icon><VPIcon name="${getIcon(node.filename, props.type, mode)}" /></template>
  ${node.children?.length ? renderFileTree(node.children, mode) : ''}
</FileTreeNode>`
    })
      .join('\n')
  }

  createContainerPlugin(md, 'code-tree', {
    before: (info, tokens, index) => {
      const files: string[] = []
      let activeFile: string | undefined
      for (
        let i = index + 1;
        !(
          tokens[i].nesting === -1
          && tokens[i].type === 'container_code-tree_close'
        );
        i++
      ) {
        const token = tokens[i]
        if (token.type === 'fence' && token.tag === 'code') {
          const fenceInfo = md.utils.unescapeAll(token.info)
          const title = resolveAttr(fenceInfo, 'title')
          if (title) {
            files.push(title)
            if (fenceInfo.includes(':active'))
              activeFile = title
          }
        }
      }

      const { attrs } = resolveAttrs<CodeTreeMeta>(info)
      const { title, icon, height, entry } = attrs
      const fileTreeNodes = parseFileNodes(files)
      const entryFile = activeFile || entry || files[0]
      const h = height || String(options.height)
      return `<VPCodeTree${stringifyAttrs({ title, entryFile, height: h ? parseRect(h) : undefined })}><template #file-tree>${
        renderFileTree(fileTreeNodes, icon)
      }</template>`
    },
    after: () => '</VPCodeTree>',
  })

  createEmbedRuleBlock(md, {
    type: 'code-tree',
    syntaxPattern: /^@\[code-tree([^\]]*)\]\(([^)]*)\)/,
    meta: ([, info, dir]) => {
      const { attrs } = resolveAttrs<CodeTreeMeta>(info)
      const h = attrs.height || String(options.height)
      return {
        title: attrs.title,
        entryFile: attrs.entry,
        icon: attrs.icon,
        height: h ? parseRect(h) : undefined,
        dir,
      }
    },
    content: ({ dir, icon, ...props }, _, env) => {
      const codeTreeFiles = ((env as any).codeTreeFiles ??= []) as string[]
      const root = findFile(app, env, dir)
      const files = globSync('**/*', {
        cwd: root,
        onlyFiles: true,
        dot: true,
        ignore: ['**/node_modules/**', '**/.DS_Store', '**/.gitkeep'],
      }).sort((a, b) => {
        const al = a.split('/').length
        const bl = b.split('/').length
        return bl - al
      })
      props.entryFile ||= files[0]

      const codeContent = files.map((file) => {
        const ext = path.extname(file).slice(1)
        if (UNSUPPORTED_FILE_TYPES.includes(ext)) {
          return ''
        }
        const filepath = path.join(root, file)
        codeTreeFiles.push(filepath)
        const content = readFileSync(filepath)
        return `\`\`\`${ext || 'txt'} title="${file}"\n${content}\n\`\`\``
      }).filter(Boolean).join('\n')

      const fileTreeNodes = parseFileNodes(files)
      return `<VPCodeTree${stringifyAttrs(props)}><template #file-tree>${
        renderFileTree(fileTreeNodes, icon)
      }</template>${md.render(codeContent, cleanMarkdownEnv(env))}</VPCodeTree>`
    },
  })
}

export function extendsPageWithCodeTree(page: Page): void {
  const markdownEnv = page.markdownEnv
  const codeTreeFiles = (markdownEnv.codeTreeFiles ?? []) as string[]
  if (codeTreeFiles.length)
    page.deps.push(...codeTreeFiles)
}
