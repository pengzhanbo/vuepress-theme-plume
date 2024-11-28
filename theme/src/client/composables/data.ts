import type {
  PageDataRef,
  PageFrontmatterRef,
  SiteLocaleDataRef,
} from 'vuepress/client'
import type {
  BlogOptions,
  PlumeThemeFriendsFrontmatter,
  PlumeThemeHomeFrontmatter,
  PlumeThemeLocaleData,
  PlumeThemePageData,
  PlumeThemePageFrontmatter,
  PlumeThemePostFrontmatter,
} from '../../shared/index.js'
import type { ThemeLocaleDataRef } from './theme-data.js'
import { computed, type Ref } from 'vue'
import {
  usePageData,
  usePageFrontmatter,
  usePageLang,
  useSiteLocaleData,
} from 'vuepress/client'
import { useDarkMode } from './dark-mode.js'
import { useThemeData, useThemeLocaleData } from './theme-data.js'

type FrontmatterType = 'home' | 'post' | 'friends' | 'page'

type Frontmatter<T extends FrontmatterType = 'page'> = T extends 'home'
  ? PlumeThemeHomeFrontmatter : T extends 'post'
    ? PlumeThemePostFrontmatter
    : T extends 'friends'
      ? PlumeThemeFriendsFrontmatter
      : PlumeThemePageFrontmatter

export interface Data<T extends FrontmatterType = 'page'> {
  theme: ThemeLocaleDataRef<PlumeThemeLocaleData>
  page: PageDataRef<PlumeThemePageData>
  frontmatter: PageFrontmatterRef<Frontmatter<T> & Record<string, unknown>>
  blog: Ref<BlogOptions>
  lang: Ref<string>
  site: SiteLocaleDataRef
  isDark: Ref<boolean>
}

export function useData<T extends FrontmatterType = 'page'>(): Data<T> {
  const themeData = useThemeData()
  const theme = useThemeLocaleData()
  const page = usePageData<PlumeThemePageData>()
  const frontmatter = usePageFrontmatter<Frontmatter<T> & Record<string, unknown>>()
  const site = useSiteLocaleData()
  const isDark = useDarkMode()
  const lang = usePageLang()

  const blog = computed(() => themeData.value.blog || {})

  return { theme, page, frontmatter, lang, site, isDark, blog }
}
