import { useRouteLocale } from 'vuepress/client'
import { computed } from 'vue'

export function useLocaleLink(link: string) {
  const prefix = useRouteLocale()

  return computed(() => {
    return (prefix.value + link).replace(/\/+/g, '/')
  })
}
