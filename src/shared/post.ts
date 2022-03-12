import type { PageFrontmatter } from 'vuepress'
import type { PlumeThemePostPageFrontmatter } from './page'

export interface CategoryItem {
  type: number | string
  name: string
}

export interface PostItemIndex {
  title: string
  path: string
  frontmatter: PageFrontmatter<PlumeThemePostPageFrontmatter>
  excerpt: string
  category: CategoryItem[]
}

export type PostIndex = PostItemIndex[]
