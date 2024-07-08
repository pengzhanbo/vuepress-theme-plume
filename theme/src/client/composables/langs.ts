import { resolveRoute, useRouteLocale, withBase } from 'vuepress/client'
import { computed } from 'vue'
import { normalizeLink } from '../utils/index.js'
import { useThemeData } from './theme-data.js'
import { useData } from './data.js'
import { getSidebarFirstLink, useSidebarData } from './sidebar.js'

export function useLangs({
  removeCurrent = true,
} = {}) {
  const theme = useThemeData()
  const { page } = useData()
  const routeLocale = useRouteLocale()
  const sidebar = useSidebarData()

  const currentLang = computed(() => {
    const link = routeLocale.value
    return {
      label: theme.value.locales?.[link]?.selectLanguageName,
      link,
    }
  })

  const getPageLink = (locale: string) => {
    const pagePath = page.value.path.slice(routeLocale.value.length)
    const targetPath = normalizeLink(locale, pagePath)
    const { notFound, path } = resolveRoute(targetPath)
    if (!notFound)
      return path
    const blog = theme.value.blog
    if (page.value.isBlogPost)
      return withBase(blog?.link || normalizeLink(locale, 'blog/'))

    const sidebarList = sidebar.value

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
