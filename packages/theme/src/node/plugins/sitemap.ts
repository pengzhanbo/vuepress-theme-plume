import type { PluginObject } from '@vuepress/core'
// import { sitemapPlugin } from 'vuepress-plugin-sitemap2'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'

export const resolveSitemap = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): PluginObject | false => {
  if (plugins.sitemap === false || !localeOptions.hostname) return false
  // return sitemapPlugin({
  //   hostname: localeOptions.hostname,
  // })
  return false
}
