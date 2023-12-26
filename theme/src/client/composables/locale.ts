import { usePageLang, useSiteData } from '@vuepress/client'
import { computed } from 'vue'
import { normalizeLink } from '../utils'

export const useLocaleLink = (link: string) => {
  const site = useSiteData()
  const locale = usePageLang()

  const links = computed(() => {
    const locales = site.value.locales
    const links: Record<string, string> = {}
    Object.keys(locales).forEach((key) => {
      const locale = locales[key]
      locale.lang && (links[locale.lang] = key)
    })
    return links
  })

  return computed(() => {
    const prefix = links.value[locale.value] || '/'
    return normalizeLink(prefix + link)
  })
}
