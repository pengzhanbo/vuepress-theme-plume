export type PlumeThemePageData = {
  git: {
    createTime: number
    updateTime: number
  }
  isBlogPost: boolean
  type: 'blog' | 'product'
  categoryList?: PageCategoryData[]
}

export type PageCategoryData = {
  type: string | number
  name: string
}
