import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { isLinkExternal, isLinkWithProtocol } from '@vuepress/helper/client'
import { computed, toValue } from 'vue'
import { resolveRoute, resolveRouteFullPath, useRoute } from 'vuepress/client'
import { useData } from './data.js'

/**
 * Link resolution result interface
 * Provides information about the resolved link
 *
 * 链接解析结果接口
 * 提供有关解析后链接的信息
 */
interface UseLinkResult {
  /**
   * Whether the link is external
   * 是否为外部链接
   */
  isExternal: ComputedRef<boolean>
  /**
   * Whether the link uses an external protocol
   * Does not include target="_blank" cases
   * 是否使用外部链接协议
   * 此项不包含 target="_blank" 的情况
   */
  isExternalProtocol: ComputedRef<boolean>
  /**
   * The resolved link URL
   * 解析后的链接 URL
   */
  link: ComputedRef<string | undefined>
}

/**
 * Use link
 * Resolves and processes a link URL with smart handling of internal/external links
 *
 * 使用链接
 * 解析并处理链接 URL，智能处理内部/外部链接
 *
 * @param href - Link URL or reference / 链接 URL 或引用
 * @param target - Link target or reference / 链接目标或引用
 * @returns Link resolution result / 链接解析结果
 */
export function useLink(
  href: MaybeRefOrGetter<string | undefined>,
  target?: MaybeRefOrGetter<string | undefined>,
): UseLinkResult {
  const route = useRoute()
  const { page } = useData()

  // Pre-determine if it can be considered an external link
  // At this point, it cannot be fully confirmed if it must be an internal link
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

  // Pre-process link, try to convert to internal link
  // 预处理链接，尝试转为内部的链接
  const preProcessLink = computed(() => {
    const link = toValue(href)
    if (!link || maybeIsExternal.value)
      return link

    const currentPath = page.value.filePathRelative ? `/${page.value.filePathRelative}` : undefined
    const path = resolveRouteFullPath(link, currentPath)
    if (path.includes('#')) {
      // Compare path + anchor with current route path
      // Convert to anchor link to avoid page refresh
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

    // Check if it's a non-existent route
    // 判断是否为不存在的路由
    const routePath = link.split(/[?#]/)[0]
    const currentPath = page.value.filePathRelative ? `/${page.value.filePathRelative}` : undefined
    const { notFound } = resolveRoute(routePath, currentPath)

    if (__VUEPRESS_DEV__)
      notFound && console.warn(`[VuePress Dead Link] "${toValue(href)}" is not found in (${page.value.filePathRelative || page.value.path})`)

    return notFound
  })

  const link = computed(() => {
    // Keep external links as-is
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
