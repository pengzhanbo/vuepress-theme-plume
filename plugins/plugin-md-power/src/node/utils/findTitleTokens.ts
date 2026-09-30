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
 * Walks the tokens by type instead of relying on fixed offsets, so loose lists
 * or items whose first block is not a paragraph (nested list, fence, ...) do not
 * shift the indices. Returns `undefined` when the item has no title paragraph.
 *
 * 定位承载列表项标题的段落 token。
 *
 * 按 token 类型游走而非依赖固定偏移，避免 loose list 或首块不是段落的列表项
 * （嵌套列表、代码块等）导致索引错位。当列表项没有标题段落时返回 `undefined`。
 *
 * @param tokens - Token array / token 数组
 * @param startIndex - Index of the `list_item_open` token / `list_item_open` token 的索引
 * @returns Title token range, or `undefined` / 标题 token 范围，找不到时为 `undefined`
 */
export function findTitleTokens(tokens: Token[], startIndex: number): TitleTokenRange | undefined {
  for (let i = startIndex + 1; i < tokens.length; i++) {
    const token = tokens[i]

    if (token.type === 'list_item_close')
      return undefined

    // 尚未遇到段落就进入嵌套列表，说明该项没有标题段落
    // Reaching a nested list before a paragraph means the item has no title paragraph
    if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open')
      return undefined

    if (token.type !== 'paragraph_open')
      continue

    const inline = tokens[i + 1]
    const close = tokens[i + 2]
    if (inline?.type === 'inline' && close?.type === 'paragraph_close')
      return { open: i, inline: i + 1, close: i + 2 }

    return undefined
  }

  return undefined
}
