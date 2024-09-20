import type { BlogPostCover } from 'vuepress-theme-plume'
import type { PlumeThemePageFrontmatter } from './page.js'

export interface PlumeThemePostFrontmatter extends PlumeThemePageFrontmatter {
  createTime?: string
  author?: string
  tags?: string[]
  sticky?: boolean | number
  /**
   * @deprecated 使用 `draft` 代替
   */
  article?: boolean

  /**
   * 标记当前文章是否为草稿状态，
   * 草稿状态下的文章不会出现在博客列表中
   *
   * @default false
   */
  draft?: boolean

  /**
   * 文章封面图
   */
  cover?: string | BlogPostCover
}
