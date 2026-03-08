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

/**
 * Sidebar data type - maps locale paths to sidebar configurations.
 *
 * 侧边栏数据类型 - 将语言环境路径映射到侧边栏配置。
 */
export type SidebarData = Record<string, ThemeSidebar>

/**
 * Reference type for sidebar data.
 *
 * 侧边栏数据的引用类型。
 */
export type SidebarDataRef = Ref<SidebarData>

/**
 * Reference type for auto-generated directory sidebar.
 *
 * 自动生成目录侧边栏的引用类型。
 */
export type AutoDirSidebarRef = Ref<ThemeSidebarItem[] | {
  link: string
  items: ThemeSidebarItem[]
}>

/**
 * Reference type for auto-generated home data.
 *
 * 自动生成首页数据的引用类型。
 */
export type AutoHomeDataRef = Ref<Record<string, string>>

const { __auto__, __home__, ...items } = sidebarRaw

/**
 * Global sidebar data reference.
 *
 * 全局侧边栏数据引用。
 */
export const sidebarData: SidebarDataRef = ref(items)

/**
 * Auto-generated directory sidebar reference.
 *
 * 自动生成目录侧边栏引用。
 */
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

/**
 * Setup sidebar tracking.
 * Automatically updates sidebar based on route and frontmatter changes.
 *
 * 设置侧边栏跟踪。
 * 根据路由和 frontmatter 变化自动更新侧边栏。
 */
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
 * Use sidebar data.
 * Returns the resolved sidebar items for the current page.
 *
 * 获取侧边栏数据。
 * 返回当前页面的解析侧边栏项目。
 *
 * @returns Resolved sidebar items reference / 解析侧边栏项目引用
 */
export function useSidebarData(): Ref<ResolvedSidebarItem[]> {
  return sidebar
}

/**
 * Get the sidebar configuration from sidebar options.
 * Ensures correct sidebar config from MultiSideBarConfig with various path combinations.
 * Returns empty array if no matching config is found.
 *
 * 从侧边栏选项获取侧边栏配置。
 * 确保从 MultiSideBarConfig 获取正确的侧边栏配置，支持各种路径组合。
 * 如果未找到匹配的配置，则返回空数组。
 *
 * @param routePath - Current route path / 当前路由路径
 * @param routeLocal - Current route locale / 当前路由语言环境
 * @returns Resolved sidebar items / 解析的侧边栏项目
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

/**
 * Resolve sidebar items from raw configuration.
 * Converts string items and nested structures to resolved format.
 *
 * 从原始配置解析侧边栏项目。
 * 将字符串项目和嵌套结构转换为解析格式。
 *
 * @param sidebarItems - Raw sidebar items / 原始侧边栏项目
 * @param _prefix - URL prefix for nested items / 嵌套项目的 URL 前缀
 * @returns Resolved sidebar items / 解析的侧边栏项目
 */
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
 * Get or generate sidebar groups from the given sidebar items.
 * Groups consecutive items without children into a single group.
 *
 * 从给定的侧边栏项目获取或生成侧边栏分组。
 * 将没有子项目的连续项目分组到单个组中。
 *
 * @param sidebar - Flat array of sidebar items / 平面侧边栏项目数组
 * @returns Grouped sidebar items / 分组的侧边栏项目
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
 * Get the first link from sidebar items.
 * Recursively searches through nested items to find the first link.
 *
 * 从侧边栏项目获取第一个链接。
 * 递归搜索嵌套项目以找到第一个链接。
 *
 * @param sidebar - Sidebar items to search / 要搜索的侧边栏项目
 * @returns First link found or empty string / 找到的第一个链接或空字符串
 */
export function getSidebarFirstLink(sidebar: ResolvedSidebarItem[]): string {
  for (const item of sidebar) {
    if (item.link)
      return item.link
    if (item.items)
      return getSidebarFirstLink(item.items)
  }
  return ''
}
