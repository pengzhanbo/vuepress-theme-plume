export interface PlumeThemeHomeFrontmatter {
  home?: true
  banner?: string
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
export interface PlumeThemePostFrontmatter {
  createTime?: string
  author?: string
  tags?: string[]
  sticky?: boolean | number
  article?: boolean
  banner?: string
}

export interface PlumeThemeNoteFrontmatter {
  createTime?: string
}
