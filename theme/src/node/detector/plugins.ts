import type { ThemeBuiltinPlugins } from '../../shared/index.js'
import { colors } from 'vuepress/utils'
import { logger } from '../utils/index.js'
import { PLUGINS_SUPPORTED_FIELDS } from './fields.js'

export function detectPlugins(plugins: ThemeBuiltinPlugins) {
  // 部分用户可能混淆 plugins 选项与 vuepress 的 plugins 选项，误传入插件数组
  if (Array.isArray(plugins)) {
    logger.warn(`${colors.green('plugins')} only accept object config, please check your config.`)
  }

  const unsupportedPluginsFields = Object.keys(plugins).filter(field => !PLUGINS_SUPPORTED_FIELDS.includes(field as keyof ThemeBuiltinPlugins))

  // 传入未知的 插件配置项
  if (unsupportedPluginsFields.length) {
    logger.warn(`${colors.green('plugins')} unsupported fields: ${unsupportedPluginsFields.map(field => colors.yellow(`"${field}"`)).join(', ')}, please check your config.`)
  }
}
