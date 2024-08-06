import type { ThemeIcon } from './base.js'

export type NavItem = string | NavItemWithLink | NavItemWithChildren

export interface NavItemWithLink {
  /**
   * 导航文本
   */
  text: string
  /**
   * 导航链接
   */
  link: string
  /**
   * 导航图标
   */
  icon?: ThemeIcon

  prefix?: never
  items?: never

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string
  rel?: string
  target?: string
  noIcon?: boolean
}

export interface NavItemChildren {
  /**
   * 下拉菜单的文本
   */
  text?: string

  /**
   *
   * 当前分组的页面前缀
   */
  prefix?: string

  /**
   * 导航图标
   */
  icon?: ThemeIcon

  /**
   * 导航栏下拉菜单
   */
  items: (string | NavItemWithLink)[]
}

export interface NavItemWithChildren {
  text?: string
  /**
   * 当前分组的页面前缀
   */
  prefix?: string

  /**
   * 导航图标
   */
  icon?: ThemeIcon

  /**
   * 导航栏下拉菜单
   */
  items: (string | NavItemChildren | NavItemWithLink)[]

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   *
   * `activeMatch` 应为正则表达式字符串，但必须将其定义为字符串。
   * 我们不能在这里使用实际的 RegExp 对象，因为它在构建期间不可序列化。
   */
  activeMatch?: string
}
