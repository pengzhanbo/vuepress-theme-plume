import type { Plugin } from 'vuepress/core'
import type { ReplaceAssetsPluginOptions } from './options.js'
import { addViteConfig, configWebpack, getBundlerName } from '@vuepress/helper'
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
        const replaceAssets = createVitePlugin()
        addViteConfig(bundlerOptions, app, {
          plugins: [replaceAssets(rules)],
        })
      }

      if (bundle === 'webpack') {
        const replaceAssets = createWebpackPlugin()
        configWebpack(bundlerOptions, app, (config) => {
          config.plugins ??= []
          config.plugins.push(replaceAssets(rules))
        })
      }
    },
  }
}
