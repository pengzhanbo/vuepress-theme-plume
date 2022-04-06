import type { PluginConfig } from '@vuepress/core'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveCanIUse = (
  plugins: PlumeThemePluginOptions
): PluginConfig => {
  if (plugins.caniuse === false) return ['', false]
  return [
    '@vuepress-plume/caniuse',
    plugins.caniuse || {
      mode: 'embed',
    },
  ]
}
