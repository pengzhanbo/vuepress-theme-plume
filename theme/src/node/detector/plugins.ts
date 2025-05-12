import type { ThemeBuiltinPlugins } from '../../shared/index.js'
import { colors } from 'vuepress/utils'
import { createTranslate, logger } from '../utils/index.js'
import { PLUGINS_SUPPORTED_FIELDS } from './fields.js'

const t = createTranslate({
  en: { message: '{{ plugins }} unsupported fields: {{ unsupported }}, please check your config.' },
  zh: { message: '{{ plugins }} 不支持以下字段: {{ unsupported }}, 请检查你的配置。' },
})

export function detectPlugins(plugins: ThemeBuiltinPlugins): void {
  // 部分用户可能混淆 plugins 选项与 vuepress 的 plugins 选项，误传入插件数组
  if (Array.isArray(plugins)) {
    logger.warn(`${colors.green('plugins')} only accept object config, please check your config.`)
  }

  const unsupportedPluginsFields = Object.keys(plugins).filter(field => !PLUGINS_SUPPORTED_FIELDS.includes(field as keyof ThemeBuiltinPlugins))

  // 传入未知的 插件配置项
  if (unsupportedPluginsFields.length) {
    logger.warn(t('message', {
      plugins: colors.green('plugins'),
      unsupported: unsupportedPluginsFields.map(field => colors.magenta(`"${field}"`)).join(', '),
    }))
  }
}
