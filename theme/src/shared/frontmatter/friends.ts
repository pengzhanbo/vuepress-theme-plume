import type { SocialLink } from '../base.js'

export interface FriendsItem {
  name: string
  link: string
  avatar?: string
  desc?: string
  socials?: SocialLink[]
  backgroundColor?: string | { light: string, dark: string }
  color?: string | { light: string, dark: string }
  nameColor?: string | { light: string, dark: string }
}

export interface FriendGroup {
  title?: string
  desc?: string
  list?: FriendsItem[]
}

export interface PlumeThemeFriendsFrontmatter {
  friends: boolean
  title?: string
  description?: string
  list?: FriendsItem[]
  groups?: FriendGroup[]
}
