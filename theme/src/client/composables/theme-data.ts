import {
  useThemeData as _useThemeData,
  useThemeLocaleData as _useThemeLocaleData,
} from '@vuepress/plugin-theme-data/client'
import type {
  ThemeDataRef,
  ThemeLocaleDataRef,
} from '@vuepress/plugin-theme-data/client'
import type { PlumeThemeData } from '../../shared/index.js'

export function useThemeData(): ThemeDataRef<PlumeThemeData> {
  return _useThemeData<PlumeThemeData>()
}
export function useThemeLocaleData(): ThemeLocaleDataRef<PlumeThemeData> {
  return _useThemeLocaleData<PlumeThemeData>()
}
