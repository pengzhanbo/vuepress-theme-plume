import type { PluginConfig } from '@vuepress/core'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveMediumZoom = (
  plugins: PlumeThemePluginOptions
): PluginConfig => {
  if (plugins.mediumZoom === false) return ['', false]
  return [
    '@vuepress/medium-zoom',
    {
      selector: '.page-content > img, .page-content :not(a) > img',
      zoomOption: {},
      delay: 300,
    },
  ]
}
