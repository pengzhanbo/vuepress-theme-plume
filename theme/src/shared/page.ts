import type { GitPluginPageData } from '@vuepress/plugin-git'

export interface PlumeThemePageData extends GitPluginPageData {
  isBlogPost: boolean
  type: 'blog' | 'product'
  categoryList?: PageCategoryData[]
  filePathRelative: string | null
}

export interface PageCategoryData {
  type: string | number
  name: string
}
