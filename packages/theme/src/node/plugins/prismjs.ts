import type { Plugin } from '@vuepress/core'
import { prismjsPlugin } from '@vuepress/plugin-prismjs'
import type { PlumeThemePluginOptions } from '../../shared/index.js'

export const resolvePrismjs = (plugins: PlumeThemePluginOptions): Plugin => {
  if (plugins.prismjs === false) return [] as unknown as Plugin
  return prismjsPlugin()
}
