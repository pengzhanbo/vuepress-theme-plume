import type { ThemeBadge, ThemeIcon } from '../common/index.js'

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
  badge?: string | ThemeBadge
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
  badge?: string | ThemeBadge
  items: ResolvedNavItemWithLink[]
}

/**
 * 主题内部使用的已解析的导航子项
 * @internal
 */
export interface ResolvedNavItemWithChildren {
  text?: string
  icon?: ThemeIcon
  badge?: string | ThemeBadge
  items: (ResolvedNavItemChildren | ResolvedNavItemWithLink)[]
  activeMatch?: string
}
