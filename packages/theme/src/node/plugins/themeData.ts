import type { PluginConfig } from '@vuepress/core'
import type { PlumeThemeLocaleOptions } from '../../shared'

export const resolveThemeData = (
  localeOptions: PlumeThemeLocaleOptions
): PluginConfig => {
  return ['@vuepress/theme-data', { themeData: localeOptions }]
}
