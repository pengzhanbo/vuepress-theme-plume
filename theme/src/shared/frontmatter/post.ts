import type { BlogPostCover } from '../blog.js'
import type { PlumeThemePageFrontmatter } from './page.js'

export interface PlumeThemePostFrontmatter extends PlumeThemePageFrontmatter {
  /**
   * 创建时间
   */
  createTime?: string

  /**
   * 文章标签
   */
  tags?: string[]

  /**
   * 是否置顶
   */
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

  /**
   * 是否展示文章摘要，传入 string 时为自定义摘要，此时 `<!-- more -->` 无效
   */
  excerpt?: boolean | string
}
