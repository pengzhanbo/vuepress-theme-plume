import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { iconsPlugin } from './icons.js'
import { plotPlugin } from './plot.js'

export function inlineSyntaxPlugin(
  md: Markdown,
  options: MarkdownPowerPluginOptions,
): void {
  if (options.icons) {
    // :[collect:name]:
    md.use(iconsPlugin)
  }

  if (
    options.plot === true
    || (typeof options.plot === 'object' && options.plot.tag !== false)
  ) {
    // !!plot!!
    md.use(plotPlugin)
  }
}
