import type { NavItemWithLink, PlumeThemeImage } from '.'

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

export interface PlumeThemeHomeHero extends PlumeHomeConfigBase {
  type: 'hero'
  hero: PlumeThemeHero
  full?: boolean
  background?: 'filter-blur' | (string & { zz_IGNORE?: never })
  filter?: string
}

export interface PlumeThemeHomeTextImage extends PlumeHomeConfigBase {
  type: 'text-image' | 'image-text'
  image: PlumeThemeImage
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
  avatar?: PlumeThemeImage
  circle?: boolean
}

export interface PlumeThemeHomeCustom extends PlumeHomeConfigBase {
  type: 'custom'
}

/* =============================== Home end ==================================== */

export interface PlumeThemePageFrontmatter {
  comments?: boolean
  editLink?: boolean
  editLinkPattern?: string
  lastUpdated?: boolean
  contributors?: boolean
  prev?: string | NavItemWithLink
  next?: string | NavItemWithLink
  backToTop?: boolean
  externalLink?: boolean
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
}

export interface PlumeThemeFriendsFrontmatter {
  friends: boolean
  title?: string
  description?: string
  list?: FriendsItem[]
}
