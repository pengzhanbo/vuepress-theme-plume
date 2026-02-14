import type { ThemeBadge, ThemeIcon } from '../common/index.js'

/**
 * Navigation item
 * Can be a simple link string or detailed configuration
 *
 * 导航项
 * 可以是简单的链接字符串或详细配置
 */
export type ThemeNavItem = string | NavItemWithLink | NavItemWithChildren

/**
 * Navigation item with link
 * Single link navigation item
 *
 * 带链接的导航项
 * 单个链接导航项
 */
export interface NavItemWithLink {
  /**
   * Navigation text
   * 导航文本
   */
  text: string
  /**
   * Navigation link
   * 导航链接
   */
  link: string
  /**
   * Navigation icon
   * 导航图标
   */
  icon?: ThemeIcon

  /**
   * Badge displayed next to the link
   * 徽章
   */
  badge?: string | ThemeBadge

  /**
   * Page prefix for current group (not used for link items)
   * 当前分组的页面前缀
   */
  prefix?: never

  /**
   * Child items (not used for link items)
   * 子项
   */
  items?: never

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   *
   * `activeMatch` 应该是一个正则表达式字符串。我们不能在这里使用实际的
   * RegExp 对象，因为它不可序列化
   */
  activeMatch?: string

  /**
   * Link relationship attribute
   * 链接关系属性
   */
  rel?: string

  /**
   * Link target attribute
   * 链接目标属性
   */
  target?: string

  /**
   * Whether to hide the icon
   * 是否隐藏图标
   */
  noIcon?: boolean
}

/**
 * Navigation item children (dropdown menu items)
 * Group of items in a dropdown menu
 *
 * 导航下拉菜单子项
 * 下拉菜单中的项目组
 */
export interface NavItemChildren {
  /**
   * Dropdown menu text
   * 下拉菜单的文本
   */
  text?: string

  /**
   * Page prefix for current group
   * 当前分组的页面前缀
   */
  prefix?: string

  /**
   * Navigation icon
   * 导航图标
   */
  icon?: ThemeIcon

  /**
   * Badge displayed next to the text
   * 徽章
   */
  badge?: string | ThemeBadge

  /**
   * Dropdown menu items
   * 导航栏下拉菜单
   */
  items: (string | NavItemWithLink)[]
}

/**
 * Navigation item with children (dropdown)
 * Dropdown menu navigation item
 *
 * 带子项的导航项（下拉菜单）
 * 下拉菜单导航项
 */
export interface NavItemWithChildren {
  /**
   * Navigation text
   * 导航文本
   */
  text?: string

  /**
   * Page prefix for current group
   * 当前分组的页面前缀
   */
  prefix?: string

  /**
   * Navigation icon
   * 导航图标
   */
  icon?: ThemeIcon

  /**
   * Badge displayed next to the text
   * 徽章
   */
  badge?: string | ThemeBadge

  /**
   * Dropdown menu items
   * 导航栏下拉菜单
   */
  items: (string | NavItemChildren | NavItemWithLink)[]

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   *
   * `activeMatch` 应为正则表达式字符串，但必须将其定义为字符串
   * 我们不能在这里使用实际的 RegExp 对象，因为它在构建期间不可序列化
   */
  activeMatch?: string
}
