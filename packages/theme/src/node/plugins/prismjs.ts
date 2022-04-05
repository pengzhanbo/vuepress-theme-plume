import type { PluginConfig } from '@vuepress/core'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolvePrismjs = (
  plugins: PlumeThemePluginOptions
): PluginConfig => {
  if (plugins.prismjs === false) return ['', false]
  return ['@vuepress/prismjs', true]
}
