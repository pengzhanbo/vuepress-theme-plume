import type { ComputedRef, Ref } from 'vue'
import type { ResolvedSidebarItem } from '../../shared/index.js'
import { ensureLeadingSlash, isArray } from '@vuepress/helper/client'
import { useMediaQuery } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { resolveRouteFullPath, useRoute, useRouteLocale } from 'vuepress/client'
import { isActive } from '../utils/index.js'
import { useData } from './data.js'
import { useEncrypt } from './encrypt.js'
import { getSidebarGroups, sidebarData, useSidebarData } from './sidebar-data.js'

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
