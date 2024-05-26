import type { BlogPostDataItem } from '@vuepress-plume/plugin-blog-data'
import type { PageCategoryData } from './page.js'

export interface PlumeThemeBlogPostItem extends BlogPostDataItem {
  tags: string[]
  sticky: boolean
  categoryLost: PageCategoryData[]
  createTime: string
  lang: string
  encrypt?: boolean
}

export type PlumeThemeBlogPostData = PlumeThemeBlogPostItem[]

export interface PlumeThemeBlog {

  /**
   * blog list link
   *
   * @default '/blog/'
   */
  link?: string

  /**
   * 通过 glob string 配置包含文件
   *
   * @default - ['**\*.md']
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
  pagination?: false | {
    /**
     * 每页显示的文章数量
     * @default 20
     */
    perPage?: number
    /**
     * 前一页的文本
     * @default 'Prev'
     */
    prevPageText?: string
    /**
     * 后一页的文本
     * @default 'Next'
     */
    nextPageText?: string
  }

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
}
