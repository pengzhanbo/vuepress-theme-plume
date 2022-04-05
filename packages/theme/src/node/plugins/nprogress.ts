import type { PluginConfig } from '@vuepress/core'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveNprogress = (
  plugins: PlumeThemePluginOptions
): PluginConfig => {
  if (plugins.nprogress === false) return ['', false]
  return ['@vuepress/nprogress', true]
}
