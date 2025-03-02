import type { GitPluginPageData } from '@vuepress/plugin-git'
import type { BlogPostCoverStyle } from './base.js'

interface ReadingTime {
  /** 分钟数 */
  minutes: number
  /** 字数 */
  words: number
}

export interface PlumeThemePageData extends GitPluginPageData {
  type: 'blog' | 'friends' | 'blog-tags' | 'blog-archives' | 'blog-categories'
  categoryList?: PageCategoryData[]
  filePathRelative: string | null
  readingTime?: ReadingTime
  bulletin?: boolean
}

export interface PageCategoryData {
  id: string
  sort: number
  name: string
}

export interface PlumeThemeBlogPostItem {
  title: string
  excerpt: string
  path: string
  tags?: string[]
  sticky?: boolean | number
  categoryList?: PageCategoryData[]
  createTime: string
  lang: string
  encrypt?: boolean
  cover?: string
  coverStyle?: BlogPostCoverStyle
}

export type PlumeThemeBlogPostData = PlumeThemeBlogPostItem[]
