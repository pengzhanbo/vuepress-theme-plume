import type { App, Plugin } from '@vuepress/core'
import { getDirname, path } from '@vuepress/utils'
import type { IconifyOptions } from '../shared/index.js'

export const iconifyPlugin = ({
  componentName = 'Iconify',
  size = '1em',
  color = 'currentColor',
}: IconifyOptions): Plugin => {
  return (app: App) => {
    return {
      name: '@vuepress-plume/vuepress-plugin-iconify',
      define: {
        __VUEPRESS_PLUGIN_ICONIFY_COMPONENT_NAME__:
          JSON.stringify(componentName),
        __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_SIZE__: JSON.stringify(size),
        __VUEPRESS_PLUGIN_ICONIFY_DEFAULT_COLOR__: JSON.stringify(color),
      },
      clientConfigFile: path.resolve(
        getDirname(import.meta.url),
        '../client/clientConfig.js'
      ),
    }
  }
}
