import type { ExactLocaleConfig } from '@vuepress/helper'
import type { MarkdownPowerPluginOptions, MDPowerLocaleData } from '../shared/index.js'
import { isPackageExists } from 'local-pkg'
import { findLocales } from './utils/findLocales.js'

/**
 * Provide data to be injected into the client-side application.
 *
 * 提供要注入到客户端应用的数据。
 *
 * This function creates a record of data that will be defined as global constants
 * in the client bundle, allowing the client to access plugin configuration and
 * runtime information.
 *
 * 该函数创建一个数据记录，将作为全局常量定义在客户端包中，
 * 允许客户端访问插件配置和运行时信息。
 *
 * @param options - Plugin options / 插件配置选项
 * @param locales - Locale configuration / 本地化配置
 * @returns Record of data to be defined / 要定义的数据记录
 *
 * @example
 * ```ts
 * const data = provideData(options, locales)
 * // Returns:
 * // {
 * //   __MD_POWER_INJECT_OPTIONS__: { plot: true, pdf: true },
 * //   __MD_POWER_DASHJS_INSTALLED__: true,
 * //   __MD_POWER_HLSJS_INSTALLED__: false,
 * //   ...
 * // }
 * ```
 */
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
