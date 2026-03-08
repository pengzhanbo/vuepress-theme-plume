import type { DefaultLocaleInfo } from '@vuepress/helper'
import type { MDPowerLocaleData } from '../../shared/locale'
import { deLocale } from './de'
import { enLocale } from './en'
import { frLocale } from './fr'
import { jaLocale } from './ja'
import { koLocale } from './ko'
import { ruLocale } from './ru'
import { zhLocale } from './zh'
import { zhTWLocale } from './zh-tw'

/**
 * Default locale options for the plugin.
 *
 * 插件的默认本地化选项。
 *
 * This constant defines the default locale configurations for all supported languages.
 * Each locale entry maps language codes to their respective locale data.
 *
 * 该常量定义了所有支持语言的默认本地化配置。
 * 每个本地化条目将语言代码映射到其相应的本地化数据。
 */
export const LOCALE_OPTIONS: DefaultLocaleInfo<MDPowerLocaleData> = [
  [['en', 'en-US'], enLocale],
  [['zh', 'zh-CN', 'zh-Hans', 'zh-Hant'], zhLocale],
  [['zh-TW'], zhTWLocale],
  [['de', 'de-DE'], deLocale],
  [['fr', 'fr-FR'], frLocale],
  [['ru', 'ru-RU'], ruLocale],
  [['ja', 'ja-JP'], jaLocale],
  [['ko', 'ko-KR'], koLocale],
]
