import type { Langs, Locale } from '../types.js'
import { en } from './en.js'
import { zh } from './zh.js'

/**
 * Locale configurations for different languages.
 *
 * 不同语言的本地化配置。
 *
 * Maps language codes to their respective locale strings.
 *
 * 将语言代码映射到相应的本地化字符串。
 */
export const locales: Record<Langs, Locale> = {
  'zh-CN': zh,
  'en-US': en,
}
