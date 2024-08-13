import type { Plugin } from 'vuepress/core'
import { isPlainObject } from 'vuepress/shared'
import { highlight } from './highlight/index.js'
import type {
  CopyCodeOptions,
  HighlighterOptions,
  LineNumberOptions,
  PreWrapperOptions,
} from './types.js'
import {
  highlightLinesPlugin,
  lineNumberPlugin,
  preWrapperPlugin,
} from './markdown/index.js'
import { copyCodeButtonPlugin } from './copy-code-button/index.js'
import { prepareClientConfigFile } from './prepareClientConfigFile.js'

export interface ShikiPluginOptions
  extends HighlighterOptions, LineNumberOptions, PreWrapperOptions {
  /**
   * Add copy code button
   *
   * @default true
   */
  copyCode?: boolean | CopyCodeOptions
}

export function shikiPlugin({
  preWrapper = true,
  lineNumbers = true,
  copyCode = true,
  collapsedLines = false,
  ...options
}: ShikiPluginOptions = {}): Plugin {
  const copyCodeOptions: CopyCodeOptions = isPlainObject(copyCode) ? copyCode : {}

  return {
    name: '@vuepress-plume/plugin-shikiji',

    define: {
      __CC_DURATION__: copyCodeOptions.duration ?? 2000,
      __CC_SELECTOR__: `div[class*="language-"] > button.${copyCodeOptions.className || 'copy'}`,
    },

    clientConfigFile: app => prepareClientConfigFile(app, {
      copyCode: copyCode !== false,
      twoslash: options.twoslash ?? false,
    }),

    extendsMarkdown: async (md, app) => {
      const theme = options.theme ?? { light: 'github-light', dark: 'github-dark' }

      md.options.highlight = await highlight(theme, options)

      md.use(highlightLinesPlugin)
      md.use(preWrapperPlugin, {
        preWrapper,
        collapsedLines,
      })

      if (preWrapper) {
        copyCodeButtonPlugin(md, app, copyCode)
        md.use<LineNumberOptions>(lineNumberPlugin, { lineNumbers })
      }
    },

    extendsMarkdownOptions: (options) => {
      // 注入 floating-vue 后，需要关闭 代码块 的 v-pre 配置
      if ((options as any).vPre !== false) {
        const vPre = isPlainObject((options as any).vPre) ? (options as any).vPre : { block: true }
        if (vPre.block) {
          (options as any).vPre ??= {}
          ;(options as any).vPre.block = false
        }
      }
    },
  }
}
