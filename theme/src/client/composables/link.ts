import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { isLinkExternal, isLinkWithProtocol } from '@vuepress/helper/client'
import { computed, toValue } from 'vue'
import { resolveRoute, resolveRouteFullPath, useRoute } from 'vuepress/client'
import { useData } from './data.js'

interface UseLinkResult {
  /**
   * 外部链接
   */
  isExternal: ComputedRef<boolean>
  /**
   * 外部链接协议
   * 此项不包含 target="_blank" 的情况
   */
  isExternalProtocol: ComputedRef<boolean>
  link: ComputedRef<string | undefined>
}

export function useLink(
  href: MaybeRefOrGetter<string | undefined>,
  target?: MaybeRefOrGetter<string | undefined>,
): UseLinkResult {
  const route = useRoute()
  const { page } = useData()

  // 预判断是否可以直接认为是外部链接
  // 在此时并不能完全确认是否一定是内部链接
  const maybeIsExternal = computed(() => {
    const link = toValue(href)
    const rawTarget = toValue(target)
    if (!link)
      return false
    if (rawTarget === '_blank' || isLinkExternal(link))
      return true
    return false
  })

  // 预处理链接，尝试转为内部的链接
  const preProcessLink = computed(() => {
    const link = toValue(href)
    if (!link || maybeIsExternal.value)
      return link

    const currentPath = page.value.filePathRelative ? `/${page.value.filePathRelative}` : undefined
    const path = resolveRouteFullPath(link, currentPath)
    if (path.includes('#')) {
      // 将路径 + 锚点 与 当前路由路径进行比较
      // 转为锚点链接，避免页面发生刷新
      if (path.slice(0, path.indexOf('#')) === route.path) {
        return path.slice(path.indexOf('#'))
      }
    }
    return path
  })

  const isExternal = computed(() => {
    const link = preProcessLink.value
    if (maybeIsExternal.value)
      return true

    if (!link || link[0] === '#')
      return false

    // 判断是否为不存在的路由
    const routePath = link.split(/[?#]/)[0]
    const currentPath = page.value.filePathRelative ? `/${page.value.filePathRelative}` : undefined
    const { notFound } = resolveRoute(routePath, currentPath)

    if (__VUEPRESS_DEV__)
      notFound && console.warn(`[VuePress Dead Link] "${toValue(href)}" is not found in (${page.value.filePathRelative || page.value.path})`)

    return notFound
  })

  const link = computed(() => {
    // 外部链接保持原样
    if (isExternal.value) {
      return toValue(href)
    }
    return preProcessLink.value
  })

  const isExternalProtocol = computed(() => {
    if (!link.value || link.value[0] === '#')
      return false

    return isLinkWithProtocol(link.value)
  })

  return { isExternal, isExternalProtocol, link }
}
