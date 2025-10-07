import type { Ref } from 'vue'
import type {
  PageDataRef,
  PageFrontmatterRef,
  SiteLocaleDataRef,
} from 'vuepress/client'
import type {
  ThemeDocCollection,
  ThemeFriendsFrontmatter,
  ThemeHomeFrontmatter,
  ThemeLocaleData,
  ThemePageData,
  ThemePageFrontmatter,
  ThemePostCollection,
  ThemePostFrontmatter,
} from '../../shared/index.js'
import type { ThemeLocaleDataRef } from './theme-data.js'
import {
  usePageData,
  usePageFrontmatter,
  usePageLang,
  useSiteLocaleData,
} from 'vuepress/client'
import { type CollectionItemRef, useCollection } from './collections.js'
import { useDarkMode } from './dark-mode.js'
import { useThemeLocaleData } from './theme-data.js'

type FrontmatterType = 'home' | 'post' | 'friends' | 'page'
type FrontmatterCollectionType = 'post' | 'doc'

type Frontmatter<T extends FrontmatterType = 'page'> = T extends 'home'
  ? ThemeHomeFrontmatter : T extends 'post'
    ? ThemePostFrontmatter
    : T extends 'friends'
      ? ThemeFriendsFrontmatter
      : ThemePageFrontmatter

export interface Data<T extends FrontmatterType = 'page', C extends FrontmatterCollectionType = 'doc'> {
  theme: ThemeLocaleDataRef<ThemeLocaleData>
  page: PageDataRef<ThemePageData>
  frontmatter: PageFrontmatterRef<Frontmatter<T> & Record<string, unknown>>
  lang: Ref<string>
  site: SiteLocaleDataRef
  isDark: Ref<boolean>
  collection: CollectionItemRef<C extends 'doc' ? ThemeDocCollection : ThemePostCollection>
}

export function useData<T extends FrontmatterType = 'page', C extends FrontmatterCollectionType = 'doc'>(): Data<T, C> {
  const theme = useThemeLocaleData()
  const page = usePageData<ThemePageData>()
  const frontmatter = usePageFrontmatter<Frontmatter<T> & Record<string, unknown>>()
  const site = useSiteLocaleData()
  const isDark = useDarkMode()
  const lang = usePageLang()

  const collection = useCollection<C extends 'doc' ? ThemeDocCollection : ThemePostCollection>()

  return { theme, page, frontmatter, lang, site, isDark, collection }
}
