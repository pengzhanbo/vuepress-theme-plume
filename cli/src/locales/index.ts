import { en } from './en.js'
import { zh } from './zh.js'
import type { Langs, Locale } from '../types.js'

export const locales: Record<Langs, Locale> = {
  'zh-CN': zh,
  'en-US': en,
}
