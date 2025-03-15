export interface BlogCategoryItem {
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
 * 博客封面图布局
 */
export type BlogPostCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

/**
 * 博客文章封面图样式
 */
export interface BlogPostCoverStyle {
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

/**
 * 博客文章
 */
export interface ThemeBlogPostItem {
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
  categoryList?: BlogCategoryItem[]
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
  coverStyle?: BlogPostCoverStyle
}

/**
 * 博客文章列表
 */
export type ThemeBlogPostList = ThemeBlogPostItem[]

/**
 * 博客配置
 */
export interface BlogOptions {
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
   * 标签颜色主题
   *
   * @default 'colored'
   */
  tagsTheme?: 'colored' | 'gray' | 'brand'
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
   * 是否启用分类功能
   * - 启用后会生成分类页
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
  categoriesTransform?: (categories: BlogCategoryItem[]) => BlogCategoryItem[]

  /**
   * 博客文章封面图
   *
   * 配置封面图的位置，支持 `'left'`、`'right'`、`'top'`、`'top-inside'`
   *
   * @default 'right'
   */
  postCover?: BlogPostCoverLayout | BlogPostCoverStyle
}
