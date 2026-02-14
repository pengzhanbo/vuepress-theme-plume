import type { ThemeBadge, ThemeIcon } from '../common/index.js'

/**
 * Resolved sidebar for internal theme use
 * Processed sidebar configuration ready for rendering
 *
 * 已解析的侧边栏
 * 已处理的侧边栏配置，准备用于渲染
 * @internal
 */
export type ResolvedSidebar = ResolvedSidebarItem[] | ResolvedSidebarMulti

/**
 * Resolved multiple sidebars for internal theme use
 * Maps paths to resolved sidebar items
 *
 * 已解析的多个侧边栏
 * 将路径映射到已解析的侧边栏项目
 * @internal
 */
export type ResolvedSidebarMulti = Record<
  string,
  ResolvedSidebarItem[] | { items: ResolvedSidebarItem[] }
>

/**
 * Resolved sidebar item for internal theme use
 * Processed sidebar item ready for rendering
 *
 * 已解析的侧边栏子项
 * 已处理的侧边栏项目，准备用于渲染
 * @internal
 */
export interface ResolvedSidebarItem {
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
  items?: ResolvedSidebarItem[]

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
