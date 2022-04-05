export interface CategoryItem {
  type: number | string
  name: string
}

export type CategoryData = CategoryItem[]

export interface PostItem {
  title: string
  path: string
  excerpt: string
  tags: string[]
  createTime: string
  author: string
  sticky?: boolean | number
  article?: boolean
  category: CategoryData
  isNote?: boolean
}

export type PostIndex = PostItem[]
