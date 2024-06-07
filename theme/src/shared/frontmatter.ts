import type { WatermarkPluginFrontmatter } from '@vuepress/plugin-watermark'
import type { ThemeImage, ThemeOutline } from './base.js'
import type { NavItemWithLink } from './options/navbar.js'

/* =============================== Home begin ==================================== */
export interface PlumeThemeHomeFrontmatter extends Omit<PlumeThemeHomeBanner, 'type'> {
  home?: true
  config?: PlumeThemeHomeConfig[]
}

export type PlumeThemeHomeConfig = PlumeThemeHomeBanner | PlumeThemeHomeTextImage | PlumeThemeHomeFeatures | PlumeThemeHomeProfile

export interface PlumeThemeHero {
  name: string
  tagline?: string
  text?: string
  actions: PlumeThemeHeroAction[]
}

export interface PlumeThemeHeroAction {
  theme?: 'brand' | 'alt'
  text: string
  link?: string
}

export interface PlumeHomeConfigBase {
  type: 'banner' | 'hero' | 'text-image' | 'image-text' | 'features' | 'profile' | 'custom'
  full?: boolean
  backgroundImage?: string | { light: string, dark: string }
  backgroundAttachment?: 'fixed' | 'local'
  onlyOnce?: boolean
}

export interface PlumeThemeHomeBanner extends Pick<PlumeHomeConfigBase, 'type' | 'onlyOnce' | 'full'> {
  type: 'banner'
  banner?: string
  bannerMask?: number | { light?: number, dark?: number }
  hero: PlumeThemeHero
}

export interface PlumeThemeHomeHeroTintPlate {
  r: { value: number, offset: number }
  g: { value: number, offset: number }
  b: { value: number, offset: number }
}

export interface PlumeThemeHomeHero extends PlumeHomeConfigBase {
  type: 'hero'
  hero: PlumeThemeHero
  full?: boolean
  background?: 'tint-plate' | (string & { zz_IGNORE?: never })
  tintPlate?:
    | string | number
    | { light?: string | number, dark?: string | number }
    | PlumeThemeHomeHeroTintPlate
    | { light?: PlumeThemeHomeHeroTintPlate, dark?: PlumeThemeHomeHeroTintPlate }
  filter?: string
}

export interface PlumeThemeHomeTextImage extends PlumeHomeConfigBase {
  type: 'text-image' | 'image-text'
  image: ThemeImage
  width?: number | string
  title?: string
  description?: string
  list: (string | { title?: string, description?: string })[]
}

export interface PlumeThemeHomeFeatures extends PlumeHomeConfigBase {
  type: 'features'
  title?: string
  description?: string
  features: PlumeThemeHomeFeature[]
}

export interface PlumeThemeHomeFeature {
  icon?: FeatureIcon
  title: string
  details?: string
  link?: string
  linkText?: string
  rel?: string
  target?: string
}

export type FeatureIcon = string | {
  src: string
  alt?: string | undefined
  width?: string | undefined
  height?: string | undefined
  wrap?: boolean | undefined
} | {
  light: string
  dark: string
  alt?: string | undefined
  width?: string | undefined
  height?: string | undefined
  wrap?: boolean | undefined
}

export interface PlumeThemeHomeProfile extends PlumeHomeConfigBase {
  type: 'profile'
  name?: string
  description?: string
  avatar?: ThemeImage
  circle?: boolean
}

export interface PlumeThemeHomeCustom extends PlumeHomeConfigBase {
  type: 'custom'
}

/* =============================== Home end ==================================== */

export interface PlumeThemePageFrontmatter {
  home?: false
  comments?: boolean
  editLink?: boolean
  editLinkPattern?: string
  lastUpdated?: boolean
  contributors?: boolean
  prev?: string | NavItemWithLink
  next?: string | NavItemWithLink
  sidebar?: string | false
  aside?: boolean
  outline?: ThemeOutline
  backToTop?: boolean
  externalLink?: boolean
  readingTime?: boolean
  watermark?: WatermarkPluginFrontmatter['watermark'] & { fullPage?: boolean }
}

export interface PlumeThemePostFrontmatter extends PlumeThemePageFrontmatter {
  createTime?: string
  author?: string
  tags?: string[]
  sticky?: boolean | number
  article?: boolean
}

export interface PlumeThemeNoteFrontmatter extends PlumeThemePageFrontmatter {
  createTime?: string
}

export interface FriendsItem {
  name: string
  link: string
  avatar?: string
  desc?: string
  backgroundColor?: string | { light: string, dark: string }
  color?: string | { light: string, dark: string }
  nameColor?: string | { light: string, dark: string }
  borderColor?: string | { light: string, dark: string }
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
