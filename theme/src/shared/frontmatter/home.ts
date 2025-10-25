import type { ThemeImage, ThemeLightDark } from '../common/index.js'
import type { LiteralUnion } from '../utils.js'
import type { ThemeHomeHeroEffect, ThemeHomeHeroEffectConfig, ThemeHomeHeroTintPlate } from './homeHeroEffects.js'
import type { ThemeNormalFrontmatter } from './normal.js'

export interface ThemeHomeFrontmatter extends ThemeNormalFrontmatter, Omit<ThemeHomeBanner, 'type'> {
  home?: true
  friends?: never
  config?: ThemeHomeConfig[]
}

export type ThemeHomeConfig = ThemeHomeBanner | ThemeHomeTextImage | ThemeHomeFeatures | ThemeHomeProfile | ThemeHomeHero | ThemeHomePosts

export interface ThemeHomeConfigBase {
  type: 'banner' | 'hero' | 'doc-hero' | 'text-image' | 'image-text' | 'features' | 'profile' | 'custom' | 'posts'
  full?: boolean
  backgroundImage?: ThemeLightDark<string>
  backgroundAttachment?: 'fixed' | 'local'
  onlyOnce?: boolean
  index: number
}

export interface ThemeHero {
  name: string
  tagline?: string
  text?: string
  actions: ThemeHeroAction[]
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

export interface ThemeDocHero extends ThemeHero {
  image?: ThemeImage
}

export interface ThemeHomeBanner extends Pick<ThemeHomeConfigBase, 'type' | 'onlyOnce' | 'full'> {
  type: 'banner'
  banner?: string
  bannerMask?: ThemeLightDark<number>
  hero: ThemeHero
}

export interface ThemeHomeHero extends ThemeHomeConfigBase {
  type: 'hero'
  hero: ThemeHero
  full?: boolean
  /** @deprecated use `effect` instead */
  background?: LiteralUnion<'tint-plate'>
  /** @deprecated use `effectConfig` instead */
  tintPlate?: ThemeHomeHeroTintPlate
  effect?: ThemeHomeHeroEffect
  effectConfig?: ThemeHomeHeroEffectConfig
  filter?: string
  forceDark?: boolean
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

export interface ThemeHomePosts extends ThemeHomeConfigBase {
  type: 'posts'
  collection?: string
}
