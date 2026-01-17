import type { Markdown } from 'vuepress/markdown'
import type { MarkdownPowerPluginOptions } from '../../shared/index.js'
import { attrs } from '@mdit/plugin-attrs'
import { footnote } from '@mdit/plugin-footnote'
import { mark } from '@mdit/plugin-mark'
import { sub } from '@mdit/plugin-sub'
import { sup } from '@mdit/plugin-sup'
import { tasklist } from '@mdit/plugin-tasklist'
import { isPlainObject } from '@pengzhanbo/utils'
import cjsFriendly from 'markdown-it-cjk-friendly'
import { abbrPlugin } from './abbr.js'
import { annotationPlugin } from './annotation.js'
import { envPresetPlugin } from './env-preset.js'
import { plotPlugin } from './plot.js'

export function inlineSyntaxPlugin(
  md: Markdown,
  options: MarkdownPowerPluginOptions,
): void {
  md.use(cjsFriendly)
  md.use(attrs)
  md.use(mark)
  md.use(sub)
  md.use(sup)
  md.use(footnote)
  md.use(tasklist)

  const env = options.env || {}

  envPresetPlugin(md, env)

  if (options.annotation) {
    /**
     * xxx [+foo] xxx
     *
     * [+foo]: xxx
     */
    md.use(annotationPlugin, {
      ...env.annotations,
      ...isPlainObject(options.annotation) ? options.annotation : {},
    })
  }

  if (options.abbr) {
    /**
     * a HTML element
     *
     * [HTML]: A HTML element description
     */
    md.use(abbrPlugin, {
      ...env.abbreviations,
      ...isPlainObject(options.abbr) ? options.abbr : {},
    })
  }

  // !!plot!!
  if (options.plot === true || isPlainObject(options.plot)) {
    md.use(plotPlugin)
  }
}
