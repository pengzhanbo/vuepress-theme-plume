import type { ThemeImage } from '../base.js'
import type { PlumeNormalFrontmatter } from './normal.js'

export interface PlumeThemeHomeFrontmatter extends PlumeNormalFrontmatter, Omit<PlumeThemeHomeBanner, 'type'> {
  home?: true
  friends?: never
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
  target?: string
  rel?: string
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
  alt?: string
  width?: string
  height?: string
  wrap?: boolean
} | {
  light: string
  dark: string
  alt?: string
  width?: string
  height?: string
  wrap?: boolean
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
