import type { App } from 'vuepress'
import type { PlumeThemePluginOptions } from '../../shared/index.js'
import { getFullLocaleConfig, isPlainObject } from '@vuepress/helper'
import { PRESET_LOCALES } from '../locales/index.js'

export function resolveProvideData(
  app: App,
  plugins: PlumeThemePluginOptions,
): Record<string, any> {
  return {
    // 注入水印配置
    __PLUME_WM_FP__: isPlainObject(plugins.watermark)
      ? plugins.watermark.fullPage !== false
      : true,
    // 注入多语言配置
    __PLUME_PRESET_LOCALE__: getFullLocaleConfig({
      app,
      name: 'vuepress-theme-plume/preset-locales',
      default: PRESET_LOCALES,
    }),
  }
}
