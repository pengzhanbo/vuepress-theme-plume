import type { PlumeThemePageFrontmatter } from './page.js'

export interface PlumeThemePostFrontmatter extends PlumeThemePageFrontmatter {
  createTime?: string
  author?: string
  tags?: string[]
  sticky?: boolean | number
  article?: boolean
}
