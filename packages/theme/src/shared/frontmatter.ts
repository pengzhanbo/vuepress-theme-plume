export interface PlumeThemeHomeFrontmatter {
  home?: true
}

export interface PlumeThemePostFrontmatter {
  createTime?: string
  author?: string
  tags?: string[]
  sticky?: boolean | number
  article?: boolean
  banner?: string
  bgBanner?: string
}

export interface PlumeThemeNoteFrontmatter {
  createTime?: string
}
