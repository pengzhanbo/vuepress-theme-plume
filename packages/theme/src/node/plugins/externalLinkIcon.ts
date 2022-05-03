import type { Plugin } from '@vuepress/core'
import { externalLinkIconPlugin } from '@vuepress/plugin-external-link-icon'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'

export const resolveExternalLinkIconPlugin = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): Plugin => {
  if (plugins.externalLinkIcon === false) return [] as unknown as Plugin
  return externalLinkIconPlugin({
    locales: Object.entries(localeOptions.locales || {}).reduce(
      (result, [key, value]) => {
        result[key] = {
          openInNewWindow:
            value.openInNewWindow ?? localeOptions.openInNewWindow,
        }
        return result
      },
      {}
    ),
  })
}
