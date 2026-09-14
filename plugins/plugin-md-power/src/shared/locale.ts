import type { LocaleData } from 'vuepress'
import type { EncryptSnippetLocale } from './encrypt.js'
import type { FieldLocaleData } from './field.js'
import type { ObsidianLocaleData } from './obsidian.js'

/**
 * Markdown Power Plugin Locale Data
 *
 * Markdown Power 插件本地化数据
 */
export interface MDPowerLocaleData extends LocaleData {
  /**
   * Common locale data
   *
   * 通用本地化数据
   */
  common?: CommonLocaleData
  /**
   * Encrypt snippet locale data
   *
   * 加密片段本地化数据
   */
  encrypt?: EncryptSnippetLocale
  /**
   * Obsidian locale data
   *
   * Obsidian 本地化数据
   */
  obsidian?: ObsidianLocaleData

  /**
   * Field locale data
   *
   * 字段容器本地化数据
   */
  field?: FieldLocaleData
}

/**
 * Common Locale Data
 *
 * 通用本地化数据
 */
export interface CommonLocaleData extends LocaleData {
  /**
   * Copy button text
   *
   * 复制按钮文本
   */
  copy?: string
  /**
   * Copied button text
   *
   * 已复制按钮文本
   */
  copied?: string
}
