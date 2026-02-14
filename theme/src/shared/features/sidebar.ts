import type { ThemeBadge, ThemeIcon } from '../common/index.js'

/**
 * Sidebar configuration
 * Can be auto-generated, single sidebar, or multiple sidebars
 *
 * 侧边栏配置
 * 可以是自动生成、单个侧边栏或多个侧边栏
 */
export type ThemeSidebar = 'auto' | (string | ThemeSidebarItem)[] | ThemeSidebarMulti

/**
 * Multi-sidebar configuration
 * Maps paths to different sidebar configurations
 *
 * 多侧边栏配置
 * 将路径映射到不同的侧边栏配置
 */
export type ThemeSidebarMulti = Record<
  string,
  | 'auto'
  | (string | ThemeSidebarItem)[]
  | { items: 'auto' | (string | ThemeSidebarItem)[], prefix?: string }
>

/**
 * Sidebar item configuration
 * Defines a single item in the sidebar
 *
 * 侧边栏项
 * 定义侧边栏中的单个项目
 */
export interface ThemeSidebarItem {
  /**
   * Sidebar item text
   * 侧边栏文本
   */
  text?: string

  /**
   * Sidebar item link
   * 侧边栏链接
   */
  link?: string

  /**
   * Sidebar item icon
   * 侧边栏图标
   */
  icon?: ThemeIcon

  /**
   * Sidebar item badge
   * 侧边栏徽章
   */
  badge?: string | ThemeBadge

  /**
   * Child sidebar items
   * 次级侧边栏分组
   */
  items?: 'auto' | (string | ThemeSidebarItem)[]

  /**
   * Whether the group is collapsible
   * - If not specified, group is not collapsible
   * - If `true`, group is collapsible and collapsed by default
   * - If `false`, group is collapsible but expanded by default
   *
   * 如果未指定，组不可折叠
   * 如果为`true`，组可折叠，并默认折叠
   * 如果为`false`，组可折叠，但默认展开
   */
  collapsed?: boolean

  /**
   * Link prefix for current group
   * 当前分组的链接前缀
   */
  prefix?: string

  /**
   * @deprecated Use `prefix` instead / 使用 `prefix` 替代
   */
  dir?: string

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
}
