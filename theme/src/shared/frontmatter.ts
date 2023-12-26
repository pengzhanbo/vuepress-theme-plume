import type { NavItemWithLink } from ".";

export interface PlumeThemeHomeFrontmatter {
  home?: true
  banner?: string
  bannerMask?: number | { light?: number; dark?: number }
  hero: {
    name: string
    tagline?: string
    text?: string
    actions: PlumeThemeHeroAction[]
  }
}

export interface PlumeThemeHeroAction {
  theme?: 'brand' | 'alt'
  text: string
  link?: string
}

export interface PlumeThemePageFrontmatter {
  editLink?: boolean
  editLinkPattern?: string
  lastUpdated?: boolean
  contributors?: boolean
  prev?: string | NavItemWithLink
  next?: string | NavItemWithLink
}

export interface PlumeThemePostFrontmatter extends PlumeThemePageFrontmatter {
  createTime?: string
  author?: string
  tags?: string[]
  sticky?: boolean | number
  article?: boolean
  banner?: string
}

export interface PlumeThemeNoteFrontmatter extends PlumeThemePageFrontmatter {
  createTime?: string
}

export interface FriendsItem {
  name: string
  link: string
  avatar?: string
  desc?: string
}

export interface PlumeThemeFriendsFrontmatter {
  friends: boolean
  title?: string
  description?: string
  list?: FriendsItem[]
}
