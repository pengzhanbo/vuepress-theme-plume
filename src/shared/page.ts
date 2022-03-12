import type { GitPluginPageData } from '@vuepress/plugin-git'
import type { NavLink, SidebarConfig } from './nav'
import type { CategoryItem } from './post'

export interface PlumeThemePageData extends GitPluginPageData {
  filePathRelative: string | null
  category: CategoryItem[]
  sort: number
  isPost: boolean
}

export interface PlumeThemePageFrontmatter {
  home?: boolean
  navbar?: boolean
  pageClass?: string
  pageType?: string
}

export interface PlumeThemeHomePageFrontmatter
  extends PlumeThemePageFrontmatter {
  home: true
}

export interface PlumeThemePostPageFrontmatter
  extends PlumeThemePageFrontmatter {
  home?: false
  editLink?: boolean
  editLinkPattern?: string
  lastUpdated?: boolean
  contributors?: boolean
  sidebar?: 'auto' | false | SidebarConfig
  sidebarDepth?: number
  prev?: string | NavLink
  next?: string | NavLink
  createTime: string
  author: string
  top: boolean
  type: string
  sort: number | string
  tags: string[]
}
