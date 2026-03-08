/**
 * Simple built-in Chinese/English translation utility.
 * Used for log output based on app.lang settings.
 *
 * 简单的内置中/英翻译转换工具。
 * 用于在需要日志输出的场景，根据 app.lang 设置输出语言。
 */

import { isEmptyObject } from '@pengzhanbo/utils'

type TranslateLang = 'zh' | 'en'
type TranslateLocale = Record<string, string>
type TranslateData = Record<string, string>

let lang: TranslateLang = 'en'

/**
 * Set the translation language based on the current locale.
 * Supports Chinese variants (zh-CN, zh, zh-Hans, zh-Hant) and defaults to English.
 *
 * 根据当前区域设置翻译语言。
 * 支持中文变体（zh-CN、zh、zh-Hans、zh-Hant），默认为英文。
 *
 * @param current - Current locale string / 当前区域设置字符串
 */
export function setTranslateLang(current: string): void {
  if (['zh-CN', 'zh', 'zh-Hans', 'zh-Hant'].includes(current)) {
    lang = 'zh'
  }
  else {
    lang = 'en'
  }
}

/**
 * Create a translation function with locale support.
 * Returns a function that translates keys to localized strings with optional interpolation.
 *
 * 创建支持本地化的翻译函数。
 * 返回一个将键翻译为本地化字符串的函数，支持可选的插值。
 *
 * @template Data - Data type for interpolation / 插值数据类型
 * @template Locale - Locale type for translations / 翻译区域类型
 * @param locales - Locale data for each language / 每种语言的区域数据
 * @returns Translation function / 翻译函数
 * @example
 * const t = createTranslate({
 *   zh: { hello: '你好，{{name}}！' },
 *   en: { hello: 'Hello, {{name}}!' }
 * })
 * t('hello', { name: 'World' }) // '你好，World！' or 'Hello, World!'
 */
export function createTranslate<
  Data extends TranslateData = TranslateData,
  Locale extends TranslateLocale = TranslateLocale,
>(
  locales: Record<TranslateLang, Locale>,
): (key: keyof Locale, data?: Data) => string {
  return function t(key, data) {
    const resolved = locales[lang][key]
    if (!resolved)
      return String(key)
    if (data && !isEmptyObject(data)) {
      return resolved.replace(/\{\{\s*(\w+)\s*\}\}/g, (_: string, key: string) => data[key] || _)
    }
    return resolved
  }
}
