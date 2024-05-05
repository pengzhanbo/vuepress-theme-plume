import type { Plugin, PluginObject } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'
import { highlight } from './highlight.js'
import type { HighlighterOptions } from './types.js'

export type ShikiPluginOptions = HighlighterOptions

const __dirname = getDirname(import.meta.url)

export function shikiPlugin(options: ShikiPluginOptions = {}): Plugin {
  const plugin: PluginObject = {
    name: '@vuepress-plume/plugin-shikiji',

    extendsMarkdown: async (md, app) => {
      const theme = options.theme ?? { light: 'github-light', dark: 'github-dark' }
      const highlighter = await highlight(theme, options, app.env.isDev)

      md.options.highlight = highlighter
    },
  }

  if (!options.twoslash)
    return plugin

  return {

    ...plugin,

    clientConfigFile: path.resolve(__dirname, '../client/config.js'),

    extendsMarkdownOptions: (options) => {
      if (options.code === false)
        return

      // 注入 floating-vue 后，需要关闭 代码块 的 v-pre 配置
      if (options.code?.vPre) {
        options.code.vPre.block = false
      }
      else {
        options.code ??= {}
        options.code.vPre = { block: false }
      }
    },
  }
}
