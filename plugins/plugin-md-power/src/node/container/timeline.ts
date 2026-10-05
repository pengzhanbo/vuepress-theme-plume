/**
 * Timeline container plugin
 *
 * 时间线容器插件
 *
 * Syntax:
 * ```md
 * ::: timeline
 *
 * - title
 *   time="Q1" icon="ri:clockwise-line" line="dashed" type="warning" color="red"
 *
 *   content
 *
 * - title
 *   time="Q2" icon="ri:clockwise-line" line="dashed" type="warning" color="red"
 *
 *   content
 * :::
 * ```
 */
import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown } from 'vuepress/markdown'
import { isEmptyObject } from '@pengzhanbo/utils'
import { resolveAttrs } from '.././utils/resolveAttrs.js'
import { findTitleTokens } from '../utils/findTitleTokens.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

/**
 * Timeline attributes
 *
 * 时间线属性
 */
export interface TimelineAttrs {
  horizontal?: boolean
  card?: boolean
  placement?: string
  line?: string
}

/**
 * Timeline item metadata
 *
 * 时间线项元数据
 */
export interface TimelineItemMeta {
  time?: string
  type?: string
  icon?: string
  color?: string
  line?: string
  card?: string
  placement?: string
}

/**
 * Regex for matching attribute keys
 *
 * 匹配属性键的正则
 */
const RE_KEY = /(\w+)=\s*/

/**
 * Regex for searching next attribute key
 *
 * 搜索下一个属性键的正则
 */
const RE_SEARCH_KEY = /\s+\w+=\s*|$/

/**
 * Regex for cleaning quote values
 *
 * 清理引号值的正则
 */
const RE_CLEAN_VALUE = /(?<quote>["'])(.*?)(\k<quote>)/

/**
 * Timeline plugin - Enable timeline container
 *
 * 时间线插件 - 启用时间线容器
 *
 * @param md - Markdown instance / Markdown 实例
 */
export function timelinePlugin(md: Markdown): void {
  createContainerPlugin(md, 'timeline', {
    before(info, tokens, index) {
      parseTimeline(tokens, index)

      const attrs = resolveAttrs<TimelineAttrs>(info)
      attrs.card ??= undefined
      return `<VPTimeline${stringifyAttrs(attrs, true)}>`
    },
    after: () => '</VPTimeline>',
  })

  md.renderer.rules.timeline_item_open = (tokens, idx) => {
    const token = tokens[idx]
    const attrs = token.meta as TimelineItemMeta
    attrs.card ??= undefined
    const icon = attrs.icon
    return `<VPTimelineItem${stringifyAttrs(attrs, true)}>${icon ? `<template #icon><VPIcon provider="iconify" name="${md.utils.escapeHtml(icon)}"/></template>` : ''}`
  }

  md.renderer.rules.timeline_item_close = () => '</VPTimelineItem>'
  md.renderer.rules.timeline_item_title_open = () => '<template #title>'
  md.renderer.rules.timeline_item_title_close = () => '</template>'
}

/**
 * Parse timeline tokens
 *
 * 解析时间线令牌
 *
 * @param tokens - Token array / 令牌数组
 * @param index - Start index / 起始索引
 */
function parseTimeline(tokens: Token[], index: number) {
  const listStack: number[] = [] // Track list nesting depth

  for (let i = index + 1; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.type === 'container_timeline_close') {
      break
    }
    // Track list level
    if (token.type === 'bullet_list_open') {
      listStack.push(0) // Each new list starts at level 0
      if (listStack.length === 1)
        token.hidden = true
    }
    else if (token.type === 'bullet_list_close') {
      listStack.pop()
      if (listStack.length === 0)
        token.hidden = true
    }
    else if (token.type === 'list_item_open') {
      const currentLevel = listStack.length
      // Only process root level list items (level 1)
      if (currentLevel === 1) {
        token.type = 'timeline_item_open'

        // 按 token 类型定位标题段落，避免 loose/nested list 下固定偏移错位。
        // Locate the title paragraph by token type instead of fixed offsets, so
        // loose/nested lists cannot shift the indices.
        const range = findTitleTokens(tokens, i)
        if (!range) {
          token.meta = {}
          continue
        }
        tokens[range.open].type = 'timeline_item_title_open'
        tokens[range.close].type = 'timeline_item_title_close'

        // - title
        //   attrs
        // List item `-` followed by subsequent lines are in type=inline token as children
        const inlineToken = tokens[range.inline]
        const children = inlineToken.children
        // Find last softbreak, last line as attrs
        // inline token 始终带有 children 数组，`?? -1` 仅为类型层面的防御性兜底。
        // An inline token always has a children array; `?? -1` only guards the type.
        /* istanbul ignore next -- @preserve */
        const softbreakIndex = children?.findLastIndex(
          token => token.type === 'softbreak',
        ) ?? -1
        if (children && softbreakIndex !== -1) {
          const lastToken = children[children.length - 1]
          token.meta = extractTimelineAttributes(lastToken.content.trim())
          if (!isEmptyObject(token.meta))
            inlineToken.children = children.slice(0, softbreakIndex)
        }
        else {
          token.meta = {}
        }
      }
    }
    else if (token.type === 'list_item_close') {
      const currentLevel = listStack.length
      if (currentLevel === 1) {
        token.type = 'timeline_item_close'
      }
    }
  }
}

/**
 * Extract timeline attributes from raw text
 *
 * 从原始文本中提取时间线属性
 *
 * @param rawText - Raw attribute text / 原始属性文本
 * @returns Timeline item metadata / 时间线项元数据
 */
export function extractTimelineAttributes(rawText: string): TimelineItemMeta {
  const attrKeys = ['time', 'type', 'icon', 'line', 'color', 'card', 'placement'] as const
  const attrs: TimelineItemMeta = {}
  let buffer = rawText.trim()

  while (buffer.length) {
    // Match attribute key (case insensitive)
    const keyMatch = buffer.match(RE_KEY)
    if (!keyMatch) {
      break
    }

    // Extract possible keyword
    const matchedKey = keyMatch[1].toLowerCase()
    if (!attrKeys.includes(matchedKey as any)) {
      break
    }
    const keyStart = keyMatch.index!

    // Skip matched key:
    const keyEnd = keyStart + keyMatch[0].length
    buffer = buffer.slice(keyEnd)

    // Extract attribute value (to next attribute or end of line)
    let valueEnd = buffer.search(RE_SEARCH_KEY)
    /* istanbul ignore if -- @preserve */
    if (valueEnd === -1)
      valueEnd = buffer.length
    const value = buffer.slice(0, valueEnd).trim()
    // Store attribute
    attrs[matchedKey as keyof TimelineItemMeta] = value.replace(RE_CLEAN_VALUE, '$2')

    // Skip processed value
    buffer = buffer.slice(valueEnd)
  }

  return attrs
}
