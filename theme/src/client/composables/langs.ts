import { resolveRoute, usePageData, useRouteLocale, withBase } from 'vuepress/client'
import { computed } from 'vue'
import type { PlumeThemePageData } from '../../shared/index.js'
import { useThemeData } from './themeData.js'
import { getSidebarFirstLink, getSidebarList, normalizePath, useNotesData } from './sidebar.js'

export function useLangs({
  removeCurrent = true,
} = {}) {
  const page = usePageData<PlumeThemePageData>()
  const theme = useThemeData()
  const routeLocale = useRouteLocale()
  const notesData = useNotesData()

  const currentLang = computed(() => {
    const link = routeLocale.value
    return {
      label: theme.value.locales?.[link]?.selectLanguageName,
      link,
    }
  })

  const getPageLink = (locale: string) => {
    const pagePath = page.value.path.slice(routeLocale.value.length)
    const targetPath = normalizePath(`${locale}${pagePath}`)
    const { notFound, path } = resolveRoute(targetPath)
    if (!notFound)
      return path
    const locales = theme.value.locales || {}
    const blog = locales[`/${locale}/`]?.blog
    const fallback = locales['/']?.blog ?? theme.value.blog
    if (page.value.isBlogPost)
      return withBase(blog?.link || normalizePath(`${locale}${fallback?.link || 'blog/'}`))

    const sidebarList = getSidebarList(targetPath, notesData.value)

    if (sidebarList.length > 0) {
      const link = getSidebarFirstLink(sidebarList)
      if (link)
        return link
    }

    const home = withBase(theme.value.home || '/')
    const fallbackResolve = resolveRoute(withBase(locale))
    return fallbackResolve.notFound ? home : fallbackResolve.path
  }

  const localeLinks = computed(() =>
    Object.entries(theme.value.locales || {}).flatMap(([key, locale]) =>
      removeCurrent && currentLang.value.label === locale.selectLanguageName
        ? []
        : {
            text: locale.selectLanguageName,
            link: getPageLink(key),
          },
    ),
  )

  return { localeLinks, currentLang }
}
