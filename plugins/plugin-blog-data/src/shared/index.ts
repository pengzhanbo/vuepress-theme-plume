import type { Page } from '@vuepress/core'

export interface BlogDataPluginOptions {
  include?: string | string[]
  exclude?: string | string[]
  sortBy?: 'createTime' | false | (<T>(prev: T, next: T) => boolean)
  excerpt?: boolean
  extendBlogData?: <T = any>(page: T) => Record<string, any>
  pageFilter?: (page: Page) => boolean
}

export type BlogPostData<T extends object = object> = BlogPostDataItem<T>[]

export type BlogPostDataItem<T extends object = object> = {
  path: string
  title: string
  excerpt: string
  [x: string]: any
} & T
