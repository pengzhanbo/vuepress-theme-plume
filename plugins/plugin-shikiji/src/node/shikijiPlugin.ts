import type { Plugin } from 'vuepress/core'
import { highlight } from './highlight.js'
import type { HighlighterOptions } from './types'

export type ShikiPluginOptions = HighlighterOptions

export function shikiPlugin(options: ShikiPluginOptions = {}): Plugin {
  return {
    name: '@vuepress-plume/plugin-shikiji',

    extendsMarkdown: async (md) => {
      const theme = options.theme ?? { light: 'github-light', dark: 'github-dark' }
      const highlighter = await highlight(theme, options)

      md.options.highlight = highlighter
    },
  }
}
