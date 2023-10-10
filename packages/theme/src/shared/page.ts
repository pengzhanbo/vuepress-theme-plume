export interface PlumeThemePageData {
  git: {
    createTime: number
    updateTime: number
  }
  isBlogPost: boolean
  type: 'blog' | 'product'
  categoryList?: PageCategoryData[]
}

export interface PageCategoryData {
  type: string | number
  name: string
}
