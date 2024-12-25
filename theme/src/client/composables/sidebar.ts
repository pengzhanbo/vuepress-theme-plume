import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ResolvedSidebarItem, Sidebar, SidebarItem } from '../../shared/index.js'
import { sidebar as sidebarRaw } from '@internal/sidebar'
import {
  ensureLeadingSlash,
  isArray,
  isPlainObject,
  isString,
  removeLeadingSlash,
} from '@vuepress/helper/client'
import { useMediaQuery } from '@vueuse/core'
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  watchEffect,
} from 'vue'
import { resolveRouteFullPath, useRoute, useRouteLocale } from 'vuepress/client'
import { isActive, normalizeLink, normalizePrefix, resolveNavLink } from '../utils/index.js'
import { useData } from './data.js'
import { useEncrypt } from './encrypt.js'

export type SidebarData = Record<string, Sidebar>

export type SidebarDataRef = Ref<SidebarData>
export type AutoDirSidebarRef = Ref<SidebarItem[] | {
  link: string
  items: SidebarItem[]
}>
export type AutoHomeDataRef = Ref<Record<string, string>>

const { __auto__, __home__, ...items } = sidebarRaw

const sidebarData: SidebarDataRef = ref(items)
const autoDirSidebar: AutoDirSidebarRef = ref(__auto__)
const autoHomeData: AutoHomeDataRef = ref(__home__)

if (__VUEPRESS_DEV__ && (import.meta.webpackHot || import.meta.hot)) {
  __VUE_HMR_RUNTIME__.updateSidebar = (data: SidebarData) => {
    const { __auto__, __home__, ...items } = data
    sidebarData.value = items
    autoDirSidebar.value = __auto__ as SidebarItem[]
    autoHomeData.value = __home__ as Record<string, string>
  }
}

const sidebarSymbol: InjectionKey<Ref<ResolvedSidebarItem[]>> = Symbol(
  __VUEPRESS_DEV__ ? 'sidebar' : '',
)

export function setupSidebar() {
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

  const sidebarData = computed(() => {
    return hasSidebar.value
      ? getSidebar(typeof frontmatter.value.sidebar === 'string'
          ? frontmatter.value.sidebar
          : page.value.path, routeLocale.value)
      : []
  })

  provide(sidebarSymbol, sidebarData)
}

