import type { PluginObject } from '@vuepress/core'
// import { seoPlugin } from 'vuepress-plugin-seo2'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'

export const resolveSeo = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): PluginObject | false => {
  if (plugins.sitemap === false || !localeOptions.hostname) return false
  // return seoPlugin({
  //   hostname: localeOptions.hostname,
  //   author: localeOptions.avatar?.name,
  // })
  return false
}
