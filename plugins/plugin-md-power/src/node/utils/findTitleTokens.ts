import type Token from 'markdown-it/lib/token.mjs'

/**
 * Range of tokens holding a list item's title paragraph.
 *
 * 承载列表项标题段落的 token 范围。
 */
export interface TitleTokenRange {
  /** Index of the `paragraph_open` token / `paragraph_open` token 的索引 */
  open: number
  /** Index of the `inline` token holding the title content / 承载标题内容的 `inline` token 索引 */
  inline: number
  /** Index of the `paragraph_close` token / `paragraph_close` token 的索引 */
  close: number
}

/**
 * Locate the paragraph tokens that hold a list item's title.
 *
 * The title is the paragraph that is a **direct child** of the list item, so the
 * match is limited by `token.level`. Items whose first block is a nested block
 * (blockquote, nested list, fence, ...) have no title paragraph and return
 * `undefined`; otherwise the generated `<template #title>` would end up inside
 * the nested block and would not be collected as the component's `title` slot.
 *
 * 定位承载列表项标题的段落 token。
 *
 * 标题是列表项的**直接子节点**段落，因此通过 `token.level` 限制匹配范围。首块为
 * 嵌套块（块引用、嵌套列表、代码块等）的列表项没有标题段落，返回 `undefined`，
 * 否则生成的 `<template #title>` 会落在嵌套块内部，无法被组件收集为 `title` 插槽。
 *
 * @param tokens - Token array / token 数组
 * @param startIndex - Index of the `list_item_open` token / `list_item_open` token 的索引
 * @returns Title token range, or `undefined` / 标题 token 范围，找不到时为 `undefined`
 */
export function findTitleTokens(tokens: Token[], startIndex: number): TitleTokenRange | undefined {
  const item = tokens[startIndex]
  if (!item)
    return undefined

  // 列表项直接子节点的层级；嵌套块内部的 token 层级更深。
  // Nesting level of the list item's direct children; tokens inside nested blocks are deeper.
  const childLevel = item.level + 1

  const open = tokens[startIndex + 1]
  if (!open || open.type !== 'paragraph_open' || open.level !== childLevel)
    return undefined

  const inline = tokens[startIndex + 2]
  const close = tokens[startIndex + 3]
  if (inline?.type !== 'inline' || close?.type !== 'paragraph_close')
    return undefined

  return { open: startIndex + 1, inline: startIndex + 2, close: startIndex + 3 }
}
