import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown } from 'vuepress/markdown'
import container from 'markdown-it-container'
import { getFileIcon } from './findIcon.js'
import { resolveTreeNodeInfo, updateInlineToken } from './resolveTreeNodeInfo.js'

const type = 'file-tree'
const closeType = `container_${type}_close`
const componentName = 'FileTreeItem'
const itemOpen = 'file_tree_item_open'
const itemClose = 'file_tree_item_close'

export function fileTreePlugin(md: Markdown) {
  const validate = (info: string): boolean => info.trim().startsWith(type)
  const render = (tokens: Token[], idx: number): string => {
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
            const icon = getFileIcon(filename, type)

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
      const info = tokens[idx].info.trim()

      const title = info.slice(type.length).trim()
      return `<div class="vp-file-tree">${title ? `<p class="vp-file-tree-title">${title}</p>` : ''}`
    }
    else {
      return '</div>'
    }
  }

  md.use(container, type, { validate, render })
}
