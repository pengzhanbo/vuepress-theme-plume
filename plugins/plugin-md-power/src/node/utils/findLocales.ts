import type { LocaleConfig } from 'vuepress'
import type { MDPowerLocaleData } from '../../shared/index.js'

/**
 * Find locale configurations for a specific key
 *
 * 查找特定键的本地化配置
 *
 * @param locales - Locale configuration / 本地化配置
 * @param key - Key to find / 要查找的键
 * @returns Record of locale paths to locale data / 本地化路径到本地化数据的记录
 */
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
