import type { ThemeIcon } from '../base.js'

export type ResolvedNavItem =
  | ResolvedNavItemWithLink
  | ResolvedNavItemWithChildren

export interface ResolvedNavItemWithLink {
  text: string
  link: string
  icon?: ThemeIcon
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

export interface ResolvedNavItemChildren {
  text?: string
  icon?: ThemeIcon
  items: ResolvedNavItemWithLink[]
}

export interface ResolvedNavItemWithChildren {
  text?: string
  icon?: ThemeIcon
  items: (ResolvedNavItemChildren | ResolvedNavItemWithLink)[]

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string
}
