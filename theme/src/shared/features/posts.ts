import type { ReadingTime } from '@vuepress/plugin-reading-time'

/**
 * Posts category item
 * Represents a category for blog posts
 *
 * 文章分类项
 * 表示博客文章的分类
 */
export interface PostsCategoryItem {
  /**
   * Category ID
   * 分类 ID
   */
  id: string
  /**
   * Category sort order
   * 分类排序
   */
  sort: number
  /**
   * Category name
   * 分类名称
   */
  name: string
}

/**
 * Posts cover layout
 * Defines the position of post cover images
 *
 * 文章封面图布局
 * 定义文章封面图的位置
 */
export type PostsCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

/**
 * Posts cover style
 * Configuration for post cover image appearance
 *
 * 文章封面图样式
 * 文章封面图外观配置
 */
export interface PostsCoverStyle {
  /**
   * Cover image position/layout
   * 文章封面图的位置
   */
  layout?: PostsCoverLayout
  /**
   * Cover image aspect ratio
   * 文章封面图的比例
   * @default '4:3'
   */
  ratio?: number | `${number}:${number}` | `${number}/${number}`

  /**
   * Cover image width, only effective when layout is 'left' or 'right'
   * 封面图的宽度, 仅在 layout 为 'left' 或 'right' 时生效
   * @default 240
   */
  width?: number
  /**
   * Whether to use compact mode where cover image touches container edges
   * 是否使用紧凑模式，紧凑模式下，封面图紧贴容器边缘
   * @default false
   */
  compact?: boolean
}

/**
 * Blog post item
 * Represents a single blog post with all its metadata
 *
 * 博客文章
 * 表示单个博客文章及其所有元数据
 */
export interface ThemePostsItem {
  /**
   * Article title
   * 文章标题
   */
  title: string
  /**
   * Article excerpt/summary
   * 文章摘要
   */
  excerpt: string
  /**
   * Article path/URL
   * 文章路径
   */
  path: string
  /**
   * Article tags
   * 文章标签
   */
  tags?: string[]
  /**
   * Whether article is pinned, number indicates priority
   * 文章是否置顶，数字表示置顶的优先级
   * @default false
   */
  sticky?: boolean | number
  /**
   * Article categories
   * 文章所属分类
   */
  categoryList?: PostsCategoryItem[]
  /**
   * Article creation time
   * 文章创建时间
   */
  createTime: string
  /**
   * Article language
   * 文章语言
   */
  lang: string
  /**
   * Whether article is encrypted
   * 文章是否加密
   */
  encrypt?: boolean
  /**
   * Article cover image URL
   * 文章封面图
   */
  cover?: string
  /**
   * Article cover image style
   * 文章封面图样式
   */
  coverStyle?: PostsCoverStyle

  /**
   * Is article draft
   * 文章是否为草稿
   */
  draft?: boolean

  /**
   * Reading statistics
   * 阅读统计
   */
  readingTime?: ReadingTime
}

/**
 * Blog post list
 * Array of blog post items
 *
 * 博客文章列表
 * 博客文章项的数组
 */
export type ThemePosts = ThemePostsItem[]
