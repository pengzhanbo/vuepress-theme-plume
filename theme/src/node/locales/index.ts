import type { DocsearchLocaleOptions } from '@vuepress/plugin-docsearch'
import type { SearchLocaleOptions } from '@vuepress-plume/plugin-search'
import type { PlumeThemeLocaleData, PresetLocale } from '../../shared/index.js'
import { enLocale, enPresetLocale, enSearchLocale } from './en.js'
import { zhDocsearchLocale, zhLocale, zhPresetLocale, zhSearchLocale } from './zh.js'

export const LOCALE_OPTIONS: Record<string, PlumeThemeLocaleData> = {
  '/zh/': zhLocale,
  '/en/': enLocale,
}

export const PRESET_LOCALES: Record<string, PresetLocale> = {
  '/zh/': zhPresetLocale,
  '/en/': enPresetLocale,
}

export const DOCSEARCH_LOCALES: Record<string, DocsearchLocaleOptions> = {
  '/zh/': zhDocsearchLocale,
}

export const SEARCH_LOCALES: Record<string, Partial<SearchLocaleOptions>> = {
  '/zh/': zhSearchLocale,
  '/en/': enSearchLocale,
}
