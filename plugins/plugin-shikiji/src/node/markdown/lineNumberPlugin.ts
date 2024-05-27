// markdown-it plugin for generating line numbers.
// It depends on preWrapper plugin.

import type { Markdown } from 'vuepress/markdown'
import type { LineNumberOptions } from '../types.js'

const LINE_NUMBERS_REGEXP = /:line-numbers\b/
const NO_LINE_NUMBERS_REGEXP = /:no-line-numbers\b/

export function lineNumberPlugin(md: Markdown, { lineNumbers = true }: LineNumberOptions = {}): void {
  const rawFence = md.renderer.rules.fence!

  md.renderer.rules.fence = (...args) => {
    const rawCode = rawFence(...args)

    const [tokens, idx] = args
    const info = tokens[idx].info
    const enableLineNumbers = LINE_NUMBERS_REGEXP.test(info)
    const disableLineNumbers = NO_LINE_NUMBERS_REGEXP.test(info)

    if (info.includes('twoslash'))
      return rawCode

    if (
      (!lineNumbers && !enableLineNumbers)
      || (lineNumbers && disableLineNumbers)
    )
      return rawCode

    const code = rawCode.slice(
      rawCode.indexOf('<code>'),
      rawCode.indexOf('</code>'),
    )

    const lines = code.split('\n')

    if (
      typeof lineNumbers === 'number'
      && lines.length < lineNumbers
      && !enableLineNumbers
    )
      return rawCode

    const lineNumbersCode = [...Array(lines.length)]
      .map(() => `<div class="line-number"></div>`)
      .join('')

    const lineNumbersWrapperCode = `<div class="line-numbers" aria-hidden="true">${lineNumbersCode}</div>`

    const finalCode = rawCode
      .replace(/<\/div>$/, `${lineNumbersWrapperCode}</div>`)
      .replace(/"(language-[^"]*?)"/, '"$1 line-numbers-mode"')

    return finalCode
  }
}
