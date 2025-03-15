import type { Ref } from 'vue'
import type {
  PageDataRef,
  PageFrontmatterRef,
  SiteLocaleDataRef,
} from 'vuepress/client'
import type {
  BlogOptions,
  ThemeFriendsFrontmatter,
  ThemeHomeFrontmatter,
  ThemeLocaleData,
  ThemePageData,
  ThemePageFrontmatter,
  ThemePostFrontmatter,
} from '../../shared/index.js'
import type { ThemeLocaleDataRef } from './theme-data.js'
import { computed } from 'vue'
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
  ? ThemeHomeFrontmatter : T extends 'post'
    ? ThemePostFrontmatter
    : T extends 'friends'
      ? ThemeFriendsFrontmatter
      : ThemePageFrontmatter

export interface Data<T extends FrontmatterType = 'page'> {
  theme: ThemeLocaleDataRef<ThemeLocaleData>
  page: PageDataRef<ThemePageData>
  frontmatter: PageFrontmatterRef<Frontmatter<T> & Record<string, unknown>>
  blog: Ref<BlogOptions>
  lang: Ref<string>
  site: SiteLocaleDataRef
  isDark: Ref<boolean>
}

export function useData<T extends FrontmatterType = 'page'>(): Data<T> {
  const themeData = useThemeData()
  const theme = useThemeLocaleData()
  const page = usePageData<ThemePageData>()
  const frontmatter = usePageFrontmatter<Frontmatter<T> & Record<string, unknown>>()
  const site = useSiteLocaleData()
  const isDark = useDarkMode()
  const lang = usePageLang()

  const blog = computed(() => themeData.value.blog || {})

  return { theme, page, frontmatter, lang, site, isDark, blog }
}
