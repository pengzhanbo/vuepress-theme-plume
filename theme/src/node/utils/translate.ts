/**
 * 简单的内置 中 / 英 翻译转换工具，
 * 用于在需要 Log 的场景，根据 app.lang 设置输出语言
 */

import { isEmptyObject } from '@pengzhanbo/utils'

type TranslateLang = 'zh' | 'en'
type TranslateLocale = Record<string, string>

let lang = 'en'

export function setTranslateLang(current: string) {
  if (['zh-CN', 'zh', 'zh-Hans', 'zh-Hant'].includes(current)) {
    lang = 'zh'
  }
  else {
    lang = 'en'
  }
}

export function createTranslate<Locale extends TranslateLocale = TranslateLocale>(
  locales: Record<TranslateLang, Locale>,
) {
  return function t(key: keyof Locale, data?: Record<string, string>) {
    const resolved = locales[lang][key]
    if (!resolved)
      return key
    if (data && !isEmptyObject(data)) {
      return resolved.replace(/\{\{\s*(\w+)\s*\}\}/g, (_: string, key: string) => data[key] || _)
    }
    return resolved
  }
}
