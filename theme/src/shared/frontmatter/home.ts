import type { ThemeImage } from '../common/index.js'
import type { ThemeNormalFrontmatter } from './normal.js'

export interface ThemeHomeFrontmatter extends ThemeNormalFrontmatter, Omit<ThemeHomeBanner, 'type'> {
  home?: true
  friends?: never
  config?: ThemeHomeConfig[]
}

export type ThemeHomeConfig = ThemeHomeBanner | ThemeHomeTextImage | ThemeHomeFeatures | ThemeHomeProfile | ThemeHomeHero

export interface ThemeHero {
  name: string
  tagline?: string
  text?: string
  actions: ThemeHeroAction[]
}

export interface ThemeDocHero extends ThemeHero {
  image?: ThemeImage
}

export interface ThemeHeroAction {
  theme?: 'brand' | 'alt'
  text: string
  link?: string
  target?: string
  rel?: string
  icon?: string
  suffixIcon?: string
}

export interface ThemeHomeConfigBase {
  type: 'banner' | 'hero' | 'doc-hero' | 'text-image' | 'image-text' | 'features' | 'profile' | 'custom'
  full?: boolean
  backgroundImage?: string | { light: string, dark: string }
  backgroundAttachment?: 'fixed' | 'local'
  onlyOnce?: boolean
}

export interface ThemeHomeBanner extends Pick<ThemeHomeConfigBase, 'type' | 'onlyOnce' | 'full'> {
  type: 'banner'
  banner?: string
  bannerMask?: number | { light?: number, dark?: number }
  hero: ThemeHero
}

export interface PlumeThemeHomeHeroTintPlate {
  r: { value: number, offset: number }
  g: { value: number, offset: number }
  b: { value: number, offset: number }
}

export interface ThemeHomeHero extends ThemeHomeConfigBase {
  type: 'hero'
  hero: ThemeHero
  full?: boolean
  background?: 'tint-plate' | (string & { zz_IGNORE?: never })
  tintPlate?:
    | string | number
    | { light?: string | number, dark?: string | number }
    | PlumeThemeHomeHeroTintPlate
    | { light?: PlumeThemeHomeHeroTintPlate, dark?: PlumeThemeHomeHeroTintPlate }
  filter?: string
}

export interface ThemeHomeDocHero extends ThemeHomeConfigBase {
  type: 'doc-hero'
  hero: ThemeDocHero
}

export interface ThemeHomeTextImage extends ThemeHomeConfigBase {
  type: 'text-image' | 'image-text'
  image: ThemeImage
  width?: number | string
  title?: string
  description?: string
  list: (string | { title?: string, description?: string })[]
}

export interface ThemeHomeFeatures extends ThemeHomeConfigBase {
  type: 'features'
  title?: string
  description?: string
  features: ThemeHomeFeature[]
}

export interface ThemeHomeFeature {
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
  width?: string | number
  height?: string | number
  wrap?: boolean
} | {
  light: string
  dark: string
  alt?: string
  width?: string | number
  height?: string | number
  wrap?: boolean
}

export interface ThemeHomeProfile extends ThemeHomeConfigBase {
  type: 'profile'
  name?: string
  description?: string
  avatar?: ThemeImage
  circle?: boolean
}

export interface ThemeHomeCustom extends ThemeHomeConfigBase {
  type: 'custom'
}
