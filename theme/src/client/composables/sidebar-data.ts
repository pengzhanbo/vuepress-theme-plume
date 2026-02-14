import type { Ref } from 'vue'
import type { ResolvedSidebarItem, ThemeSidebar, ThemeSidebarItem } from '../../shared/index.js'
import { sidebar as sidebarRaw } from '@internal/sidebar'
import {
  isArray,
  isPlainObject,
  isString,
  removeLeadingSlash,
} from '@vuepress/helper/client'
import { computed, ref, watch } from 'vue'
import { useRouteLocale } from 'vuepress/client'
import { normalizeLink, normalizePrefix, resolveNavLink } from '../utils/index.js'
import { useData } from './data.js'

export type SidebarData = Record<string, ThemeSidebar>

export type SidebarDataRef = Ref<SidebarData>
export type AutoDirSidebarRef = Ref<ThemeSidebarItem[] | {
  link: string
  items: ThemeSidebarItem[]
}>
export type AutoHomeDataRef = Ref<Record<string, string>>

const { __auto__, __home__, ...items } = sidebarRaw

export const sidebarData: SidebarDataRef = ref(items)
export const autoDirSidebar: AutoDirSidebarRef = ref(__auto__)
const autoHomeData: AutoHomeDataRef = ref(__home__)

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateSidebar = (data: SidebarData) => {
    const { __auto__, __home__, ...items } = data
    sidebarData.value = items
    autoDirSidebar.value = __auto__ as ThemeSidebarItem[]
    autoHomeData.value = __home__ as Record<string, string>
  }
}

const sidebar: Ref<ResolvedSidebarItem[]> = ref([])

export function setupSidebar(): void {
  const { page, frontmatter } = useData()

  const routeLocale = useRouteLocale()

  const hasSidebar = computed(() => {
    return (
      frontmatter.value.pageLayout !== 'home'
      && frontmatter.value.pageLayout !== 'friends'
      && frontmatter.value.sidebar !== false
      && frontmatter.value.layout !== 'NotFound'
    )
  })

  watch([
    hasSidebar,
    routeLocale,
    () => frontmatter.value.sidebar,
    () => page.value.path,
  ], () => {
    sidebar.value = hasSidebar.value
      ? getSidebar(typeof frontmatter.value.sidebar === 'string'
          ? frontmatter.value.sidebar
          : page.value.path, routeLocale.value)
      : []
  }, { immediate: true })
}

/**
 * Use sidebar data
 *
 * 获取侧边栏数据
 */
export function useSidebarData(): Ref<ResolvedSidebarItem[]> {
  return sidebar
}

/**
 * Get the `Sidebar` from sidebar option. This method will ensure to get correct
 * sidebar config from `MultiSideBarConfig` with various path combinations such
 * as matching `guide/` and `/guide/`. If no matching config was found, it will
 * return empty array.
 */
export function getSidebar(routePath: string, routeLocal: string): ResolvedSidebarItem[] {
  const _sidebar = sidebarData.value[routeLocal]

  if (_sidebar === 'auto') {
    return resolveSidebarItems(autoDirSidebar.value[routeLocal])
  }
  else if (isArray(_sidebar)) {
    return resolveSidebarItems(_sidebar, routeLocal)
  }
  else if (isPlainObject(_sidebar)) {
    routePath = decodeURIComponent(routePath)
    const dir
      = Object.keys(_sidebar)
        .sort((a, b) => b.split('/').length - a.split('/').length)
        .find((dir) => {
          // make sure the multi sidebar key starts with slash too
          return routePath.startsWith(`${routeLocal}${removeLeadingSlash(dir)}`)
        }) || ''
    const sidebar = dir ? _sidebar[dir] : undefined

    if (sidebar === 'auto') {
      return resolveSidebarItems(
        dir ? autoDirSidebar.value[dir] : [],
        routeLocal,
      )
    }
    else if (isArray(sidebar)) {
      return resolveSidebarItems(sidebar, dir)
    }
    else if (isPlainObject(sidebar)) {
      const prefix = normalizePrefix(routeLocal, sidebar.prefix)
      return resolveSidebarItems(
        sidebar.items === 'auto'
          ? autoDirSidebar.value[prefix]
          : sidebar.items,
        prefix,
      )
    }
  }
  return []
}

function resolveSidebarItems(
  sidebarItems: (string | ThemeSidebarItem)[],
  _prefix = '',
): ResolvedSidebarItem[] {
  const resolved: ResolvedSidebarItem[] = []
  sidebarItems.forEach((item) => {
    if (isString(item)) {
      resolved.push(resolveNavLink(normalizeLink(_prefix, item)))
    }
    else {
      const { link, items, prefix, dir, ...args } = item
      const navLink = { ...args } as ResolvedSidebarItem
      if (link) {
        navLink.link = link.startsWith('---') ? link : normalizeLink(_prefix, link)
        const nav = resolveNavLink(navLink.link)
        navLink.icon = nav.icon || navLink.icon
        navLink.badge = nav.badge || navLink.badge
      }
      const nextPrefix = normalizePrefix(_prefix, prefix || dir)
      if (items === 'auto') {
        navLink.items = resolveSidebarItems(autoDirSidebar.value[nextPrefix], nextPrefix)
        if (!navLink.link && autoHomeData.value[nextPrefix]) {
          navLink.link = normalizeLink(autoHomeData.value[nextPrefix])
          const nav = resolveNavLink(navLink.link)
          navLink.icon = nav.icon || navLink.icon
          navLink.badge = nav.badge || navLink.badge
        }
      }
      else {
        navLink.items = items?.length
          ? resolveSidebarItems(items, nextPrefix)
          : undefined
      }
      resolved.push(navLink)
    }
  })
  return resolved
}

/**
 * Get or generate sidebar group from the given sidebar items.
 */
export function getSidebarGroups(sidebar: ResolvedSidebarItem[]): ResolvedSidebarItem[] {
  const groups: ResolvedSidebarItem[] = []

  let lastGroupIndex = 0

  for (const index in sidebar) {
    const item = sidebar[index]

    if (item.items) {
      lastGroupIndex = groups.push(item)
      continue
    }

    if (!groups[lastGroupIndex]) {
      groups.push({ items: [] })
    }

    groups[lastGroupIndex]!.items!.push(item)
  }

  return groups
}

export function getSidebarFirstLink(sidebar: ResolvedSidebarItem[]): string {
  for (const item of sidebar) {
    if (item.link)
      return item.link
    if (item.items)
      return getSidebarFirstLink(item.items)
  }
  return ''
}
