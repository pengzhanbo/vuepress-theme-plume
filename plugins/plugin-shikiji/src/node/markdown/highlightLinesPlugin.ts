// Modified from https://github.com/egoist/markdown-it-highlight-lines
// Now this plugin is only used to normalize line attrs.
// The else part of line highlights logic is in '../highlight.ts'.

import type { Markdown } from 'vuepress/markdown'

const HIGHLIGHT_LINES_REGEXP = /\{([\d,-]+)\}/

export function highlightLinesPlugin(md: Markdown): void {
  const rawFence = md.renderer.rules.fence!

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]

    let lines: string | null = null

    const rawInfo = token.info
    const result = rawInfo?.match(HIGHLIGHT_LINES_REGEXP)

    if (!result)
      return rawFence(...args)

    // ensure the next plugin get the correct lang
    token.info = rawInfo.replace(HIGHLIGHT_LINES_REGEXP, '').trim()

    lines = result[1]

    token.info += ` ${lines}`
    return rawFence(...args)
  }
}
