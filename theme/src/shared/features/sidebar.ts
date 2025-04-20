import type { ThemeBadge, ThemeIcon } from '../common/index.js'

export type ThemeSidebar = 'auto' | (string | ThemeSidebarItem)[] | ThemeSidebarMulti

export type ThemeSidebarMulti = Record<
  string,
  | 'auto'
  | (string | ThemeSidebarItem)[]
  | { items: 'auto' | (string | ThemeSidebarItem)[], prefix?: string }
>

export interface ThemeSidebarItem {
  /**
   * 侧边栏文本
   */
  text?: string

  /**
   * 侧边栏链接
   */
  link?: string

  /**
   * 侧边栏图标
   */
  icon?: ThemeIcon

  /**
   * 侧边栏徽章
   */
  badge?: string | ThemeBadge

  /**
   * 次级侧边栏分组
   */
  items?: 'auto' | (string | ThemeSidebarItem)[]

  /**
   * 如果未指定，组不可折叠。
   *
   * 如果为`true`，组可折叠，并默认折叠。
   *
   * 如果为`false`，组可折叠，但默认展开。
   */
  collapsed?: boolean

  /**
   * 当前分组的链接前缀
   */
  prefix?: string

  /**
   * @deprecated 使用 `prefix` 替代
   */
  dir?: string

  rel?: string
  target?: string
}
