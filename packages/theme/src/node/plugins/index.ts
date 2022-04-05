import type { App, PluginConfig, PluginOptions } from '@vuepress/core'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'
import { resolveCanIUse } from './caniuse'
import { resolveExternalLinkIconPlugin } from './externalLinkIcon'
import { resolveMediumZoom } from './mediumZoom'
import { resolveNprogress } from './nprogress'
import { resolvePrismjs } from './prismjs'
import { resolveSearch } from './search'
import { resolveThemeData } from './themeData'
import { resolveToc } from './toc'

export const getPlugins = (
  app: App,
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): PluginConfig<PluginOptions>[] => {
  return [
    resolveNprogress(plugins),
    resolveMediumZoom(plugins),
    resolveToc(plugins),
    resolveCanIUse(plugins.caniuse || false),
    resolveExternalLinkIconPlugin(plugins.externalLinkIcon, localeOptions),
    resolveSearch(plugins),
    resolvePrismjs(plugins),
    resolveThemeData(localeOptions),
  ].filter((item) => item[1] !== false)
}
