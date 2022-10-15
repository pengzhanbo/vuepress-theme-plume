import type { PlumeThemeNormalFrontmatter } from './normal.js'

export interface PlumeThemeProductItem {
  link?: string
  text: string
  description?: string
  logo?: string
}

export type PlumeThemeProductList = PlumeThemeProductItem[]

export interface PlumeThemeHomeFrontmatter extends PlumeThemeNormalFrontmatter {
  home?: true
  banner?: string
  mobileBanner?: string
  productList?: PlumeThemeProductList
  motto?: string
}
