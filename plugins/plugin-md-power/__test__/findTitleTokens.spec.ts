import type Token from 'markdown-it/lib/token.mjs'
import { describe, expect, it } from 'vitest'
import { findTitleTokens } from '../src/node/utils/findTitleTokens.js'

/** 构造仅包含 `type` 与 `level` 的 token，避免依赖 markdown-it 的完整结构。 */
function token(type: string, level = 0): Token {
  return { type, level } as unknown as Token
}

describe('findTitleTokens', () => {
  it('returns undefined when the list item token is missing', () => {
    // 索引越界时应安全返回，而不是抛出 TypeError。
    expect(findTitleTokens([], 0)).toBeUndefined()
  })

  it('returns undefined when the item has no following paragraph', () => {
    expect(findTitleTokens([token('list_item_open')], 0)).toBeUndefined()
  })

  it('returns undefined for a nested block instead of the title paragraph', () => {
    // 首块为深层 token（嵌套列表/块引用）时不算标题段落。
    const deeper = [token('list_item_open', 1), token('paragraph_open', 3), token('inline', 3), token('paragraph_close', 3)]
    expect(findTitleTokens(deeper, 0)).toBeUndefined()

    const wrongType = [token('list_item_open', 1), token('blockquote_open', 2), token('inline', 2), token('paragraph_close', 2)]
    expect(findTitleTokens(wrongType, 0)).toBeUndefined()
  })

  it('returns undefined when the inline token is missing or mismatched', () => {
    const missingInline = [token('list_item_open'), token('paragraph_open', 1)]
    expect(findTitleTokens(missingInline, 0)).toBeUndefined()

    const wrongInline = [
      token('list_item_open'),
      token('paragraph_open', 1),
      token('text', 1),
      token('paragraph_close', 1),
    ]
    expect(findTitleTokens(wrongInline, 0)).toBeUndefined()
  })

  it('returns undefined when the closing token is not a paragraph close', () => {
    const wrongClose = [
      token('list_item_open'),
      token('paragraph_open', 1),
      token('inline', 1),
      token('heading_close', 1),
    ]
    expect(findTitleTokens(wrongClose, 0)).toBeUndefined()
  })

  it('returns the title token range for a valid list item', () => {
    const tokens = [
      token('list_item_open', 1),
      token('paragraph_open', 2),
      token('inline', 2),
      token('paragraph_close', 2),
    ]

    expect(findTitleTokens(tokens, 0)).toEqual({ open: 1, inline: 2, close: 3 })
  })
})
