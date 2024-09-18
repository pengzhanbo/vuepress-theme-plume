import { isLinkExternal } from '@vuepress/helper/client'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { resolveRouteFullPath, useRoute } from 'vuepress/client'
import { useData } from './data.js'

const SEARCH_RE = /\.md(?:(?:#|\?).*)?$/

export function useLink(
  href: MaybeRefOrGetter<string | undefined>,
  target?: MaybeRefOrGetter<string | undefined>,
) {
  const route = useRoute()
  const { page } = useData()

  const isExternal = computed(
    () => {
      const link = toValue(href)
      const rawTarget = toValue(target)
      return (link && isLinkExternal(link)) || rawTarget === '_blank'
    },
  )

  const link = computed(() => {
    const link = toValue(href)
    if (!link)
      return undefined
    if (isExternal.value)
      return link
    const currentPath = link.startsWith('./') && SEARCH_RE.test(link)
      ? `/${page.value.filePathRelative!}`
      : route.path
    const path = resolveRouteFullPath(link, currentPath)
    if (path.includes('#')) {
      if (path.slice(0, path.indexOf('#')) === route.path) {
        return path.slice(path.indexOf('#'))
      }
    }
    return path
  })

  return { isExternal, link }
}
