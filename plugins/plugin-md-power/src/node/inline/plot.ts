/**
 * !!这里的文本将被黑幕隐藏，通过点击或者 hover 才可重现!!
 *
 * !!The text here will be hidden by a spoiler, and can only be revealed by clicking or hovering!!
 */
import type { PluginWithOptions } from 'markdown-it'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'

/**
 * Plot inline rule definition
 *
 * 黑幕行内规则定义
 *
 * @param state - Markdown-it state / Markdown-it 状态
 * @param silent - Silent mode / 静默模式
 * @returns Whether matched / 是否匹配
 */
const plotDef: RuleInline = (state, silent) => {
  let found = false
  const max = state.posMax
  const start = state.pos

  if (
    state.src.charCodeAt(start) !== 0x21
    || state.src.charCodeAt(start + 1) !== 0x21
  ) {
    return false
  }

  const next = state.src.charCodeAt(start + 2)

  // - !! xxx  |  !!!xxx
  //     ^     |    ^
  if (next === 0x20 || next === 0x21)
    return false

  /* istanbul ignore if -- @preserve */
  if (silent)
    return false

  // - !!!!
  if (max - start < 5)
    return false

  state.pos = start + 2

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === 0x21
      && state.src.charCodeAt(state.pos + 1) === 0x21) {
      found = true
      break
    }

    state.md.inline.skipToken(state)
  }

  if (
    !found
    || start + 2 === state.pos
    // - !!xxx !!
    //        ^
    || state.src.charCodeAt(state.pos - 1) === 0x20
  ) {
    state.pos = start

    return false
  }
  const content = state.src.slice(start + 2, state.pos)

  // found!
  state.posMax = state.pos
  state.pos = start + 2

  const openToken = state.push('plot_inline_open', 'Plot', 1)
  openToken.markup = '!!'
  openToken.content = content

  const contentToken = state.push('text', '', 0)
  contentToken.content = content

  const closeToken = state.push('plot_inline_close', 'Plot', -1)
  closeToken.markup = '!!'

  state.pos = state.posMax + 2
  state.posMax = max

  return true
}

/**
 * Plot plugin - Hide text with spoiler effect
 *
 * 黑幕插件 - 使用黑幕效果隐藏文本
 *
 * Syntax: !!hidden text!!
 * 语法：!!隐藏文本!!
 *
 * @param md - Markdown-it instance / Markdown-it 实例
 */
export const plotPlugin: PluginWithOptions<never> = (md) => {
  md.inline.ruler.before('emphasis', 'plot', plotDef)
}
