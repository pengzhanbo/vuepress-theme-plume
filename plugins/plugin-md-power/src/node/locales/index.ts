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
