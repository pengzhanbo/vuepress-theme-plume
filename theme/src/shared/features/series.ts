/**
 * Series sorting strategy
 *
 * 系列内篇目的排序策略
 */
export type SeriesOrder = 'auto' | 'order' | 'time'

/**
 * Series item configuration
 *
 * 单个系列的配置
 */
export interface SeriesItemOptions {
  /**
   * Series title, falls back to the id
   *
   * 系列标题，缺省时使用 id
   */
  title?: string
  /**
   * Series description, used by the landing page and SEO description
   *
   * 系列简介，用于落地页与 SEO description
   */
  description?: string
  /**
   * Cover image of the landing page
   *
   * 落地页封面图
   */
  cover?: string
  /**
   * Landing page path. When omitted, `linkPrefix + id` is used.
   * Set `page: false` to keep the link while managing the page yourself.
   *
   * 落地页路径。缺省时使用 `linkPrefix + id`。
   * 配合 `page: false` 可指向自己手写的落地页
   */
  link?: string
  /**
   * Whether to generate the landing page
   *
   * 是否生成系列落地页
   *
   * @default true
   */
  page?: boolean
  /**
   * Sorting strategy of the chapters
   *
   * 篇目排序策略
   *
   * @default 'auto'
   */
  order?: SeriesOrder
  /**
   * Whether to render the in-page links (head hint + tail next chapter).
   * `false` keeps the series but hides both blocks; the doc pager is never affected.
   *
   * 是否渲染页内互链（文首「本文收录于《X》」+ 文末「《X》下一篇：Y」）。
   * `false` 时系列仍然存在，只是不展示这两处；**页脚翻页不受影响**
   *
   * @default true
   */
  nav?: boolean
}

/**
 * Series options
 *
 * 系列功能配置
 */
export interface SeriesOptions {
  /**
   * Global switch of landing page generation
   *
   * 落地页生成总开关
   *
   * @default true
   */
  page?: boolean
  /**
   * Path prefix of landing pages
   *
   * 落地页路径前缀
   *
   * @default '/series/'
   */
  linkPrefix?: string
  /**
   * Generate a series overview page at `linkPrefix` (e.g. `/series/`) listing every
   * series of the current locale
   *
   * 是否在 `linkPrefix` 根路径（如 `/series/`）生成系列总览页，列出当前语言的全部系列
   *
   * @default false
   */
  index?: boolean
  /**
   * Create series automatically when the id is not declared in `items`
   *
   * 未在 `items` 中声明时是否自动创建
   *
   * @default true
   */
  autoCreate?: boolean
  /**
   * Default sorting strategy
   *
   * 默认排序策略
   *
   * @default 'auto'
   */
  order?: SeriesOrder
  /**
   * Default of `nav`
   *
   * `nav` 的默认值
   *
   * @default true
   */
  nav?: boolean
  /**
   * Series definitions, keyed by series id
   *
   * 系列定义，以系列 id 为键
   */
  items?: Record<string, SeriesItemOptions>
}

/**
 * A chapter in a series, written to `@internal/seriesData`
 *
 * 系列章节，写入 `@internal/seriesData`
 */
export interface ThemeSeriesChapter {
  /**
   * Chapter page path
   *
   * 章节页面路径
   */
  path: string
  /**
   * Chapter title
   *
   * 章节标题
   */
  title: string
  /**
   * 1-based index in the series
   *
   * 在系列内的篇号（从 1 开始）
   */
  order: number
  /**
   * Formatted create time, same as `postsData`
   *
   * 格式化后的创建时间，与 `postsData` 一致
   */
  createTime?: string
  /**
   * Reading time in minutes
   *
   * 预计阅读分钟数
   */
  readingTime?: number
  /**
   * Draft chapter, only possible in dev
   *
   * 草稿章节，仅开发模式可能出现
   */
  draft?: boolean
}

/**
 * A resolved series
 *
 * 解析后的系列
 */
export interface ThemeSeries {
  /**
   * Series id
   *
   * 系列 id
   */
  id: string
  /**
   * Series title
   *
   * 系列标题
   */
  title: string
  /**
   * Series description
   *
   * 系列简介
   */
  description?: string
  /**
   * Cover image
   *
   * 封面图
   */
  cover?: string
  /**
   * Landing page path, absent when no landing page exists
   *
   * 落地页路径，未生成时不存在
   */
  link?: string
  /**
   * Whether to render the in-page links (head hint + tail next).
   * Resolved at build time, so the client never reads the raw config.
   *
   * 是否渲染页内互链（文首提示 + 文末下一篇）。构建期已解析，客户端不读原始配置
   */
  nav: boolean
  /**
   * Chapters, already sorted and numbered
   *
   * 已排序编号的章节
   */
  chapters: ThemeSeriesChapter[]
}

/**
 * Series data of every locale
 *
 * 所有语言环境的系列数据
 */
export type ThemeSeriesData = Record<string /* locale */, Record<string /* id */, ThemeSeries>>
