import type { ComputedRef, Ref } from 'vue'
import type { ResolvedSidebarItem } from '../../shared/index.js'
import { ensureLeadingSlash, isArray } from '@vuepress/helper/client'
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { resolveRouteFullPath, useRoute, useRouteLocale } from 'vuepress/client'
import { isActive } from '../utils/index.js'
import { useData } from './data.js'
import { useLayout } from './layout.js'
import { getSidebarGroups, sidebarData, useSidebarData } from './sidebar-data.js'

/**
 * Check if the given sidebar item contains any active link.
 *
 * 检查给定的侧边栏项是否包含活动链接
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

const containsActiveLink = hasActiveLink

const isSidebarEnabled = ref(false)
const isSidebarCollapsed = ref(false)

/**
 * Use sidebar control
 *
 * 侧边栏控制，提供启用/禁用侧边栏和折叠/展开的控制函数
 */
export function useSidebarControl() {
  const enableSidebar = (): void => {
    isSidebarEnabled.value = true
  }

  const disableSidebar = (): void => {
    isSidebarEnabled.value = false
  }

  const toggleSidebarEnabled = (): void => {
    if (isSidebarEnabled.value) {
      disableSidebar()
    }
    else {
      enableSidebar()
    }
  }

  function toggleSidebarCollapse(collapse?: boolean) {
    isSidebarCollapsed.value = collapse ?? !isSidebarCollapsed.value
  }

  return {
    isSidebarEnabled,
    enableSidebar,
    disableSidebar,
    toggleSidebarEnabled,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  }
}

/**
 * Use sidebar
 *
 * 侧边栏数据，获取当前路由的侧边栏项目和分组
 */
export function useSidebar(): {
  sidebar: Ref<ResolvedSidebarItem[]>
  sidebarKey: ComputedRef<string>
  sidebarGroups: ComputedRef<ResolvedSidebarItem[]>
} {
  const { page } = useData()
  const routeLocal = useRouteLocale()
  const { hasSidebar } = useLayout()
  const sidebar = useSidebarData()

  const sidebarGroups = computed(() => {
    return hasSidebar.value ? getSidebarGroups(sidebar.value) : []
  })

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

  return { sidebar, sidebarKey, sidebarGroups }
}

/**
 * Use close sidebar on escape
 *
 * a11y: 缓存打开侧边栏的元素（菜单按钮），当使用 Escape 关闭菜单时重新聚焦该按钮
 */
export function useCloseSidebarOnEscape(): void {
  const { disableSidebar } = useSidebarControl()
  let triggerElement: HTMLButtonElement | undefined

  watchEffect(() => {
    triggerElement = isSidebarEnabled.value
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
    if (e.key === 'Escape' && isSidebarEnabled.value) {
      disableSidebar()
      triggerElement?.focus()
    }
  }
}

/**
 * Use sidebar item control
 *
 * 侧边栏项目控制，管理单个侧边栏项目的折叠状态、激活状态等
 */
export function useSidebarItemControl(item: ComputedRef<ResolvedSidebarItem>): SidebarItemControl {
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

export interface SidebarItemControl {
  collapsed: Ref<boolean>
  collapsible: ComputedRef<boolean>
  isLink: ComputedRef<boolean>
  isActiveLink: Ref<boolean>
  hasActiveLink: ComputedRef<boolean>
  hasChildren: ComputedRef<boolean>
  toggle: () => void
}
