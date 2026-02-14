import type { ThemeBadge, ThemeIcon } from '../common/index.js'

/**
 * Resolved navigation item for internal theme use
 * Union type for resolved navigation items
 *
 * 主题内部使用的已解析的导航项
 * 已解析导航项的联合类型
 * @internal
 */
export type ResolvedNavItem
  = | ResolvedNavItemWithLink
    | ResolvedNavItemWithChildren

/**
 * Resolved navigation link item for internal theme use
 * Single link navigation item ready for rendering
 *
 * 主题内部使用的已解析的导航链接项
 * 准备用于渲染的单个链接导航项
 * @internal
 */
export interface ResolvedNavItemWithLink {
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
   * Child items (not used for link items)
   * 子项
   */
  items?: never

  /**
   * Regex pattern for active state matching
   * 用于激活状态匹配的正则表达式模式
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
 * Resolved navigation children for internal theme use
 * Group of items in a dropdown menu
 *
 * 主题内部使用的已解析的导航子项（下拉菜单）
 * 下拉菜单中的项目组
 * @internal
 */
export interface ResolvedNavItemChildren {
  /**
   * Navigation text
   * 导航文本
   */
  text?: string

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
   * Child navigation items
   * 子导航项
   */
  items: ResolvedNavItemWithLink[]
}

/**
 * Resolved navigation item with children for internal theme use
 * Dropdown menu navigation item
 *
 * 主题内部使用的已解析的带子项的导航项
 * 下拉菜单导航项
 * @internal
 */
export interface ResolvedNavItemWithChildren {
  /**
   * Navigation text
   * 导航文本
   */
  text?: string

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
   * 下拉菜单项
   */
  items: (ResolvedNavItemChildren | ResolvedNavItemWithLink)[]

  /**
   * Regex pattern for active state matching
   * 用于激活状态匹配的正则表达式模式
   */
  activeMatch?: string
}
