export type NavItem = NavItemWithLink | NavItemWithChildren

export interface NavItemWithLink {
  text: string
  link: string
  icon?: string | { svg: string }
  rel?: string
  target?: string

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string
}

export interface NavItemChildren {
  text?: string
  icon?: string | { svg: string }
  items: NavItemWithLink[]
}

export interface NavItemWithChildren {
  text?: string
  icon?: string | { svg: string }
  items: (NavItemChildren | NavItemWithLink)[]

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string
}
