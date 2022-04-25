import type { PluginConfig } from '@vuepress/core'
import { seo } from 'vuepress-plugin-seo2'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'

export const resolveSeo = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): PluginConfig => {
  if (plugins.sitemap === false || !localeOptions.hostname) return ['', false]
  return seo({
    hostname: localeOptions.hostname,
    author: localeOptions.avatar?.name,
  })
}
