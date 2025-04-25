/**
 * !!这里的文本将被黑幕隐藏，通过点击或者 hover 才可重现!!
 */
import type { PluginWithOptions } from 'markdown-it'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'

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

  const token = state.push('plot_inline', 'Plot', 0)
  token.markup = '!!'
  token.content = content

  state.pos = state.posMax + 2
  state.posMax = max

  return true
}

export const plotPlugin: PluginWithOptions<never> = (md) => {
  md.renderer.rules.plot_inline = (tokens, idx) => {
    const token = tokens[idx]
    return `<Plot>${token.content}</Plot>`
  }
  md.inline.ruler.before('emphasis', 'plot', plotDef)
}
