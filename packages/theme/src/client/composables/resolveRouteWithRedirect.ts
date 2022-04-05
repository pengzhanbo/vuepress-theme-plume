import { isFunction, isString } from '@vuepress/shared'
import type { Router } from 'vue-router'
import { useRouter } from 'vue-router'

export const useResolveRouteWithRedirect = (
  ...args: Parameters<Router['resolve']>
): ReturnType<Router['resolve']> => {
  const router = useRouter()
  const route = router.resolve(...args)
  const lastMatched = route.matched[route.matched.length - 1]
  if (!lastMatched?.redirect) {
    return route
  }
  const { redirect } = lastMatched
  const resolveRedirect = isFunction(redirect) ? redirect(route) : redirect
  const resolveRedirectObj = isString(resolveRedirect)
    ? { path: resolveRedirect }
    : resolveRedirect

  return useResolveRouteWithRedirect({
    hash: route.hash,
    query: route.query,
    params: route.params,
    ...resolveRedirectObj,
  })
}
