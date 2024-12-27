import { computed } from 'vue'
import { resolveRoute, useRouteLocale } from 'vuepress/client'
import { removeLeadingSlash } from 'vuepress/shared'
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

    // fallback to blog
    const blog = theme.value.blog
    if (isBlogPost.value && blog !== false)
      return normalizeLink(locale, removeLeadingSlash(blog?.link || 'blog/'))

    // fallback to home
    const home = theme.value.home || '/'
    const fallbackResolve = resolveRoute(locale)
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
