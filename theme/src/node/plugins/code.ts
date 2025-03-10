import type { PluginConfig } from 'vuepress'
import type { ThemeBuiltinPlugins } from '../../shared/index.js'
import { uniq } from '@pengzhanbo/utils'
import { isPlainObject } from '@vuepress/helper'
import { copyCodePlugin } from '@vuepress/plugin-copy-code'
import { shikiPlugin } from '@vuepress/plugin-shiki'
import { getThemeConfig } from '../loadConfig/index.js'

export function codePlugins(pluginOptions: ThemeBuiltinPlugins): PluginConfig {
  const options = getThemeConfig()
  const plugins: PluginConfig = []

  // 代码复制
  const copyCode = options.copyCode ?? pluginOptions.copyCode
  if (copyCode !== false) {
    const { ignoreSelector = [], ...copyCodeOptions } = copyCode || {}
    plugins.push(copyCodePlugin({
      ignoreSelector: uniq(['.vp-copy-ignore', '.diff.remove', ...ignoreSelector]),
      ...copyCodeOptions,
    }))
  }

  // 代码高亮
  const shikiOptions = options.codeHighlighter ?? pluginOptions.shiki

  if (shikiOptions !== false) {
    const { twoslash, ...restShikiOptions } = isPlainObject(shikiOptions) ? shikiOptions : {}
    const twoslashOptions = twoslash === true ? {} : twoslash
    plugins.push(shikiPlugin({
      // enable some default features
      notationDiff: true,
      notationErrorLevel: true,
      notationFocus: true,
      notationHighlight: true,
      notationWordHighlight: true,
      highlightLines: true,
      collapsedLines: false,
      twoslash: isPlainObject(twoslashOptions)
        ? {
            ...twoslashOptions,
            // inject markdown class
            floatingVue: { classMarkdown: 'vp-doc', ...twoslashOptions.floatingVue },
          }
        : twoslashOptions,
      ...('theme' in restShikiOptions
        ? {}
        : { themes: { light: 'vitesse-light', dark: 'vitesse-dark' } }),
      ...restShikiOptions,
    }))
  }

  return plugins
}
