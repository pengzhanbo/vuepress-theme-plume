import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { attrs } from '@mdit/plugin-attrs'
import { footnote } from '@mdit/plugin-footnote'
import { mark } from '@mdit/plugin-mark'
import { sub } from '@mdit/plugin-sub'
import { sup } from '@mdit/plugin-sup'
import { tasklist } from '@mdit/plugin-tasklist'
import { iconsPlugin } from './icons.js'
import { plotPlugin } from './plot.js'

export function inlineSyntaxPlugin(
  md: Markdown,
  options: MarkdownPowerPluginOptions,
): void {
  md.use(attrs)
  md.use(mark)
  md.use(sub)
  md.use(sup)
  md.use(footnote)
  md.use(tasklist)

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
