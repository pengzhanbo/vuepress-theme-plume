import fs from 'node:fs'
import container from 'markdown-it-container'
import type Token from 'markdown-it/lib/token.mjs'
import type { App } from 'vuepress/core'
import type { Markdown } from 'vuepress/markdown'
import { type FileIcon, folderIcon, getFileIcon } from './findIcon.js'
import { resolveTreeNodeInfo, updateInlineToken } from './resolveTreeNodeInfo.js'

const type = 'file-tree'
const closeType = `container_${type}_close`
const componentName = 'FileTreeItem'
const itemOpen = 'file_tree_item_open'
const itemClose = 'file_tree_item_close'
const classPrefix = 'vp-fti-'
const styleFilepath = 'internal/md-power/file-tree.css'

export async function fileTreePlugin(app: App, md: Markdown) {
  const validate = (info: string): boolean => info.trim().startsWith(type)
  const render = (tokens: Token[], idx: number): string => {
    if (tokens[idx].nesting === 1) {
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
            const [info, inline] = result
            const { filename, type, expanded, empty } = info
            const icon = type === 'file' ? getFileIcon(filename) : folderIcon

            token.type = itemOpen
            token.tag = componentName
            token.attrSet('type', type)
            token.attrSet(':expanded', expanded ? 'true' : 'false')
            token.attrSet(':empty', empty ? 'true' : 'false')
            updateInlineToken(inline, info, `${classPrefix}${icon.name}`)
            addIcon(icon)
          }
        }
        else if (token.type === 'list_item_close') {
          token.type = itemClose
          token.tag = componentName
        }
      }
      const info = tokens[idx].info.trim()

      const title = info.slice(type.length).trim()
      return `<div class="vp-file-tree">${title ? `<p class="vp-file-tree-title">${title}</p>` : ''}`
    }
    else {
      return '</div>'
    }
  }

  let timer: NodeJS.Timeout | null = null
  const icons: Record<string, FileIcon> = {}

  function addIcon(icon: FileIcon) {
    icons[icon.name] = icon

    if (timer)
      clearTimeout(timer)
    timer = setTimeout(async () => {
      let content = ''
      for (const icon of Object.values(icons)) {
        content += `.${classPrefix}${icon.name} { --icon: ${icon.svg}; }\n`
      }
      await app.writeTemp(styleFilepath, content)
    }, 150)
  }

  md.use(container, type, { validate, render })

  if (!fs.existsSync(app.dir.temp(styleFilepath)))
    await app.writeTemp(styleFilepath, '')
}
