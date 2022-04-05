import { useRouteLocale, useSiteLocaleData } from '@vuepress/client'
import { isLinkHttp, isString } from '@vuepress/shared'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { NavbarGroup, NavbarItem, ResolveNavbarItem } from '../../shared'
import { resolveRepoType } from '../utils'
import { useNavLink } from './navLink'
import { useThemeLocaleData } from './themeData'

export const useNavbarSelectLanguage = (): ComputedRef<ResolveNavbarItem[]> => {
  const router = useRouter()
  const routeLocale = useRouteLocale()
  const siteLocale = useSiteLocaleData()
  const themeLocale = useThemeLocaleData()

  return computed<ResolveNavbarItem[]>(() => {
    const localePaths = Object.keys(siteLocale.value.locales)
    if (localePaths.length < 2) {
      return []
    }

    const currentPath = router.currentRoute.value.path
    const currentFullPath = router.currentRoute.value.fullPath

    const languageDropdown: ResolveNavbarItem = {
      text: themeLocale.value.selectLanguageText ?? 'unknown language',
      ariaLabel:
        themeLocale.value.selectLanguageAriaLabel ?? 'unknown language',
      children: localePaths.map((targetLocalPath) => {
        const targetSiteLocale =
          siteLocale.value.locales?.[targetLocalPath] ?? {}
        const targetThemeLocale =
          themeLocale.value.locales?.[targetLocalPath] ?? {}
        const targetLang = `${targetSiteLocale.lang}`

        const text = targetThemeLocale.selectLanguageName ?? targetLang
        let link: string

        if (targetLang === siteLocale.value.lang) {
          link = currentFullPath
        } else {
          const targetLocalePage = currentPath.replace(
            routeLocale.value,
            targetLocalPath
          )
          if (
            router.getRoutes().some((item) => item.path === targetLocalPath)
          ) {
            link = targetLocalePage
          } else {
            link = targetThemeLocale.home ?? targetLocalPath
          }
        }
        return { text, link }
      }),
    }
    return [languageDropdown]
  })
}

export const useNavbarRepo = (): ComputedRef<ResolveNavbarItem[]> => {
  const themeLocale = useThemeLocaleData()

  const repo = computed(() => themeLocale.value.repo)
  const repoType = computed(() => {
    return repo.value ? resolveRepoType(repo.value) : null
  })

  const repoLink = computed(() => {
    if (repo.value && !isLinkHttp(repo.value)) {
      return `https://github.com/${repo.value}`
    }
    return repo.value
  })

  const repoLabel = computed(() => {
    if (!repoLink.value) return null
    if (themeLocale.value.repoLabel) return themeLocale.value.repoLabel
    if (repoType.value === null) return 'Source'
    return repoType.value
  })

  return computed(() => {
    if (!repoLink.value || !repoLabel.value) {
      return []
    }
    return [
      {
        text: repoLabel.value,
        link: repoLink.value,
      },
    ]
  })
}

const resolveNavbarItem = (
  item: NavbarItem | NavbarGroup | string
): ResolveNavbarItem => {
  if (isString(item)) {
    return useNavLink(item)
  }
  if ((item as NavbarGroup).children) {
    return {
      ...item,
      children: (item as NavbarGroup).children.map(resolveNavbarItem),
    }
  }
  return item as ResolveNavbarItem
}

export const useNavbarConfig = (): ComputedRef<ResolveNavbarItem[]> => {
  const themeLocale = useThemeLocaleData()
  return computed(() => (themeLocale.value.navbar || []).map(resolveNavbarItem))
}
