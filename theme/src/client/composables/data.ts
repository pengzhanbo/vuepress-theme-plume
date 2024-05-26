import type { Ref } from 'vue'
import type { ThemeLocaleDataRef } from '@vuepress/plugin-theme-data/client'
import {
  usePageData,
  usePageFrontmatter,
  useSiteLocaleData,
} from 'vuepress/client'
import type {
  PageDataRef,
  PageFrontmatterRef,
  SiteLocaleDataRef,
} from 'vuepress/client'
import type {
  PlumeThemeLocaleData,
  PlumeThemePageData,
  PlumeThemePageFrontmatter,
} from '../../shared/index.js'
import { useThemeLocaleData } from './themeData.js'
import { hashRef } from './hash.js'
import { useDarkMode } from './darkMode.js'

export interface Data {
  theme: ThemeLocaleDataRef<PlumeThemeLocaleData>
  page: PageDataRef<PlumeThemePageData>
  frontmatter: PageFrontmatterRef<PlumeThemePageFrontmatter>
  hash: Ref<string>
  site: SiteLocaleDataRef
  isDark: Ref<boolean>
}

export function useData(): Data {
  const theme = useThemeLocaleData()
  const page = usePageData<PlumeThemePageData>()
  const frontmatter = usePageFrontmatter<PlumeThemePageFrontmatter>()
  const site = useSiteLocaleData()
  const isDark = useDarkMode()

  return { theme, page, frontmatter, hash: hashRef, site, isDark }
}
