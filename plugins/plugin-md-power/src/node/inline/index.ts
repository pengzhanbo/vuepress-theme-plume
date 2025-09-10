import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { attrs } from '@mdit/plugin-attrs'
import { footnote } from '@mdit/plugin-footnote'
import { mark } from '@mdit/plugin-mark'
import { sub } from '@mdit/plugin-sub'
import { sup } from '@mdit/plugin-sup'
import { tasklist } from '@mdit/plugin-tasklist'
import { isPlainObject } from '@vuepress/helper'
import { abbrPlugin } from './abbr.js'
import { annotationPlugin } from './annotation.js'
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

  if (options.annotation) {
    /**
     * xxx [+foo] xxx
     *
     * [+foo]: xxx
     */
    md.use(annotationPlugin)
  }

  if (options.abbr) {
    /**
     * a HTML element
     *
     * [HTML]: A HTML element description
     */
    md.use(abbrPlugin)
  }

  // !!plot!!
  if (options.plot === true || isPlainObject(options.plot)) {
    md.use(plotPlugin)
  }
}
