import type { Plugin } from '@vuepress/core'
import { seoPlugin } from 'vuepress-plugin-seo2'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared/index.js'

const isProd = process.env.NODE_ENV === 'production'

export const resolveSeo = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): Plugin => {
  if (plugins.sitemap === false || !localeOptions.hostname || !isProd)
    return [] as unknown as Plugin
  return seoPlugin({
    hostname: localeOptions.hostname || '',
    author: localeOptions.avatar?.name,
  })
}
