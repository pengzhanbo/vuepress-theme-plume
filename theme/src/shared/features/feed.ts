/**
 * Feed output format
 *
 * Feed 输出格式
 */
export type FeedFormat = 'rss' | 'atom' | 'json'

/**
 * Feed author
 *
 * Feed 作者信息
 */
export interface FeedAuthor {
  /**
   * Author name
   *
   * 作者名称
   */
  name?: string
  /**
   * Author email
   *
   * 作者邮箱
   */
  email?: string
  /**
   * Author homepage
   *
   * 作者主页
   */
  url?: string
}

/**
 * Feed channel metadata
 *
 * 频道元信息
 */
export interface FeedChannelOptions {
  /**
   * Channel title
   *
   * 频道标题
   */
  title?: string
  /**
   * Channel description
   *
   * 频道描述
   */
  description?: string
  /**
   * Channel language, e.g. `zh-CN`
   *
   * 频道语言
   */
  language?: string
  /**
   * Channel home link, relative to the current locale or absolute.
   *
   * For the global channel it also determines the output directory.
   *
   * 频道主页链接，可为当前语言环境的相对路径或绝对地址；
   * 全局频道还会用它决定输出目录。
   */
  link?: string
  /**
   * Channel author(s)
   *
   * 频道作者
   */
  author?: FeedAuthor | FeedAuthor[]
  /**
   * Copyright text
   *
   * 版权声明
   */
  copyright?: string
  /**
   * Reader cache minutes
   *
   * 阅读器缓存分钟数
   */
  ttl?: number
  /**
   * Channel icon (absolute or site-relative)
   *
   * 频道图标
   */
  icon?: string
  /**
   * Channel image (absolute or site-relative)
   *
   * 频道图片
   */
  image?: string
  /**
   * WebSub hub URL
   *
   * WebSub hub 地址
   */
  hub?: string
}

/**
 * Feed output filenames
 *
 * Feed 输出文件名
 */
export interface FeedFilenames {
  /**
   * RSS filename
   *
   * RSS 文件名
   *
   * @default 'feed.xml'
   */
  rss?: string
  /**
   * Atom filename
   *
   * Atom 文件名
   *
   * @default 'atom.xml'
   */
  atom?: string
  /**
   * JSON Feed filename
   *
   * JSON Feed 文件名
   *
   * @default 'feed.json'
   */
  json?: string
}

/**
 * Feed options
 *
 * Feed 配置
 */
export interface FeedOptions {
  /**
   * Generate a channel for every eligible collection
   *
   * 是否为每个符合条件的集合生成独立频道
   *
   * @default false
   */
  perCollection?: boolean
  /**
   * Include `doc` collections in the global channel
   *
   * 全局频道是否包含 `doc` 类型集合
   *
   * @default false
   */
  includeDocCollections?: boolean
  /**
   * Entry content mode
   *
   * 条目内容模式
   *
   * @default 'excerpt'
   */
  content?: 'excerpt' | 'full'
  /**
   * Max entries per channel (1–200)
   *
   * 每个频道最多条目数（1–200）
   *
   * @default 20
   */
  limit?: number
  /**
   * Max summary length, `0` disables the summary
   *
   * 摘要最大长度，`0` 表示不生成摘要
   *
   * @default 240
   */
  excerptLength?: number
  /**
   * Output formats
   *
   * 输出格式
   *
   * @default ['rss']
   */
  formats?: FeedFormat[]
  /**
   * Output filenames
   *
   * 输出文件名
   */
  filename?: FeedFilenames
  /**
   * Channel metadata shared by all channels
   *
   * 所有频道共享的元信息
   */
  channel?: FeedChannelOptions
  /**
   * Inject `<link rel="alternate">` into page head
   *
   * 是否向页面 `<head>` 注入 `<link rel="alternate">`
   *
   * @default true
   */
  linkTag?: boolean
  /**
   * Print per-channel details in build log
   *
   * 在构建日志中输出逐频道明细
   *
   * @default false
   */
  debug?: boolean
}

/**
 * Collection level feed options
 *
 * 集合级 Feed 配置
 */
export interface FeedCollectionOptions {
  /**
   * Include the collection pages in feeds
   *
   * 是否将该集合的页面纳入 feed
   *
   * `feed: true` 或 `feed: {}` 表示显式 opt-in。
   *
   * @default true
   */
  include?: boolean
  /**
   * Generate a dedicated channel for this collection
   *
   * 是否为该集合生成独立频道
   *
   * @default true
   */
  channel?: boolean
  /**
   * Channel home link, defaults to the collection link
   *
   * 频道主页链接，默认使用集合链接
   */
  link?: string
  /**
   * Channel title, defaults to the collection title
   *
   * 频道标题，默认使用集合标题
   */
  title?: string
  /**
   * Channel description, defaults to the theme level description
   *
   * 频道描述，默认使用主题级描述
   */
  description?: string
  /**
   * Max entries, overrides the theme level option
   *
   * 最多条目数，覆盖主题级配置
   */
  limit?: number
  /**
   * Content mode, overrides the theme level option
   *
   * 内容模式，覆盖主题级配置
   */
  content?: 'excerpt' | 'full'
  /**
   * Formats, overrides the theme level option
   *
   * 输出格式，覆盖主题级配置
   */
  formats?: FeedFormat[]
}

/**
 * Page level feed options
 *
 * 页面级 Feed 配置（frontmatter）
 */
export interface FeedPageOptions {
  /**
   * Entry title, defaults to the page title
   *
   * 条目标题，默认使用页面标题
   */
  title?: string
  /**
   * Entry description, used as summary fallback
   *
   * 条目描述，作为摘要的后备值
   */
  description?: string
  /**
   * Entry summary, takes precedence over `excerpt` / `description`
   *
   * 条目摘要，优先于 `excerpt` / `description`
   */
  summary?: string
  /**
   * Entry guid / id, defaults to the page absolute URL
   *
   * 条目唯一标识，默认使用页面完整地址
   */
  guid?: string
}
