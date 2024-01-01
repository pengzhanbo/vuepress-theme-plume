import { useRouteLocale } from '@vuepress/client'
import { computed } from 'vue'
import { normalizeLink } from '../utils'

export function useLocaleLink(link: string) {
  const prefix = useRouteLocale()

  return computed(() => {
    return normalizeLink(prefix.value + link)
  })
}
