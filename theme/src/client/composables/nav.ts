import type { Ref } from 'vue'
import type {
  ResolvedNavItem,
  ResolvedNavItemWithLink,
  ThemeNavItem,
} from '../../shared/index.js'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vuepress/client'

import { normalizeLink, resolveNavLink } from '../utils/index.js'
import { useData } from './data.js'

/**
 * Use navbar data
 * Returns the resolved navbar items based on theme configuration
 *
 * 获取导航栏数据
 * 根据主题配置返回解析后的导航栏项目
 *
 * @returns Reactive reference to resolved navbar items / 解析后的导航栏项目的响应式引用
 */
export function useNavbarData(): Ref<ResolvedNavItem[]> {
  const { theme } = useData()

  return computed(() => resolveNavbar(theme.value.navbar || []))
}

/**
 * Resolve navbar configuration to resolved items
 * Recursively processes navbar items and resolves links
 *
 * 将导航栏配置解析为解析后的项目
 * 递归处理导航栏项目并解析链接
 *
 * @param navbar - Raw navbar configuration / 原始导航栏配置
 * @param _prefix - URL prefix for nested items / 嵌套项目的 URL 前缀
 * @returns Array of resolved navbar items / 解析后的导航栏项目数组
 */
function resolveNavbar(navbar: ThemeNavItem[], _prefix = ''): ResolvedNavItem[] {
  const resolved: ResolvedNavItem[] = []
  navbar.forEach((item) => {
    if (typeof item === 'string') {
      resolved.push(resolveNavLink(normalizeLink(_prefix, item)))
    }
    else {
      const { items, prefix, ...args } = item
      const res = { ...args } as ResolvedNavItem
      if ('link' in res) {
        res.link = normalizeLink(_prefix, res.link)
      }
      if (items?.length) {
        res.items = resolveNavbar(
          items,
          normalizeLink(_prefix, prefix),
        ) as ResolvedNavItemWithLink[]
      }
      resolved.push(res)
    }
  })
  return resolved
}

/**
 * Navigation control return type
 * Provides state and methods for mobile navigation menu
 *
 * 导航控制返回类型
 * 提供移动端导航菜单的状态和方法
 */
export interface UseNavReturn {
  /** Whether the mobile screen menu is open / 移动端屏幕菜单是否打开 */
  isScreenOpen: Ref<boolean>
  /** Open the mobile screen menu / 打开移动端屏幕菜单 */
  openScreen: () => void
  /** Close the mobile screen menu / 关闭移动端屏幕菜单 */
  closeScreen: () => void
  /** Toggle the mobile screen menu / 切换移动端屏幕菜单 */
  toggleScreen: () => void
}

/**
 * Use nav
 * Provides mobile navigation menu control functionality
 *
 * 导航栏状态控制，提供移动端导航菜单的打开、关闭和切换功能
 *
 * @returns Navigation control state and methods / 导航控制状态和方法
 */
export function useNav(): UseNavReturn {
  const isScreenOpen = ref(false)

  /**
   * Open the mobile navigation screen
   * Adds resize listener to auto-close on larger screens
   */
  function openScreen(): void {
    isScreenOpen.value = true
    window.addEventListener('resize', closeScreenOnTabletWindow)
  }

  /**
   * Close the mobile navigation screen
   * Removes resize listener
   */
  function closeScreen(): void {
    isScreenOpen.value = false
    window.removeEventListener('resize', closeScreenOnTabletWindow)
  }

  /**
   * Toggle the mobile navigation screen
   */
  function toggleScreen(): void {
    if (isScreenOpen.value) {
      closeScreen()
    }
    else {
      openScreen()
    }
  }

  /**
   * Close screen when the user resizes the window wider than tablet size.
   * Automatically closes the mobile menu on larger screens.
   */
  function closeScreenOnTabletWindow(): void {
    if (window.outerWidth >= 768) {
      closeScreen()
    }
  }

  const route = useRoute()
  watch(() => route.path, closeScreen)

  return {
    isScreenOpen,
    openScreen,
    closeScreen,
    toggleScreen,
  }
}
