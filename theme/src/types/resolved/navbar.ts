import type { ThemeIcon } from '../common/index.js'

/**
 * 主题内部使用的已解析的导航项
 * @internal
 */
export type ResolvedNavItem =
  | ResolvedNavItemWithLink
  | ResolvedNavItemWithChildren

/**
 * 主题内部使用的已解析的导航子项
 * @internal
 */
export interface ResolvedNavItemWithLink {
  text: string
  link: string
  icon?: ThemeIcon
  items?: never
  activeMatch?: string
  rel?: string
  target?: string
  noIcon?: boolean
}

/**
 * 主题内部使用的已解析的导航子项
 * @internal
 */
export interface ResolvedNavItemChildren {
  text?: string
  icon?: ThemeIcon
  items: ResolvedNavItemWithLink[]
}

/**
 * 主题内部使用的已解析的导航子项
 * @internal
 */
export interface ResolvedNavItemWithChildren {
  text?: string
  icon?: ThemeIcon
  items: (ResolvedNavItemChildren | ResolvedNavItemWithLink)[]
  activeMatch?: string
}
