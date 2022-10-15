import type { NavLink } from '../../shared/index.js'
import { useResolveRouteWithRedirect } from './resolveRouteWithRedirect.js'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

export const useNavLink = (item: string): NavLink => {
  const resolved = useResolveRouteWithRedirect(item)
  return {
    text: resolved.meta.title || item,
    link: resolved.name === '404' ? item : resolved.fullPath,
  }
}
