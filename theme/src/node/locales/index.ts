/**
 * 多语言预设
 * 除 /zh/ 、 /en/ 外，其它语言预设通过 AI 生成，不保证准确
 * 如有错误，欢迎提 issue
 */
import type { SearchLocaleOptions } from '@vuepress-plume/plugin-search'
import type { DocSearchLocaleOptions } from '@vuepress/plugin-docsearch'
import type { PlumeThemeLocaleData, PresetLocale } from '../../shared/index.js'
import { deDocsearchLocale, deLocale, dePresetLocale, deSearchLocale } from './de.js'
import { enLocale, enPresetLocale, enSearchLocale } from './en.js'
import { frDocsearchLocale, frLocale, frPresetLocale, frSearchLocale } from './fr.js'
import { jaDocsearchLocale, jaLocale, jaPresetLocale, jaSearchLocale } from './ja.js'
import { ruDocsearchLocale, ruLocale, ruPresetLocale, ruSearchLocale } from './ru.js'
import { zhTwDocsearchLocale, zhTwLocale, zhTwPresetLocale, zhTwSearchLocale } from './zh-tw.js'
import { zhDocsearchLocale, zhLocale, zhPresetLocale, zhSearchLocale } from './zh.js'

export const LOCALE_OPTIONS: Record<string, PlumeThemeLocaleData> = {
  '/zh/': zhLocale,
  '/en/': enLocale,
  '/zh-tw/': zhTwLocale,
  '/de/': deLocale,
  '/fr/': frLocale,
  '/ru/': ruLocale,
  '/ja/': jaLocale,
}

export const PRESET_LOCALES: Record<string, PresetLocale> = {
  '/zh/': zhPresetLocale,
  '/en/': enPresetLocale,
  '/zh-tw/': zhTwPresetLocale,
  '/de/': dePresetLocale,
  '/fr/': frPresetLocale,
  '/ru/': ruPresetLocale,
  '/ja/': jaPresetLocale,
}

export const DOCSEARCH_LOCALES: Record<string, DocSearchLocaleOptions> = {
  '/zh/': zhDocsearchLocale,
  '/zh-tw/': zhTwDocsearchLocale,
  '/de/': deDocsearchLocale,
  '/fr/': frDocsearchLocale,
  '/ru/': ruDocsearchLocale,
  '/ja/': jaDocsearchLocale,
}

export const SEARCH_LOCALES: Record<string, Partial<SearchLocaleOptions>> = {
  '/zh/': zhSearchLocale,
  '/en/': enSearchLocale,
  '/zh-tw/': zhTwSearchLocale,
  '/de/': deSearchLocale,
  '/fr/': frSearchLocale,
  '/ru/': ruSearchLocale,
  '/ja/': jaSearchLocale,
}
