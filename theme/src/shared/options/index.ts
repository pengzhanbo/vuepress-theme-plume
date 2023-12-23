import type { ThemeData } from '@vuepress/plugin-theme-data'
import type { PlumeThemeLocaleData } from './locale.js'
import type { PlumeThemePluginOptions } from './plugins.js'

export interface PlumeThemeOptions extends PlumeThemeLocaleOptions {
  /**
   * 对主题内部使用的插件进行配置
   */
  themePlugins?: PlumeThemePluginOptions
}

export type PlumeThemeLocaleOptions = PlumeThemeData

export type PlumeThemeData = ThemeData<PlumeThemeLocaleData>

export * from './locale.js'
export * from './plugins.js'
export * from './navbar.js'
