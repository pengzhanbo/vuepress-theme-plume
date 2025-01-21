/**
 * 多语言预设
 * 除 /zh/ 、 /en/ 外，其它语言预设通过 AI 生成，不保证准确
 * 如有错误，欢迎提 issue
 */
import type { DefaultLocaleInfo } from '@vuepress/helper'
import type { SearchLocaleOptions } from '../../shared/index.js'
import { deSearchLocale } from './de.js'
import { enSearchLocale } from './en.js'
import { frSearchLocale } from './fr.js'
import { jaSearchLocale } from './ja.js'
import { ruSearchLocale } from './ru.js'
import { zhTwSearchLocale } from './zh-tw.js'
import { zhSearchLocale } from './zh.js'

export const SEARCH_LOCALES: DefaultLocaleInfo<Partial<SearchLocaleOptions>> = [
  [['en', 'en-US'], enSearchLocale],
  [['zh', 'zh-CN', 'zh-Hans', 'zh-Hant'], zhSearchLocale],
  [['zh-TW'], zhTwSearchLocale],
  [['de', 'de-DE'], deSearchLocale],
  [['fr', 'fr-FR'], frSearchLocale],
  [['ru', 'ru-RU'], ruSearchLocale],
  [['ja', 'ja-JP'], jaSearchLocale],
]
