import { usePageData, usePageLang, useSiteData } from '@vuepress/client'
import { computed } from 'vue'
import type { PlumeThemePageData } from '../../shared/index.js'
import { ensureStartingSlash } from '../utils/index.js'
import { useThemeData } from './themeData.js'

export function useLangs({
  removeCurrent = true,
  correspondingLink = false,
} = {}) {
  const page = usePageData<PlumeThemePageData>()
  const site = useSiteData()
  const theme = useThemeData()
  const locale = usePageLang()
  const currentLang = computed(() => {
    const link = locale.value === site.value.lang ? '/' : `/${locale.value}/`
    return {
      label: theme.value.locales?.[link]?.selectLanguageName,
      link,
    }
  })

  const localeLinks = computed(() =>
    Object.entries(theme.value.locales || {}).flatMap(([key, value]) =>
      removeCurrent && currentLang.value.label === value.selectLanguageName
        ? []
        : {
            text: value.selectLanguageName,
            link: normalizeLink(
              key,
              correspondingLink,
              page.value.path.slice(currentLang.value.link.length - 1),
              true
            ),
          }
    )
  )

  return { localeLinks, currentLang }
}

function normalizeLink(
  link: string,
  addPath: boolean,
  path: string,
  addExt: boolean
) {
  return addPath
    ? link.replace(/\/$/, '') +
        ensureStartingSlash(
          path
            .replace(/(^|\/)?index.md$/, '$1')
            .replace(/\.md$/, addExt ? '.html' : '')
        )
    : link
}