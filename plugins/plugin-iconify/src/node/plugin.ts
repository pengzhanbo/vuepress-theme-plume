import type { App, Plugin } from '@vuepress/core'
import { getDirname, path } from '@vuepress/utils'
import type { IconifyOptions } from '../shared/index.js'

export const iconifyPlugin = ({
  componentName = 'Iconify',
  size = '1em',
  color = 'currentColor',
}: IconifyOptions = {}): Plugin => {
  return (app: App) => {
    return {
      name: '@vuepress-plume/plugin-iconify',
      define: {
        __VUEPRESS_PLUGIN_ICONIFY_COMPONENT_NAME__: componentName,
        __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_SIZE__: size,
        __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_COLOR__: color,
      },
      clientConfigFile: path.resolve(
        getDirname(import.meta.url),
        '../client/clientConfig.js'
      ),
    }
  }
}
