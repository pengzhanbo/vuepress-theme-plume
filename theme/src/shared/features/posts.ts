import type { ReadingTime } from '@vuepress/plugin-reading-time'

export interface PostsCategoryItem {
  /**
   * 分类 ID
   */
  id: string
  /**
   * 分类排序
   */
  sort: number
  /**
   * 分类名称
   */
  name: string
}

/**
 * 文章封面图布局
 */
export type PostsCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

/**
 * 文章封面图样式
 */
export interface PostsCoverStyle {
  /**
   * 文章封面图的位置
   */
  layout?: PostsCoverLayout
  /**
   * 文章封面图的比例
   *
   * @default '4:3'
   */
  ratio?: number | `${number}:${number}` | `${number}/${number}`

  /**
   * 封面图的宽度, 仅在 layout 为 'left' 或 'right' 时生效
   *
   * @default 240
   */
  width?: number
  /**
   * 是否使用紧凑模式，紧凑模式下，封面图紧贴容器边缘
   * @default false
   */
  compact?: boolean
}

/**
 * 博客文章
 */
export interface ThemePostsItem {
  /**
   * 文章标题
   */
  title: string
  /**
   * 文章摘要
   */
  excerpt: string
  /**
   * 文章路径
   */
  path: string
  /**
   * 文章标签
   */
  tags?: string[]
  /**
   * 文章是否置顶，数字表示置顶的优先级
   * @default false
   */
  sticky?: boolean | number
  /**
   * 文章所属分类
   */
  categoryList?: PostsCategoryItem[]
  /**
   * 文章创建时间
   */
  createTime: string
  /**
   * 文章语言
   */
  lang: string
  /**
   * 文章是否加密
   */
  encrypt?: boolean
  /**
   * 文章封面图
   */
  cover?: string
  /**
   * 文章封面图样式
   */
  coverStyle?: PostsCoverStyle

  /**
   * 文章是否为草稿
   */
  draft?: boolean

  /**
   * 阅读统计
   */
  readingTime?: ReadingTime
}

/**
 * 博客文章列表
 */
export type ThemePosts = ThemePostsItem[]
