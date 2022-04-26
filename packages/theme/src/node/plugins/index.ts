import type { PluginConfig, PluginObject } from '@vuepress/core'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'
import { resolveActiveHeaderLink } from './activeHeaderLink'
import { resolveCanIUse } from './caniuse'
// import { resolveComment } from './comment'
// import { resolveCopyCode } from './copyCode'
import { resolveExternalLinkIconPlugin } from './externalLinkIcon'
// import { resolveMarkdownEnhance } from './markdownEnhance'
import { resolveMediumZoom } from './mediumZoom'
import { resolveNprogress } from './nprogress'
import { resolvePalette } from './palette'
import { resolvePrismjs } from './prismjs'
// import { resolveSearch } from './search'
// import { resolveSeo } from './seo'
// import { resolveSitemap } from './sitemap'
import { resolveThemeData } from './themeData'

export const getPlugins = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): PluginConfig => {
  const resolvePlugins: (PluginObject | false)[] = [
    resolveActiveHeaderLink(),
    resolvePalette(),
    resolveNprogress(plugins),
    resolveMediumZoom(plugins),
    resolveCanIUse(plugins),
    resolveExternalLinkIconPlugin(plugins, localeOptions),
    // resolveSearch(plugins),
    resolvePrismjs(plugins),
    // resolveCopyCode(plugins),
    // resolveMarkdownEnhance(plugins),
    // resolveComment(plugins),
    // resolveSitemap(plugins, localeOptions),
    // resolveSeo(plugins, localeOptions),
    resolveThemeData(localeOptions),
  ]
  return resolvePlugins.filter((plugin) => plugin) as PluginObject[]
}
