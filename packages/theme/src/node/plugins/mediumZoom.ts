import type { PluginObject } from '@vuepress/core'
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveMediumZoom = (
  plugins: PlumeThemePluginOptions
): PluginObject | false => {
  if (plugins.mediumZoom === false) return false
  return mediumZoomPlugin({
    selector: '.page-content > img, .page-content :not(a) > img',
    zoomOptions: {},
    delay: 300,
  })
}
