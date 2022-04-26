import type { PluginObject } from '@vuepress/core'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveNprogress = (
  plugins: PlumeThemePluginOptions
): PluginObject | false => {
  if (plugins.nprogress === false) return false
  return nprogressPlugin()
}
