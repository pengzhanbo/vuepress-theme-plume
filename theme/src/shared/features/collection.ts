import type { AutoFrontmatterOptions } from './autoFrontmatter.js'
import type { PostsCategoryItem, PostsCoverLayout, PostsCoverStyle } from './posts.js'
import type { ThemeSidebarItem } from './sidebar.js'

/**
 * 文档集合
 *
 * 主题通过 集合的方式，聚合某个目录下的文章，作为一个独立的文档。
 */
export type ThemeCollections = ThemeCollectionItem[]

export type ThemeCollectionItem = ThemePostCollection | ThemeDocCollection

export interface ThemeBaseCollection {
  /**
   * 文档集合类型
   * - `post`: 文章列表（可用于 博客、专栏等）
   * - `doc`: 文档（可用于 笔记、知识库等）
   */
  type: 'post' | 'doc'
  /**
   * 文档集合目录，相对于源目录
   */
  dir: string
  /**
   * 文档集合的链接前缀
   */
  linkPrefix?: string

  /**
   * 文档集合标题
   */
  title: string

  /**
   * 标签颜色主题
   *
   * @default 'colored'
   */
  tagsTheme?: 'colored' | 'gray' | 'brand'

  /**
   * 自动生成文章的 frontmatter
   */
  autoFrontmatter?: AutoFrontmatterOptions | false
}

/**
 * 博客类型的文章集合
 */
export interface ThemePostCollection extends ThemeBaseCollection {
  type: 'post'
  /**
   * 通过 glob string 配置包含文件，
   *
   * 默认读取 `dir` 中的所有 `.md` 文件。
   *
   * @default - ['**\/*.md']
   */
  include?: string[]

  /**
   * 通过 glob string 配置排除的文件
   *
   *  _README.md 文件一般作为主页或者某个目录下的主页，不应该被读取为 blog文章_
   *
   * @default - ['{README,index}.md']
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
   * 文章列表页链接
   *
   * @default '/blog/'
   */
  link?: string

  /**
   * 是否启用文章列表页
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
   * @default '/{link}/tags/'
   */
  tagsLink?: string

  /**
   * 标签页文本
   */
  tagsText?: string

  /**
   * 是否启用归档页
   * @default true
   */
  archives?: boolean

  /**
   * 自定义归档页链接
   *
   * @default '/{link}/archives/'
   */
  archivesLink?: string

  /**
   * 归档页文本
   */
  archivesText?: string

  /**
   * 是否启用分类功能
   * - 启用后会生成分类页
   * @default true
   */
  categories?: boolean

  /**
   * 自定义分类页链接
   *
   * @default '/{link}/categories/'
   */
  categoriesLink?: string

  /**
   * 分类页文本
   */
  categoriesText?: string

  /**
   * 分类页展开深度
   *
   * @default 'deep'
   */
  categoriesExpand?: number | 'deep'

  /**
   * 文章分类列表转换函数，比如排除不需要的一级分类
   * @param categories 分类列表
   * @returns 返回一个新的分类列表
   */
  categoriesTransform?: (categories: PostsCategoryItem[]) => PostsCategoryItem[]

  /**
   * 博客文章封面图
   *
   * 配置封面图的位置，支持 `'left'`、`'right'`、`'top'`、`'top-inside'`
   *
   * @default 'right'
   */
  postCover?: PostsCoverLayout | PostsCoverStyle
}

/**
 * 文档类型的文章集合
 */
export interface ThemeDocCollection extends ThemeBaseCollection {
  type: 'doc'
  /**
   * 当前笔记的侧边栏配置
   */
  sidebar?: 'auto' | (string | ThemeSidebarItem)[]

  /**
   * 是否显示侧边栏滚动条
   * @default true
   */
  sidebarScrollbar?: boolean

  /**
   * 侧边栏为 `auto` 时，是否默认折叠
   * - `true`: 默认折叠
   * - `false`: 默认不折叠
   *
   * @default false
   */
  sidebarCollapsed?: boolean
}
