import type { SocialLink } from '../base.js'
import type { PlumeNormalFrontmatter } from './normal.js'

export interface FriendsItem {
  name: string
  link: string
  avatar?: string
  desc?: string
  location?: string
  organization?: string
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

export interface PlumeThemeFriendsFrontmatter extends PlumeNormalFrontmatter {
  friends: boolean
  title?: string
  description?: string
  list?: FriendsItem[]
  groups?: FriendGroup[]
}
