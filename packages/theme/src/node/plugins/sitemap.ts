import type { Plugin } from '@vuepress/core'
import { sitemapPlugin } from 'vuepress-plugin-sitemap2'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'

const isProd = process.env.NODE_ENV === 'production'

export const resolveSitemap = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): Plugin => {
  if (plugins.sitemap === false || !localeOptions.hostname || !isProd)
    return [] as unknown as Plugin
  return sitemapPlugin({
    hostname: localeOptions.hostname,
  })
}
