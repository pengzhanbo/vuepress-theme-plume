import { isEmptyObject } from '@pengzhanbo/utils'
import type { App } from 'vuepress/core'
import type { PlumeThemeLocaleOptions } from '../shared/index.js'
import { normalizePath } from './utils.js'

export function resolveLocaleOptions<
  T extends PlumeThemeLocaleOptions = PlumeThemeLocaleOptions,
  K extends Exclude<keyof T, 'locales'> = Exclude<keyof T, 'locales'>,
>(options: T, key: K, locale = '', fallback = true): T[K] | undefined {
  const locales = options.locales

  if (!locales)
    return options[key]

  locale = !locale || locale === '/' ? '/' : normalizePath(`/${locale}/`)

  const localeOptions = locales[locale]
  const fallbackLocaleOptions = locales['/']
  if (!localeOptions)
    return fallback ? options[key] : undefined

  const _key = key as keyof typeof localeOptions
  const fallbackData = (fallbackLocaleOptions[_key] ?? options[key]) as T[K]

  const value = localeOptions[_key] as T[K]

  return value ?? (fallback ? fallbackData : undefined)
}

export function resolvedAppLocales(app: App): NonNullable<App['siteData']['locales']> {
  if (app.siteData.locales && !isEmptyObject(app.siteData.locales))
    return app.siteData.locales

  const defaultLang = app.siteData.lang || 'en-US'
  return { '/': { lang: defaultLang } }
}
