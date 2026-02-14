import type { Langs, Locale } from './types.js'
import { locales } from './locales/index.js'

interface Translate {
  setLang: (lang: Langs) => void
  t: (key: keyof Locale) => string
}

/**
 * Create a translate instance with specified language
 *
 * 创建指定语言的翻译实例
 *
 * @param lang - Language code / 语言代码
 * @returns Translate interface / 翻译接口
 */
function createTranslate(lang?: Langs): Translate {
  let current: Langs = lang || 'en-US'

  return {
    setLang: (lang) => {
      current = lang
    },
    t: key => locales[current][key],
  }
}

const translate = createTranslate()

/**
 * Get translated string by key
 *
 * 根据键获取翻译后的字符串
 *
 * @param key - Locale key / 本地化键名
 * @returns Translated string / 翻译后的字符串
 */
export const t: Translate['t'] = translate.t

/**
 * Set current language
 *
 * 设置当前语言
 *
 * @param lang - Language code to set / 要设置的语言代码
 */
export const setLang: Translate['setLang'] = translate.setLang
