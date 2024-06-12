import type { WatermarkPluginFrontmatter } from '@vuepress/plugin-watermark'
import type { ThemeOutline } from '../base.js'
import type { NavItemWithLink } from '../navbar.js'

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
