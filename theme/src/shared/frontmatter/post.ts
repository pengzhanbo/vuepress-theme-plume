import type { CopyrightLicense, CopyrightOptions, PostsCoverStyle } from '../features/index.js'
import type { ThemePageFrontmatter } from './page.js'

/**
 * Post/Blog page frontmatter
 *
 * 文章/博客页面 frontmatter
 */
export interface ThemePostFrontmatter extends ThemePageFrontmatter {
  /**
   * Creation time
   *
   * 创建时间
   */
  createTime?: string | false

  /**
   * Article tags
   *
   * 文章标签
   */
  tags?: string[]

  /**
   * Sticky post
   *
   * 是否置顶
   */
  sticky?: boolean | number
  /**
   * Mark current article as blog post
   *
   * `false` 时，从博客列表中排除
   *
   * @default true
   */
  article?: boolean

  /**
   * Mark current article as draft
   * Draft posts will not appear in blog list
   *
   * 标记当前文章是否为草稿状态，
   * 草稿状态下的文章不会出现在博客列表中
   *
   * @default false
   */
  draft?: boolean

  /**
   * Article cover image
   *
   * 文章封面图
   */
  cover?: string

  /**
   * Article cover style
   *
   * 文章封面图样式
   */
  coverStyle?: PostsCoverStyle

  /**
   * Whether to show article excerpt, when passing string it will be custom excerpt, then `<!-- more -->` is invalid
   *
   * 是否展示文章摘要，传入 string 时为自定义摘要，此时 `<!-- more -->` 无效
   */
  excerpt?: boolean | string

  /**
   * Copyright information
   *
   * 版权信息
   */
  copyright?: boolean | CopyrightLicense | CopyrightFrontmatter

  /**
   * Article encryption password
   *
   * 文章加密密码
   */
  password?: string | string[]

  /**
   * Article encryption password hint text
   *
   * 文章加密密码提示文本
   */
  passwordHint?: string
}

/**
 * Copyright frontmatter
 *
 * 版权 frontmatter
 */
export interface CopyrightFrontmatter extends CopyrightOptions {
  /**
   * 作品的作者
   *
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
