import type { Plugin } from 'vuepress/core'
import type { ReplaceAssetsPluginOptions } from './options.js'
import { addViteConfig, chainWebpack, getBundlerName } from '@vuepress/helper'
import { PLUGIN_NAME } from './constants.js'
import { normalizeRules } from './normalizeRules.js'
import { createVitePlugin, createWebpackPlugin } from './unplugin/index.js'

const EMPTY_PLUGIN = { name: PLUGIN_NAME }

export function replaceAssetsPlugin(
  options: ReplaceAssetsPluginOptions = {},
): Plugin {
  const rules = normalizeRules(options)

  if (rules.length === 0)
    return EMPTY_PLUGIN

  return {
    ...EMPTY_PLUGIN,

    extendsBundlerOptions(bundlerOptions, app) {
      const bundle = getBundlerName(app)

      if (bundle === 'vite') {
        const viteReplaceAssets = createVitePlugin()
        addViteConfig(bundlerOptions, app, {
          plugins: [viteReplaceAssets(rules)],
        })
      }

      if (bundle === 'webpack') {
        chainWebpack(bundlerOptions, app, (config) => {
          const webpackReplaceAssets = createWebpackPlugin()
          config
            .plugin(PLUGIN_NAME)
            .use(webpackReplaceAssets, [rules])
        })
      }
    },
  }
}
