import type { PluginConfig } from '@vuepress/core'
import { sitemap } from 'vuepress-plugin-sitemap2'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'

export const resolveSitemap = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): PluginConfig => {
  if (plugins.sitemap === false || !localeOptions.hostname) return ['', false]
  return sitemap({
    hostname: localeOptions.hostname,
  })
}
