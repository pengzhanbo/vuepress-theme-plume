import type { BlogPostCover, CopyrightLicense } from '../base.js'
import type { CopyrightOptions } from '../options/copyright.js'
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

  /**
   * 版权信息
   */
  copyright?: boolean | CopyrightLicense | CopyrightFrontmatter
}

export interface CopyrightFrontmatter extends CopyrightOptions {
  /**
   * 作品的作者
   *
   * 如果是 原创，则默认为 contributors 中的第一个，否则需要手动指定
   * @default ''
   */
  author?: string | { name: string, url?: string }

  /**
   * 作品的创作方式
   * @default 'original'
   */
  creation?: 'original' | 'translate' | 'reprint'

  /**
   * 原文地址，非 原创 作品时需要声明原文地址
   * @default ''
   */
  source?: string
}
