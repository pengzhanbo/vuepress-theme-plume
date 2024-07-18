import type { Plugin } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'

export interface IconifyPluginOptions {
  componentName?: string
  color?: string
  size?: string | number
}

export function iconifyPlugin({
  componentName = 'Iconify',
  size = '1em',
  color = 'currentColor',
}: IconifyPluginOptions = {}): Plugin {
  return {
    name: '@vuepress-plume/plugin-iconify',
    define: {
      __VP_ICONIFY_NAME__: componentName,
      __VP_ICONIFY_SIZE__: size,
      __VP_ICONIFY_COLOR__: color,
    },
    clientConfigFile: path.resolve(getDirname(import.meta.url), '../client/config.js'),
  }
}
