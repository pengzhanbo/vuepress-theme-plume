import type { Plugin } from 'vuepress/core'
import type {
  CopyCodeOptions,
  HighlighterOptions,
  LineNumberOptions,
  PreWrapperOptions,
} from './types.js'
import { isPlainObject } from 'vuepress/shared'
import { colors } from 'vuepress/utils'
import { copyCodeButtonPlugin } from './copy-code-button/index.js'
import { highlight, resolveTsPaths, scanLanguages } from './highlight/index.js'
import {
  collapsedLinesPlugin,
  highlightLinesPlugin,
  lineNumberPlugin,
  preWrapperPlugin,
} from './markdown/index.js'
import { prepareClientConfigFile } from './prepareClientConfigFile.js'
import { logger } from './utils/index.js'

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
      twoslash: !!options.twoslash,
    }),

    extendsMarkdown: async (md, app) => {
      const start = performance.now()
      const theme = options.theme ?? { light: 'github-light', dark: 'github-dark' }

      if (!options.languages || !options.languages.length) {
        options.languages = await scanLanguages(app)
        if (options.languages.length) {
          logger.warn(`You have not configured \`${colors.cyan('plugins.shiki.languages')}\`. It has been detected that you are using \`${colors.green(JSON.stringify(options.languages))}\`. Please add it to the \`${colors.cyan('plugins.shiki.languages')}\` configuration.`)
        }
        if (app.env.isDebug) {
          logger.info(`scan languages in: ${(performance.now() - start).toFixed(2)}ms`)
        }
      }

      if (options.twoslash) {
        const paths = await resolveTsPaths()
        if (paths) {
          options.twoslash = isPlainObject(options.twoslash) ? options.twoslash : {}
          options.twoslash.compilerOptions ??= {}
          options.twoslash.compilerOptions.paths = {
            ...paths,
            ...options.twoslash.compilerOptions.paths,
          }
        }
      }

      md.options.highlight = await highlight(theme, options)
      if (app.env.isDebug) {
        logger.info(`highlight Loaded in: ${(performance.now() - start).toFixed(2)}ms`)
      }

      md.use(highlightLinesPlugin)
      md.use(preWrapperPlugin, { preWrapper })

      if (preWrapper) {
        copyCodeButtonPlugin(md, app, copyCode)
        md.use(lineNumberPlugin, { lineNumbers })
        md.use(collapsedLinesPlugin, { collapsedLines })
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
