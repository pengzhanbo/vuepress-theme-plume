import type { PluginConfig } from '@vuepress/core'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'
import { resolveActiveHeaderLink } from './activeHeaderLink'
import { resolveBaiduTongji } from './baiduTongji'
import { resolveCanIUse } from './caniuse'
import { resolveComment } from './comment'
import { resolveCopyCode } from './copyCode'
import { resolveExternalLinkIconPlugin } from './externalLinkIcon'
import { resolveGit } from './git'
import { resolveMarkdownEnhance } from './markdownEnhance'
import { resolveMediumZoom } from './mediumZoom'
import { resolveNprogress } from './nprogress'
import { resolvePalette } from './palette'
import { resolvePrismjs } from './prismjs'
import { resolveSearch } from './search'
import { resolveSeo } from './seo'
import { resolveSitemap } from './sitemap'
import { resolveThemeData } from './themeData'

export const getPlugins = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): PluginConfig => {
  const resolvePlugins: PluginConfig = [
    resolvePalette(),
    resolveActiveHeaderLink(),
    resolveNprogress(plugins),
    resolveMediumZoom(plugins),
    resolveCanIUse(plugins),
    resolveExternalLinkIconPlugin(plugins, localeOptions),
    resolveSearch(plugins),
    resolvePrismjs(plugins),
    resolveGit(plugins),
    resolveCopyCode(plugins),
    resolveMarkdownEnhance(plugins),
    resolveComment(plugins),
    resolveSitemap(plugins, localeOptions),
    resolveSeo(plugins, localeOptions),
    resolveThemeData(localeOptions),
    resolveBaiduTongji(plugins),
  ]
  return resolvePlugins
}
