export type NavItem = NavItemWithLink | NavItemWithChildren

export interface NavItemWithLink {
  text: string
  link: string
  icon?: string

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string
}

export interface NavItemChildren {
  text?: string
  icon?: string
  items: NavItemWithLink[]
}

export interface NavItemWithChildren {
  text?: string
  icon?: string
  items: (NavItemChildren | NavItemWithLink)[]

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string
}
