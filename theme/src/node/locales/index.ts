/**
 * 多语言预设
 * 除 /zh/ 、 /en/ 外，其它语言预设通过 AI 生成，不保证准确
 * 如有错误，欢迎提 issue
 */
import type { DefaultLocaleInfo } from '@vuepress/helper'
import type { PresetLocale, ThemeLocaleText } from '../../shared/index.js'
import { deLocale, dePresetLocale } from './de.js'
import { enLocale, enPresetLocale } from './en.js'
import { frLocale, frPresetLocale } from './fr.js'
import { jaLocale, jaPresetLocale } from './ja.js'
import { ruLocale, ruPresetLocale } from './ru.js'
import { zhTwLocale, zhTwPresetLocale } from './zh-tw.js'
import { zhLocale, zhPresetLocale } from './zh.js'

export const LOCALE_OPTIONS: DefaultLocaleInfo<ThemeLocaleText> = [
  [['en', 'en-US'], enLocale],
  [['zh', 'zh-CN', 'zh-Hans', 'zh-Hant'], zhLocale],
  [['zh-TW'], zhTwLocale],
  [['de', 'de-DE'], deLocale],
  [['fr', 'fr-FR'], frLocale],
  [['ru', 'ru-RU'], ruLocale],
  [['ja', 'ja-JP'], jaLocale],
]

export const PRESET_LOCALES: DefaultLocaleInfo<PresetLocale> = [
  [['en', 'en-US'], enPresetLocale],
  [['zh', 'zh-CN', 'zh-Hans', 'zh-Hant'], zhPresetLocale],
  [['zh-TW'], zhTwPresetLocale],
  [['de', 'de-DE'], dePresetLocale],
  [['fr', 'fr-FR'], frPresetLocale],
  [['ru', 'ru-RU'], ruPresetLocale],
  [['ja', 'ja-JP'], jaPresetLocale],
]
