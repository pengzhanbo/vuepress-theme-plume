import { caniusePlugin } from '@vuepress-plume/vuepress-plugin-caniuse'
import type { Plugin } from '@vuepress/core'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveCanIUse = (plugins: PlumeThemePluginOptions): Plugin => {
  if (plugins.caniuse === false) return [] as unknown as Plugin
  return caniusePlugin(
    plugins.caniuse || {
      mode: 'embed',
    }
  )
}
