import type { App, LocaleConfig } from 'vuepress'
import type { MarkdownPowerPluginOptions } from '../shared/index.js'
import type { MDPowerLocaleData } from '../shared/locale.js'
import { getFullLocaleConfig } from '@vuepress/helper'
import { isPackageExists } from 'local-pkg'
import { LOCALE_OPTIONS } from './locales/index.js'

export function provideData(app: App, options: MarkdownPowerPluginOptions): Record<string, unknown> {
  const markdownOptions = {
    plot: options.plot,
    pdf: options.pdf,
  }

  const locales = getFullLocaleConfig({
    app,
    name: 'vuepress-plugin-md-power',
    default: LOCALE_OPTIONS,
    config: options.locales,
  })
  const icon = options.icon ?? { provider: 'iconify' }

  return {
    __MD_POWER_INJECT_OPTIONS__: markdownOptions,
    __MD_POWER_DASHJS_INSTALLED__: isPackageExists('dashjs'),
    __MD_POWER_HLSJS_INSTALLED__: isPackageExists('hls.js'),
    __MD_POWER_MPEGTSJS_INSTALLED__: isPackageExists('mpegts.js'),
    __MD_POWER_ICON_PROVIDER__: icon.provider || 'iconify',
    __MD_POWER_ICON_PREFIX__: icon.prefix || '',
    __MD_POWER_ENCRYPT_LOCALES__: options.encrypt ? findLocales(locales, 'encrypt') : {},
  }
}

function findLocales<
  T extends MDPowerLocaleData,
  K extends keyof T,
>(locales: LocaleConfig<T>, key: K): Record<string, T[K]> {
  const res: Record<string, T[K]> = {}

  for (const [locale, value] of Object.entries(locales)) {
    res[locale] = value[key] ?? {} as T[K]
  }

  return res
}
