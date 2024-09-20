// markdown-it plugin for generating line numbers.
// v-pre block logic is in `../highlight.ts`
import type { Markdown } from 'vuepress/markdown'
import type { PreWrapperOptions } from '../types.js'
import { resolveAttr, resolveLanguage } from '../utils/index.js'

export function preWrapperPlugin(
  md: Markdown,
  { preWrapper = true }: PreWrapperOptions = {},
): void {
  const rawFence = md.renderer.rules.fence!

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options] = args
    const token = tokens[idx]

    // get token info
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''

    const lang = resolveLanguage(info)
    const title = resolveAttr(info, 'title') || lang
    const classes: string[] = [`${options.langPrefix}${lang}`]

    let result = rawFence(...args)

    if (!preWrapper) {
      // remove `<code>` attributes
      result = result.replace(/<code[\s\S]*?>/, '<code>')
      result = `<pre class="${classes.join(' ')}"${result.slice('<pre'.length)}`
      return result
    }
    const attrs: string[] = [
      `data-ext="${lang}"`,
      `data-title="${title}"`,
    ]

    return `<div class="${classes.join(' ')}" ${attrs.join(' ')}>${result}</div>`
  }
}
