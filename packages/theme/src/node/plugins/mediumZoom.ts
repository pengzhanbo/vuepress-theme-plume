import type { Plugin } from '@vuepress/core'
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom'
import type { PlumeThemePluginOptions } from '../../shared/index.js'

export const resolveMediumZoom = (plugins: PlumeThemePluginOptions): Plugin => {
  if (plugins.mediumZoom === false) return [] as unknown as Plugin
  return mediumZoomPlugin({
    selector: '.page-content > img, .page-content :not(a) > img',
    zoomOptions: {},
    delay: 300,
  })
}
