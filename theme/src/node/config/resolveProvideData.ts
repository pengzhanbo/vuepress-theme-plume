import type { App } from 'vuepress'
import type { PlumeThemePluginOptions } from '../../shared/index.js'
import { entries, fromEntries, getLocalePaths, inferRootLocalePath, isPlainObject } from '@vuepress/helper'
import { PRESET_LOCALES } from '../locales/index.js'

export function resolveProvideData(
  app: App,
  plugins: PlumeThemePluginOptions,
): Record<string, any> {
  const root = inferRootLocalePath(app)
  const locales = [...getLocalePaths(app), root]
  return {
    // 注入水印配置
    __PLUME_WM_FP__: isPlainObject(plugins.watermark)
      ? plugins.watermark.fullPage !== false
      : true,
    // 注入多语言配置
    __PLUME_PRESET_LOCALE__: fromEntries(
      entries(PRESET_LOCALES)
        .filter(([locale]) => locales.includes(locale))
        .map(([locale, value]) => [locale === root ? '/' : locale, value]),
    ),
  }
}
