export type NavItem = NavItemWithLink | NavItemWithChildren

export type NavItemWithLink = {
  text: string
  link: string
  icon?: string

  /**
   * `activeMatch` is expected to be a regex string. We can't use actual
   * RegExp object here because it isn't serializable
   */
  activeMatch?: string
}

export type NavItemChildren = {
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
