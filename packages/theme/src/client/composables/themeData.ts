import {
  useThemeData as _useThemeData,
  useThemeLocaleData as _useThemeLocaleData,
} from '@vuepress/plugin-theme-data/lib/client'
import type {
  ThemeDataRef,
  ThemeLocaleDataRef,
} from '@vuepress/plugin-theme-data/lib/client'
import type { PlumeThemeData } from '../../shared'

export const useThemeData = (): ThemeDataRef<PlumeThemeData> =>
  _useThemeData<PlumeThemeData>()

export const useThemeLocaleData = (): ThemeLocaleDataRef<PlumeThemeData> =>
  _useThemeLocaleData<PlumeThemeData>()
