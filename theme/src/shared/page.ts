import type { GitPluginPageData } from '@vuepress/plugin-git'

interface ReadingTime {
  /** 分钟数 */
  minutes: number
  /** 字数 */
  words: number
}

export interface PlumeThemePageData extends GitPluginPageData {
  isBlogPost: boolean
  type: 'blog' | 'friends' | 'blog-tags' | 'blog-archives'
  categoryList?: PageCategoryData[]
  filePathRelative: string | null
  readingTime?: ReadingTime
}

export interface PageCategoryData {
  type: string | number
  name: string
}
