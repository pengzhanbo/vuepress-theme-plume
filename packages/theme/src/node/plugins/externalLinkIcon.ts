import type { PluginObject } from '@vuepress/core'
import { externalLinkIconPlugin } from '@vuepress/plugin-external-link-icon'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../../shared'

export const resolveExternalLinkIconPlugin = (
  plugins: PlumeThemePluginOptions,
  localeOptions: PlumeThemeLocaleOptions
): PluginObject | false => {
  if (plugins.externalLinkIcon === false) return false
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
