import { caniusePlugin } from '@vuepress-plume/vuepress-plugin-caniuse'
import type { PluginObject } from '@vuepress/core'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveCanIUse = (
  plugins: PlumeThemePluginOptions
): PluginObject | false => {
  if (plugins.caniuse === false) return false
  return caniusePlugin(
    plugins.caniuse || {
      mode: 'embed',
    }
  )
}
