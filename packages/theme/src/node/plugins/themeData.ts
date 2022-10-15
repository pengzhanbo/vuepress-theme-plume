import type { PluginObject } from '@vuepress/core'
import { themeDataPlugin } from '@vuepress/plugin-theme-data'
import type { PlumeThemeLocaleOptions } from '../../shared/index.js'
export const resolveThemeData = (
  localeOptions: PlumeThemeLocaleOptions
): PluginObject => {
  return themeDataPlugin({ themeData: localeOptions })
}
