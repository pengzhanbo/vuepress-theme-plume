import type { SocialLink } from '../common/social.js'
import type { AutoFrontmatterOptions } from './autoFrontmatter.js'
import type { PostsCategoryItem, PostsCoverLayout, PostsCoverStyle } from './posts.js'
import type { ProfileOptions } from './profile.js'
import type { ThemeSidebarItem } from './sidebar.js'

/**
 * 文档集合
 *
 * 主题通过 集合的方式，聚合某个目录下的文章，作为一个独立的文档。
 *
 * @since 1.0.0-rc.165
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
   * 当启用 autoFrontmatter 时，文档集合的链接前缀
   * - `post` 类型，用于文章的自动生成链接前缀
   * - `doc` 类型，用于文档中文章的自动生成链接前缀
   * @default '/${dir}/'
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

  /**
   * 文章元数据配置
   * - 设置文章列表中的文章元信息 显示方式
   * - 设置文章内容页元信息显示方式
   */
  meta?: {
    /**
     * 元数据中是否显示标签
     * @default true
     */
    tags?: boolean
    /**
     * 元数据中是否显示阅读时间
     * @default true
     */
    readingTime?: boolean
    /**
     * 元数据中是否显示字数
     * @default true
     */
    wordCount?: boolean
    /**
     * 元数据中是否显示创建时间，或者创建时间的显示格式
     * - `short`: 2022-01-01
     * - `long`: 2022-01-01 00:00:00
     * @default 'short'
     */
    createTime?: 'short' | 'long' | boolean
  }
}

/**
 * post 类型的文章集合
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
   * @default - []
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
   * @default '/${dir}/'
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
   * @default '/${link}/tags/'
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
   * @default '/${link}/archives/'
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
   * @default '/${link}/categories/'
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
   * 文章封面图
   *
   * 配置封面图的位置，支持 `'left'`、`'right'`、`'top'`、`'top-inside'`
   *
   * @default 'right'
   */
  postCover?: PostsCoverLayout | PostsCoverStyle

  /**
   * 个人信息配置
   */
  profile?: ProfileOptions | false

  /**
   * 社交账号配置
   */
  social?: SocialLink[] | false
}

/**
 * 文档类型的文章集合
 */
export interface ThemeDocCollection extends ThemeBaseCollection {
  type: 'doc'
  /**
   * 侧边栏配置
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
