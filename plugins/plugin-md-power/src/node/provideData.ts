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
 */
export function provideData(
  options: MarkdownPowerPluginOptions,
  locales: ExactLocaleConfig<MDPowerLocaleData>,
): Record<string, unknown> {
  const icon = options.icon ?? { provider: 'iconify' }

  return {
    __MD_POWER_MARK_MODE__: options.mark === 'lazy' ? 'lazy' : 'eager',
    __MD_POWER_PDF__: options.pdf ?? false,
    __MD_POWER_PLOT__: options.plot ?? false,
    __MD_POWER_INSTALLED__: {
      dash: isPackageExists('dashjs'),
      hls: isPackageExists('hls.js'),
      mpegts: isPackageExists('mpegts.js'),
    },
    __MD_POWER_ICON_PROVIDER__: icon.provider || 'iconify',
    __MD_POWER_ICON_PREFIX__: icon.prefix || '',
    __MD_POWER_ENCRYPT_LOCALES__: options.encrypt ? findLocales(locales, 'encrypt') : {},
    __MD_POWER_FIELD_LOCALES__: findLocales(locales, 'field'),
  }
}
