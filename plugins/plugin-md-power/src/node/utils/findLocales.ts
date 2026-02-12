import type { LocaleConfig } from 'vuepress'
import type { MDPowerLocaleData } from '../../shared/index.js'

export function findLocales<
  T extends MDPowerLocaleData,
  K extends keyof T,
>(locales: LocaleConfig<T>, key: K): Record<string, T[K]> {
  const res: Record<string, T[K]> = {}

  for (const [locale, value] of Object.entries(locales)) {
    res[locale] = value[key] ?? {} as T[K]
  }

  return res
}
