import type { ComputedRef } from 'vue'
import type { ThemePostCollection } from '../../shared/index.js'
import { computed } from 'vue'
import { resolveRoute, useRouteLocale } from 'vuepress/client'
import { removeLeadingSlash } from 'vuepress/shared'
import { normalizeLink } from '../utils/index.js'
import { useData } from './data.js'
import { usePostsPageData } from './page.js'
import { useThemeData } from './theme-data.js'

interface Lang {
  text?: string
  link: string
}

interface UseLangOptions {
  removeCurrent?: boolean
}

interface UseLangResult {
  localeLinks: ComputedRef<Lang[]>
  currentLang: ComputedRef<Lang>
}

export function useLangs({
  removeCurrent = true,
}: UseLangOptions = {}): UseLangResult {
  const theme = useThemeData()
  const { page, collection } = useData<'page', 'post'>()
  const routeLocale = useRouteLocale()
  const { isPosts } = usePostsPageData()

  const currentLang = computed(() => {
    const link = routeLocale.value
    return {
      text: theme.value.locales?.[link]?.selectLanguageName,
      link,
    }
  })

  const resolvePath = (locale: string, url: string) => {
    const targetPath = normalizeLink(locale, url.slice(routeLocale.value.length))
    const { notFound, path } = resolveRoute(targetPath)
    return notFound ? undefined : path
  }

  const getPageLink = (locale: string) => {
    let path: string | undefined
    // 尝试根据文件路径解析
    if (page.value.filePathRelative) {
      path = resolvePath(locale, `/${page.value.filePathRelative}`)
    }
    // 尝试根据路由路径解析
    path ??= resolvePath(locale, page.value.path)
    if (path)
      return path

    // fallback to posts
    if (isPosts.value && collection.value) {
      const col = collection.value as ThemePostCollection
      return normalizeLink(locale, removeLeadingSlash(col.link || col.dir))
    }

    // fallback to home
    const home = theme.value.home || '/'
    const fallbackResolve = resolveRoute(locale)
    return fallbackResolve.notFound ? home : fallbackResolve.path
  }

  const localeLinks = computed(() =>
    Object.entries(theme.value.locales || {}).flatMap(([key, locale]) =>
      removeCurrent && currentLang.value.text === locale.selectLanguageName
        ? []
        : {
            text: locale.selectLanguageName,
            link: getPageLink(key),
          },
    ),
  )

  return { localeLinks, currentLang }
}
