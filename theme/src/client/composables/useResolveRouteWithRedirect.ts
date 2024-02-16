import { isFunction, isString } from 'vuepress/shared'
import { useRouter } from 'vuepress/client'
import type { Router } from 'vuepress/client'
import type { NavItemWithLink } from '../../shared/index.js'

/**
 * Resolve a route with redirection
 */
export function useResolveRouteWithRedirect(...args: Parameters<Router['resolve']>): ReturnType<Router['resolve']> {
  const router = useRouter()
  const route = router.resolve(...args)
  const lastMatched = route.matched[route.matched.length - 1]
  if (!lastMatched?.redirect)
    return route

  const { redirect } = lastMatched
  const resolvedRedirect = isFunction(redirect) ? redirect(route) : redirect
  const resolvedRedirectObj = isString(resolvedRedirect)
    ? { path: resolvedRedirect }
    : resolvedRedirect
  return useResolveRouteWithRedirect({
    hash: route.hash,
    query: route.query,
    params: route.params,
    ...resolvedRedirectObj,
  })
}

/**
 * Resolve NavLink props from string
 *
 * @example
 * - Input: '/README.md'
 * - Output: { text: 'Home', link: '/' }
 */
export function useNavLink(item: string): NavItemWithLink {
  // the route path of vue-router is url-encoded, and we expect users are using
  // non-url-encoded string in theme config, so we need to url-encode it first to
  // resolve the route correctly
  const resolved = useResolveRouteWithRedirect(encodeURI(item))
  return {
    text: (resolved.meta as any).title || item,
    link: resolved.name === '404' ? item : resolved.fullPath,
  }
}
