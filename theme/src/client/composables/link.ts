import { isLinkExternal } from '@vuepress/helper/client'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { resolveRouteFullPath, useRoute } from 'vuepress/client'
import { useData } from './data.js'

const ENDING_SLASH = /(?:\/|\.(?:md|html))$/i

export function useLink(
  href: MaybeRefOrGetter<string | undefined>,
  target?: MaybeRefOrGetter<string | undefined>,
) {
  const route = useRoute()
  const { page } = useData()

  const isExternal = computed(() => {
    const link = toValue(href)
    const rawTarget = toValue(target)
    if (!link)
      return false
    if (rawTarget === '_blank' || isLinkExternal(link))
      return true
    const pathname = link.split(/[#?]/)[0]
    return !ENDING_SLASH.test(pathname)
  })

  const link = computed(() => {
    const link = toValue(href)
    if (!link)
      return undefined
    if (isExternal.value)
      return link

    const path = resolveRouteFullPath(link, `/${page.value.filePathRelative!}`)
    if (path.includes('#')) {
      if (path.slice(0, path.indexOf('#')) === route.path) {
        return path.slice(path.indexOf('#'))
      }
    }
    return path
  })

  return { isExternal, link }
}
