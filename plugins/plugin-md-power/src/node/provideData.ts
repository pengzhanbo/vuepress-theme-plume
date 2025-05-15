import type { MarkdownPowerPluginOptions } from '../shared/index.js'
import { isPackageExists } from 'local-pkg'

export function provideData(options: MarkdownPowerPluginOptions): Record<string, unknown> {
  const mardownOptions = {
    plot: options.plot,
    pdf: options.pdf,
  }
  const icon = options.icon ?? { provider: 'iconify' }

  return {
    __MD_POWER_INJECT_OPTIONS__: mardownOptions,
    __MD_POWER_DASHJS_INSTALLED__: isPackageExists('dashjs'),
    __MD_POWER_HLSJS_INSTALLED__: isPackageExists('hls.js'),
    __MD_POWER_MPEGTSJS_INSTALLED__: isPackageExists('mpegts.js'),
    __MD_POWER_ICON_PROVIDER__: icon.provider || 'iconify',
    __MD_POWER_ICON_PREFIX__: icon.prefix || '',
  }
}
