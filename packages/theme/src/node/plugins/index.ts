import type { App, PluginConfig, PluginOptions } from '@vuepress/core'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'
import { resolveActiveHeaderLink } from './activeHeaderLink'
import { resolveCanIUse } from './caniuse'
import { resolveCopyCode } from './copyCode'
import { resolveExternalLinkIconPlugin } from './externalLinkIcon'
import { resolveMarkdownEnhance } from './markdownEnhance'
import { resolveMediumZoom } from './mediumZoom'
import { resolveNprogress } from './nprogress'
import { resolvePalette } from './palette'
import { resolvePrismjs } from './prismjs'
import { resolveSearch } from './search'
import { resolveThemeData } from './themeData'

export const getPlugins = (
  app: App,
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): PluginConfig<PluginOptions>[] => {
  return [
    resolveActiveHeaderLink(),
    resolvePalette(),
    resolveNprogress(plugins),
    resolveMediumZoom(plugins),
    resolveCanIUse(plugins),
    resolveExternalLinkIconPlugin(plugins, localeOptions),
    resolveSearch(plugins),
    resolvePrismjs(plugins),
    resolveCopyCode(plugins),
    resolveMarkdownEnhance(plugins),
    resolveThemeData(localeOptions),
  ].filter((item) => item[1] !== false)
}
