import type { PluginObject } from '@vuepress/core'
import { prismjsPlugin } from '@vuepress/plugin-prismjs'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolvePrismjs = (
  plugins: PlumeThemePluginOptions
): PluginObject | false => {
  if (plugins.prismjs === false) return false
  return prismjsPlugin()
}
