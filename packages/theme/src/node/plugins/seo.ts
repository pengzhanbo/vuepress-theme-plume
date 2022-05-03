import type { App, Plugin } from '@vuepress/core'
import { seoPlugin } from 'vuepress-plugin-seo2'
import type { SeoOptions } from 'vuepress-plugin-seo2'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'

type PluginFunc = (options: SeoOptions, app: App) => Plugin

export const resolveSeo = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): Plugin => {
  if (plugins.sitemap === false || !localeOptions.hostname)
    return [] as unknown as Plugin
  return (app: App) => {
    ;(seoPlugin as unknown as PluginFunc)(
      {
        hostname: localeOptions.hostname || '',
        author: localeOptions.avatar?.name,
      },
      app
    )
  }
}
