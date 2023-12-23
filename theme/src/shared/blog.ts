import type { BlogPostDataItem } from '@vuepress-plume/plugin-blog-data'
import type { PageCategoryData } from './page.js'

export interface PlumeThemeBlogPostItem extends BlogPostDataItem {
  tags: string[]
  sticky: boolean
  categoryLost: PageCategoryData[]
  createTime: string
}

export type PlumeThemeBlogPostData = PlumeThemeBlogPostItem[]
