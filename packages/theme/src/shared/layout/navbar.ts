export interface NavItem {
  text: string
  ariaLabel?: string
}

export interface NavGroup<T> extends NavItem {
  children: T[]
}

export interface NavLink extends NavItem {
  link: string
  rel?: string
  target?: string
  activeMatch?: string
}

export type NavbarItem = NavLink

export type NavbarGroup = NavGroup<NavbarGroup | NavbarItem | string>

export type NavbarConfig = (NavbarItem | NavbarGroup | string)[]
export type ResolveNavbarItem = NavbarItem | NavGroup<ResolveNavbarItem>
