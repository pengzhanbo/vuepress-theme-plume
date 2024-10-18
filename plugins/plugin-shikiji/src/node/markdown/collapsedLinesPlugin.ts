import type { Markdown } from 'vuepress/markdown'
import { resolveCollapsedLines } from '../utils/collapsedLines.js'

export interface MarkdownItCollapsedLinesOptions {
  /**
   * Whether to collapse code blocks when they exceed a certain number of lines,
   *
   * - If `number`, collapse starts from line `number`.
   * - If `true`, collapse starts from line 15 by default.
   * - If `false`, disable collapse.
   * @default false
   */
  collapsedLines?: boolean | number
}

export function collapsedLinesPlugin(md: Markdown, {
  collapsedLines: collapsedLinesOptions = false,
}: MarkdownItCollapsedLinesOptions = {}): void {
  const rawFence = md.renderer.rules.fence!

  md.renderer.rules.fence = (...args) => {
    const [tokens, index] = args
    const token = tokens[index]
    // get token info
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
    const code = rawFence(...args)

    // resolve collapsed-lines mark from token info
    const collapsedLinesInfo
      = resolveCollapsedLines(info) ?? collapsedLinesOptions

    if (collapsedLinesInfo === false) {
      return code
    }

    const lines
      = code.slice(code.indexOf('<code>'), code.indexOf('</code>')).split('\n').length

    const startLines
      = typeof collapsedLinesInfo === 'number' ? collapsedLinesInfo : 15

    if (lines < startLines) {
      return code
    }

    const collapsedLinesCode = `<div class="collapsed-lines"></div>`
    const styles = `--vp-collapsed-lines:${startLines};`

    const finalCode = code
      .replace(/<\/div>$/, `${collapsedLinesCode}</div>`)
      .replace(/"(language-[^"]*)"/, '"$1 has-collapsed collapsed"')
      .replace(/^<div[^>]*>/, (match) => {
        if (!match.includes('style=')) {
          return `${match.slice(0, -1)} style="${styles}">`
        }
        return match.replace(/(style=")/, `$1${styles}`)
      })

    return finalCode
  }
}
