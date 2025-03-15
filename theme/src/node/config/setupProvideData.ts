import type { App } from 'vuepress'
import type { ThemeBuiltinPlugins } from '../../shared/index.js'
import { getFullLocaleConfig, isPlainObject } from '@vuepress/helper'
import { getThemeConfig } from '../loadConfig/index.js'
import { PRESET_LOCALES } from '../locales/index.js'

export function setupProvideData(
  app: App,
  plugins: ThemeBuiltinPlugins,
): Record<string, any> {
  const options = getThemeConfig()
  const watermark = options.watermark ?? plugins.watermark
  return {
    // 注入水印配置
    __PLUME_WM_FP__: isPlainObject(watermark)
      ? watermark.fullPage !== false
      : true,
    // 注入多语言配置
    __PLUME_PRESET_LOCALE__: getFullLocaleConfig({
      app,
      name: 'vuepress-theme-plume/preset-locales',
      default: PRESET_LOCALES,
    }),
  }
}
