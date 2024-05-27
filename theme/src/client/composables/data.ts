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
  PlumeThemePostFrontmatter,
} from '../../shared/index.js'
import { useThemeLocaleData } from './themeData.js'
import { hashRef } from './hash.js'
import { useDarkMode } from './darkMode.js'

type FrontmatterType = 'post' | 'page'

type Frontmatter<T extends FrontmatterType = 'page'> = T extends 'post'
  ? PlumeThemePostFrontmatter
  : PlumeThemePageFrontmatter

export interface Data<T extends FrontmatterType = 'page'> {
  theme: ThemeLocaleDataRef<PlumeThemeLocaleData>
  page: PageDataRef<PlumeThemePageData>
  frontmatter: PageFrontmatterRef<Frontmatter<T>>
  hash: Ref<string>
  site: SiteLocaleDataRef
  isDark: Ref<boolean>
}

export function useData<T extends FrontmatterType = 'page'>(): Data<T> {
  const theme = useThemeLocaleData()
  const page = usePageData<PlumeThemePageData>()
  const frontmatter = usePageFrontmatter<Frontmatter<T>>()
  const site = useSiteLocaleData()
  const isDark = useDarkMode()

  return { theme, page, frontmatter, hash: hashRef, site, isDark }
}
