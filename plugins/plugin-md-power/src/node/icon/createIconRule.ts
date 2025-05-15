import type { RuleInline } from 'markdown-it/lib/parser_inline.mjs'

export function createIconRule(
  [l1, l2, r1, r2]: readonly [number, number, number, number],
  deprecated?: boolean,
): RuleInline {
  return (state, silent) => {
    let found = false
    const max = state.posMax
    const start = state.pos

    // ::xxx
    // ^^
    if (
      state.src.charCodeAt(start) !== l1
      || state.src.charCodeAt(start + 1) !== l2
    ) {
      return false
    }

    const next = state.src.charCodeAt(start + 2)

    // :: xxx  |  :::xxx
    //   ^     |    ^
    if (next === 0x20 || next === 0x3A)
      return false

    /* istanbul ignore if -- @preserve */
    if (silent)
      return false

    // ::::
    if (max - start < 5)
      return false

    state.pos = start + 2

    while (state.pos < max) {
    // ::xxx::
    //      ^^
      if (
        state.src.charCodeAt(state.pos) === r1
        && state.src.charCodeAt(state.pos + 1) === r2
      ) {
        found = true
        break
      }

      state.md.inline.skipToken(state)
    }

    if (
      !found
      || start + 2 === state.pos
      // ::xxx ::
      //      ^
      || state.src.charCodeAt(state.pos - 1) === 0x20
    ) {
      state.pos = start

      return false
    }

    const info = state.src.slice(start + 2, state.pos)

    // found
    state.posMax = state.pos
    state.pos = start + 2

    const icon = state.push('icon', 'i', 0)

    icon.markup = '::'
    icon.content = info
    icon.meta = { deprecated }

    state.pos = state.posMax + 2
    state.posMax = max

    return true
  }
}
