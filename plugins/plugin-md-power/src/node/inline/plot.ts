/**
 * !!这里的文本将被黑幕隐藏，通过点击或者 hover 才可重现!!
 */
import type { PluginWithOptions } from 'markdown-it'
import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'

const [openTag, endTag] = ['!!', '!!']

export const plotPlugin: PluginWithOptions<never> = md =>
  md.inline.ruler.before('emphasis', 'plot', createTokenizer())

function createTokenizer(): RuleInline {
  return (state, silent) => {
    let found = false
    const max = state.posMax
    const start = state.pos

    if (state.src.slice(start, start + 2) !== openTag)
      return false

    if (silent)
      return false

    // - !!!!
    if (max - start < 5)
      return false

    state.pos = start + 2

    while (state.pos < max) {
      if (state.src.slice(state.pos - 1, state.pos + 1) === endTag) {
        found = true
        break
      }

      state.md.inline.skipToken(state)
    }

    if (!found || start + 2 === state.pos) {
      state.pos = start

      return false
    }
    const content = state.src.slice(start + 2, state.pos - 1)

    // 不允许前后带有空格
    if (/^\s|\s$/.test(content)) {
      state.pos = start
      return false
    }

    // found!
    state.posMax = state.pos - 1
    state.pos = start + 2

    const open = state.push('plot_open', 'Plot', 1)
    open.markup = openTag

    const text = state.push('text', '', 0)
    text.content = content

    const close = state.push('plot_close', 'Plot', -1)
    close.markup = endTag

    state.pos = state.posMax + 2
    state.posMax = max

    return true
  }
}
