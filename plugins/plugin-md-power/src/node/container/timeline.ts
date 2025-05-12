/**
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
 */
import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown } from 'vuepress/markdown'
import { isEmptyObject } from '@pengzhanbo/utils'
import { resolveAttrs } from '.././utils/resolveAttrs.js'
import { stringifyAttrs } from '../utils/stringifyAttrs.js'
import { createContainerPlugin } from './createContainer.js'

export interface TimelineAttrs {
  horizontal?: boolean
  card?: boolean
  placement?: string
  line?: string
}

export interface TimelineItemMeta {
  time?: string
  type?: string
  icon?: string
  color?: string
  line?: string
  card?: string
  placement?: string
}

const RE_KEY = /(\w+)=\s*/
const RE_SEARCH_KEY = /\s+\w+=\s*|$/
const RE_CLEAN_VALUE = /(?<quote>["'])(.*?)(\k<quote>)/

export function timelinePlugin(md: Markdown): void {
  createContainerPlugin(md, 'timeline', {
    before(info, tokens, index) {
      parseTimeline(tokens, index)

      const { attrs } = resolveAttrs<TimelineAttrs>(info)
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
    return `<VPTimelineItem${stringifyAttrs(attrs, true)}>${icon ? `<template #icon><VPIcon name="${icon}"/></template>` : ''}`
  }

  md.renderer.rules.timeline_item_close = () => '</VPTimelineItem>'
  md.renderer.rules.timeline_item_title_open = () => '<template #title>'
  md.renderer.rules.timeline_item_title_close = () => '</template>'
}

function parseTimeline(tokens: Token[], index: number) {
  const listStack: number[] = [] // 记录列表嵌套深度

  for (let i = index + 1; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.type === 'container_timeline_close') {
      break
    }
    // 列表层级追踪
    if (token.type === 'bullet_list_open') {
      listStack.push(0) // 每个新列表初始层级为0
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
      // 仅处理根级列表项（层级1）
      if (currentLevel === 1) {
        token.type = 'timeline_item_open'
        tokens[i + 1].type = 'timeline_item_title_open'
        tokens[i + 3].type = 'timeline_item_title_close'

        // - title
        //   attrs
        // 列表项 `-` 后面包括紧跟随的后续行均在 type=inline 的 token 中， 并作为 children
        const inlineToken = tokens[i + 2]
        // 找到最后一个 softbreak，最后一行作为 attrs 进行解析
        const softbreakIndex = inlineToken.children!.findLastIndex(
          token => token.type === 'softbreak',
        )
        if (softbreakIndex !== -1) {
          const lastToken = inlineToken.children![inlineToken.children!.length - 1]
          token.meta = extractTimelineAttributes(lastToken.content.trim())
          if (!isEmptyObject(token.meta)) {
            inlineToken.children = inlineToken.children!.slice(0, softbreakIndex)
          }
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

export function extractTimelineAttributes(rawText: string): TimelineItemMeta {
  const attrKeys = ['time', 'type', 'icon', 'line', 'color', 'card', 'placement'] as const
  const attrs: TimelineItemMeta = {}
  let buffer = rawText.trim()

  while (buffer.length) {
    // 匹配属性键 (支持大小写)
    const keyMatch = buffer.match(RE_KEY)
    if (!keyMatch) {
      break
    }

    // 提取可能的关键字
    const matchedKey = keyMatch[1].toLowerCase()
    if (!attrKeys.includes(matchedKey as any)) {
      break
    }
    const keyStart = keyMatch.index!

    // 跳过已匹配的 key:
    const keyEnd = keyStart + keyMatch[0].length
    buffer = buffer.slice(keyEnd)

    // 提取属性值 (到下一个属性或行尾)
    let valueEnd = buffer.search(RE_SEARCH_KEY)
    /* istanbul ignore if -- @preserve */
    if (valueEnd === -1)
      valueEnd = buffer.length
    const value = buffer.slice(0, valueEnd).trim()
    // 存储属性
    attrs[matchedKey as keyof TimelineItemMeta] = value.replace(RE_CLEAN_VALUE, '$2')

    // 跳过已处理的值
    buffer = buffer.slice(valueEnd)
  }

  return attrs
}
