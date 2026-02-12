import type { ExactLocaleConfig } from '@vuepress/helper'
import type { MarkdownPowerPluginOptions, MDPowerLocaleData } from '../shared/index.js'
import { isPackageExists } from 'local-pkg'
import { findLocales } from './utils/findLocales.js'

export function provideData(
  options: MarkdownPowerPluginOptions,
  locales: ExactLocaleConfig<MDPowerLocaleData>,
): Record<string, unknown> {
  const markdownOptions = {
    plot: options.plot,
    pdf: options.pdf,
  }

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
