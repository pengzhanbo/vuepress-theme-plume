import type { Plugin } from '@vuepress/core'
import { highlight } from './highlight.js'
import type { HighlighterOptions } from './types'

/**
 * Options of @vuepress/plugin-shiki
 */
export type ShikijiPluginOptions = HighlighterOptions

export function shikijiPlugin(options: ShikijiPluginOptions = {}): Plugin {
  return {
    name: '@vuepress-plume/plugin-shikiji',

    extendsMarkdown: async (md) => {
      const theme = options.theme ?? { light: 'github-light', dark: 'github-dark' }
      const highlighter = await highlight(theme, options)

      md.options.highlight = highlighter
    },
  }
}
