import type { PluginConfig } from '@vuepress/core'
import type { ExternalLinkIconPluginOptions } from '@vuepress/plugin-external-link-icon'
import type { PlumeThemeLocaleOptions } from '../../shared'

export const resolveExternalLinkIconPlugin = (
  enabled: boolean | undefined,
  localeOptions: PlumeThemeLocaleOptions
): PluginConfig => {
  if (enabled === false) return ['', false]
  return [
    '@vuepress/plugin-external-link-icon',
    {
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
    } as ExternalLinkIconPluginOptions,
  ]
}
