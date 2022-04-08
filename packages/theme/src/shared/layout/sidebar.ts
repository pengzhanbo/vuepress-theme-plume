export interface SidebarItem {
  text: string
  link?: string
  children: SidebarOptions
}

export type SidebarOptions = SidebarItem[]
