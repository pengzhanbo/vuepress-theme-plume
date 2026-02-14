import type { LocaleData } from 'vuepress'
import type { EncryptSnippetLocale } from './encrypt'

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
