import type { Ref } from 'vue'
import type { ThemeLocaleDataRef } from '@vuepress/plugin-theme-data/client'
import {
  usePageData,
  usePageFrontmatter,
  usePageLang,
  useSiteLocaleData,
} from 'vuepress/client'
import type {
  PageDataRef,
  PageFrontmatterRef,
  SiteLocaleDataRef,
} from 'vuepress/client'
import type {
  PlumeThemeFriendsFrontmatter,
  PlumeThemeLocaleData,
  PlumeThemePageData,
  PlumeThemePageFrontmatter,
  PlumeThemePostFrontmatter,
} from '../../shared/index.js'
import { useThemeLocaleData } from './themeData.js'
import { hashRef } from './hash.js'
import { useDarkMode } from './darkMode.js'

type FrontmatterType = 'post' | 'friends' | 'page'

type Frontmatter<T extends FrontmatterType = 'page'> = T extends 'post'
  ? PlumeThemePostFrontmatter
  : T extends 'friends'
    ? PlumeThemeFriendsFrontmatter
    : PlumeThemePageFrontmatter

export interface Data<T extends FrontmatterType = 'page'> {
  theme: ThemeLocaleDataRef<PlumeThemeLocaleData>
  page: PageDataRef<PlumeThemePageData>
  frontmatter: PageFrontmatterRef<Frontmatter<T>>
  lang: Ref<string>
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
  const lang = usePageLang()

  return { theme, page, frontmatter, lang, hash: hashRef, site, isDark }
}
