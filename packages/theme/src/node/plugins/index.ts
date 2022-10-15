import type { PluginConfig } from '@vuepress/core'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared/index.js'
import { resolveActiveHeaderLink } from './activeHeaderLink.js'
import { resolveBaiduTongji } from './baiduTongji.js'
import { resolveCanIUse } from './caniuse.js'
import { resolveComment } from './comment.js'
import { resolveCopyCode } from './copyCode.js'
import { resolveExternalLinkIconPlugin } from './externalLinkIcon.js'
import { resolveGit } from './git.js'
import { resolveMarkdownEnhance } from './markdownEnhance.js'
import { resolveMediumZoom } from './mediumZoom.js'
import { resolveNprogress } from './nprogress.js'
import { resolvePalette } from './palette.js'
import { resolvePrismjs } from './prismjs.js'
import { resolveSearch } from './search.js'
import { resolveSeo } from './seo.js'
import { resolveSitemap } from './sitemap.js'
import { resolveThemeData } from './themeData.js'

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
