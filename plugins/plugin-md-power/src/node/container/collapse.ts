/**
 * Collapse container plugin
 *
 * 折叠面板容器插件
 *
 * Syntax:
 * ```md
 * ::: collapse accordion
 * - + 标题
 *   内容
 * - - 标题
 *   内容
 * :::
 * ```
 */
import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown } from 'vuepress/markdown'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

/**
 * Collapse metadata
 *
 * 折叠面板元数据
 */
interface CollapseMeta {
  accordion?: boolean
  expand?: boolean
}

/**
 * Collapse item metadata
 *
 * 折叠面板项元数据
 */
interface CollapseItemMeta {
  expand?: boolean
  index?: number
}

/**
 * Collapse plugin - Enable collapse container
 *
 * 折叠面板插件 - 启用折叠面板容器
 *
 * @param md - Markdown instance / Markdown 实例
 */
export function collapsePlugin(md: Markdown): void {
  createContainerPlugin(md, 'collapse', {
    before: (info, tokens, index) => {
      const { attrs } = resolveAttrs<CollapseMeta>(info)
      const idx = parseCollapse(tokens, index, attrs)
      const { accordion } = attrs

      return `<VPCollapse${stringifyAttrs({ accordion, index: idx })}>`
    },
    after: () => `</VPCollapse>`,
  })
  md.renderer.rules.collapse_item_open = (tokens, idx) => {
    const token = tokens[idx]
    const { expand, index } = token.meta as CollapseItemMeta
    return `<VPCollapseItem${stringifyAttrs({ expand, index })}>`
  }
  md.renderer.rules.collapse_item_close = () => '</VPCollapseItem>'
  md.renderer.rules.collapse_item_title_open = () => '<template #title>'
  md.renderer.rules.collapse_item_title_close = () => '</template>'
}

/**
 * Parse collapse tokens
 *
 * 解析折叠面板令牌
 *
 * @param tokens - Token array / 令牌数组
 * @param index - Start index / 起始索引
 * @param attrs - Collapse metadata / 折叠面板元数据
 * @returns Default expanded index / 默认展开索引
 */
function parseCollapse(tokens: Token[], index: number, attrs: CollapseMeta): number | void {
  const listStack: number[] = [] // Track list nesting depth
  let idx = -1 // Current list item index
  let defaultIndex: number | undefined
  let hashExpand = false
  for (let i = index + 1; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.type === 'container_collapse_close') {
      break
    }
    // Track list level
    if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
      listStack.push(0) // Each new list starts at level 0
      if (listStack.length === 1)
        token.hidden = true
    }
    else if (token.type === 'bullet_list_close' || token.type === 'ordered_list_close') {
      listStack.pop()
      if (listStack.length === 0)
        token.hidden = true
    }
    else if (token.type === 'list_item_open') {
      const currentLevel = listStack.length
      // Only process root level list items (level 1)
      if (currentLevel === 1) {
        token.type = 'collapse_item_open'
        tokens[i + 1].type = 'collapse_item_title_open'
        tokens[i + 3].type = 'collapse_item_title_close'

        idx++

        const inlineToken = tokens[i + 2]
        const firstToken = inlineToken.children![0]
        let flag: string = ''
        let expand: boolean | undefined
        if (firstToken.type === 'text') {
          firstToken.content = firstToken.content.trim().replace(/^:[+\-]\s*/, (match) => {
            flag = match.trim()
            return ''
          })
        }
        if (attrs.accordion) {
          if (!hashExpand && flag === ':+') {
            expand = hashExpand = true
            defaultIndex = idx
          }
        }
        else if (flag === ':+') {
          expand = true
        }
        else if (flag === ':-') {
          expand = false
        }
        else {
          expand = !!attrs.expand
        }

        token.meta = {
          index: idx,
          expand,
        } as CollapseItemMeta
      }
    }
    else if (token.type === 'list_item_close') {
      const currentLevel = listStack.length
      if (currentLevel === 1) {
        token.type = 'collapse_item_close'
      }
    }
  }
  if (attrs.accordion && attrs.expand && !hashExpand) {
    defaultIndex = 0
  }
  return defaultIndex
}