export function useSidebarData(): Ref<ResolvedSidebarItem[]> {
  const sidebarData = inject(sidebarSymbol)
  if (!sidebarData) {
    throw new Error('useSidebarData() is called without provider.')
  }
  return sidebarData
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
      const prefix = normalizePrefix(dir, sidebar.prefix)
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
  sidebarItems: (string | SidebarItem)[],
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
        navLink.link = normalizeLink(_prefix, link)
        const nav = resolveNavLink(navLink.link)
        navLink.icon = nav.icon || navLink.icon
      }
      const nextPrefix = normalizePrefix(_prefix, prefix || dir)
      if (items === 'auto') {
        navLink.items = autoDirSidebar.value[nextPrefix]
        if (!navLink.link && autoHomeData.value[nextPrefix]) {
          navLink.link = normalizeLink(autoHomeData.value[nextPrefix])
          const nav = resolveNavLink(navLink.link)
          navLink.icon = nav.icon || navLink.icon
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

/**
 * Check if the given sidebar item contains any active link.
 */
export function hasActiveLink(path: string, items: ResolvedSidebarItem | ResolvedSidebarItem[]): boolean {
  if (Array.isArray(items)) {
    return items.some(item => hasActiveLink(path, item))
  }

  return isActive(
    path,
    items.link ? resolveRouteFullPath(items.link) : undefined,
  )
    ? true
    : items.items
      ? hasActiveLink(path, items.items)
      : false
}

export interface SidebarControl {
  collapsed: Ref<boolean>
  collapsible: ComputedRef<boolean>
  isLink: ComputedRef<boolean>
  isActiveLink: Ref<boolean>
  hasActiveLink: ComputedRef<boolean>
  hasChildren: ComputedRef<boolean>
  toggle: () => void
}

export interface UseSidebarReturn {
  isOpen: Ref<boolean>
  sidebar: Ref<ResolvedSidebarItem[]>
  sidebarKey: Ref<string>
  sidebarGroups: Ref<ResolvedSidebarItem[]>
  hasSidebar: ComputedRef<boolean>
  hasAside: ComputedRef<boolean>
  leftAside: ComputedRef<boolean>
  isSidebarEnabled: ComputedRef<boolean>
  open: () => void
  close: () => void
  toggle: () => void
}

const containsActiveLink = hasActiveLink

export function useSidebar(): UseSidebarReturn {
  const { theme, frontmatter, page } = useData()
  const routeLocal = useRouteLocale()
  const is960 = useMediaQuery('(min-width: 960px)')
  const { isPageDecrypted } = useEncrypt()

  const isOpen = ref(false)

  const sidebarKey = computed(() => {
    const _sidebar = sidebarData.value[routeLocal.value]
    if (!_sidebar || _sidebar === 'auto' || isArray(_sidebar))
      return routeLocal.value

    return Object.keys(_sidebar)
      .sort((a, b) => b.split('/').length - a.split('/').length)
      .find((dir) => {
        return page.value.path.startsWith(ensureLeadingSlash(dir))
      }) || ''
  })

  const sidebar = useSidebarData()

  const hasSidebar = computed(() => {
    return (
      frontmatter.value.sidebar !== false
      && sidebar.value.length > 0
      && frontmatter.value.pageLayout !== 'home'
    )
  })

  const hasAside = computed(() => {
    if (frontmatter.value.pageLayout === 'home' || frontmatter.value.home)
      return false

    if (frontmatter.value.pageLayout === 'friends' || frontmatter.value.friends)
      return false

    if (!isPageDecrypted.value)
      return false

    if (frontmatter.value.aside != null)
      return !!frontmatter.value.aside
    return theme.value.aside !== false
  })

  const leftAside = computed(() => {
    if (hasAside.value) {
      return frontmatter.value.aside == null
        ? theme.value.aside === 'left'
        : frontmatter.value.aside === 'left'
    }
    return false
  })

  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value)

  const sidebarGroups = computed(() => {
    return hasSidebar.value ? getSidebarGroups(sidebar.value) : []
  })

  const open = (): void => {
    isOpen.value = true
  }

  const close = (): void => {
    isOpen.value = false
  }

  const toggle = (): void => {
    if (isOpen.value) {
      close()
    }
    else {
      open()
    }
  }

  return {
    isOpen,
    sidebar,
    sidebarKey,
    sidebarGroups,
    hasSidebar,
    hasAside,
    leftAside,
    isSidebarEnabled,
    open,
    close,
    toggle,
  }
}

/**
 * a11y: cache the element that opened the Sidebar (the menu button) then
 * focus that button again when Menu is closed with Escape key.
 */
export function useCloseSidebarOnEscape(isOpen: Ref<boolean>, close: () => void): void {
  let triggerElement: HTMLButtonElement | undefined

  watchEffect(() => {
    triggerElement = isOpen.value
      ? (document.activeElement as HTMLButtonElement)
      : undefined
  })

  onMounted(() => {
    window.addEventListener('keyup', onEscape)
  })

  onUnmounted(() => {
    window.removeEventListener('keyup', onEscape)
  })

  function onEscape(e: KeyboardEvent): void {
    if (e.key === 'Escape' && isOpen.value) {
      close()
      triggerElement?.focus()
    }
  }
}

export function useSidebarControl(item: ComputedRef<ResolvedSidebarItem>): SidebarControl {
  const { page } = useData()
  const route = useRoute()

  const collapsed = ref(false)

  const collapsible = computed(() => {
    return item.value.collapsed != null
  })

  const isLink = computed(() => {
    return !!item.value.link
  })

  const isActiveLink = ref(false)
  const updateIsActiveLink = (): void => {
    isActiveLink.value = isActive(
      page.value.path,
      item.value.link ? resolveRouteFullPath(item.value.link) : undefined,
    )
  }

  watch([() => page.value.path, item, () => route.hash], updateIsActiveLink)
  onMounted(updateIsActiveLink)

  const hasActiveLink = computed(() => {
    if (isActiveLink.value) {
      return true
    }

    return item.value.items
      ? containsActiveLink(page.value.path, item.value.items)
      : false
  })

  const hasChildren = computed(() => {
    return !!(item.value.items && item.value.items.length)
  })

  watch(() => [collapsible.value, item.value.collapsed], (n, o) => {
    if (n[0] !== o?.[0] || n[1] !== o?.[1])
      collapsed.value = !!(collapsible.value && item.value.collapsed)
  }, { immediate: true })

  watch(() => [page.value.path, isActiveLink.value, hasActiveLink.value], () => {
    if (isActiveLink.value || hasActiveLink.value) {
      collapsed.value = false
    }
  }, { immediate: true, flush: 'post' })

  const toggle = (): void => {
    if (collapsible.value) {
      collapsed.value = !collapsed.value
    }
  }

  return {
    collapsed,
    collapsible,
    isLink,
    isActiveLink,
    hasActiveLink,
    hasChildren,
    toggle,
  }
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
