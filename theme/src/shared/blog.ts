import type { PageCategoryData } from './page-data.js'

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
  cover?: string | BlogPostCover
}

export type PlumeThemeBlogPostData = PlumeThemeBlogPostItem[]

export interface PlumeThemeBlog {

  /**
   * 通过 glob string 配置包含文件，
   *
   * 默认读取 源目录中的所有 `.md` 文件，但会排除 `notes` 配置中用于笔记的目录。
   *
   * 如果希望只将某个目录下的文章读取为博客文章，比如 `blog` 目录，可以配置为：
   * `['blog/**\/*.md']`
   *
   * @default - ['**\/*.md']
   */
  include?: string[]

  /**
   * 通过 glob string 配置排除的文件
   *
   *  _README.md 文件一般作为主页或者某个目录下的主页，不应该被读取为 blog文章_
   *
   * @default - ['.vuepress/', 'node_modules/', '{README,index}.md']
   */
  exclude?: string[]

  /**
   * 分页
   */
  pagination?: false | number | {
    /**
     * 每页显示的文章数量
     * @default 15
     */
    perPage?: number
  }

  /**
   * 博客文章列表页链接
   *
   * @default '/blog/'
   */
  link?: string

  /**
   * 是否启用博客文章列表
   * @default true
   */
  postList?: boolean

  /**
   * 是否启用标签页
   * @default true
   */
  tags?: boolean

  /**
   * 自定义标签页链接
   *
   * @default '/blog/tags/'
   */
  tagsLink?: string
  /**
   * 是否启用归档页
   * @default true
   */
  archives?: boolean

  /**
   * 自定义归档页链接
   *
   * @default '/blog/archives/'
   */
  archivesLink?: string

  /**
   * 是否启用分类页
   * @default true
   */
  categories?: boolean

  /**
   * 自定义分类页链接
   *
   * @default '/blog/categories/'
   */
  categoriesLink?: string

  /**
   * 博客文章封面图
   *
   * 配置封面图的位置，支持 `'left'`、`'right'`、`'top'`、`'top-inside'`
   *
   * @default 'right'
   */
  postCover?: BlogPostCoverLayout | Omit<BlogPostCover, 'url'>
}

export type BlogPostCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

export interface BlogPostCover {
  /**
   * 封面图链接地址，只能使用 绝对路径 以及 远程图片地址
   */
  url: string
  /**
   * 博客文章封面图的位置
   */
  layout?: BlogPostCoverLayout
  /**
   * 博客文章封面图的比例
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
