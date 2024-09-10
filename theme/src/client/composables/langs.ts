import { computed } from 'vue'
import { resolveRoute, useRouteLocale, withBase } from 'vuepress/client'
import { normalizeLink } from '../utils/index.js'
import { useData } from './data.js'
import { useBlogPageData } from './page.js'
import { useThemeData } from './theme-data.js'

export function useLangs({
  removeCurrent = true,
} = {}) {
  const theme = useThemeData()
  const { page } = useData()
  const routeLocale = useRouteLocale()
  const { isBlogPost } = useBlogPageData()

  const currentLang = computed(() => {
    const link = routeLocale.value
    return {
      label: theme.value.locales?.[link]?.selectLanguageName,
      link,
    }
  })

  const getPageLink = (locale: string) => {
    const filepath = page.value.filePathRelative
      ? `/${page.value.filePathRelative}`
      : page.value.path
    const pagePath = filepath.slice(routeLocale.value.length)
    const targetPath = normalizeLink(locale, pagePath)
    const { notFound, path } = resolveRoute(targetPath)
    if (!notFound)
      return path

    const blog = theme.value.blog
    if (isBlogPost.value && blog !== false)
      return withBase(blog?.link || normalizeLink(locale, 'blog/'))

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
