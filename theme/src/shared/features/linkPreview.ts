/**
 * Link preview options
 *
 * 内链悬浮预览配置
 */
export interface LinkPreviewOptions {
  /**
   * Hover-intent delay in ms before showing the card
   *
   * 鼠标停留多久后显示卡片（ms）
   *
   * @default 150
   */
  delay?: number
  /**
   * Keyboard focus delay in ms, `0` shows immediately
   *
   * 键盘聚焦后显示卡片的延迟（ms），`0` 表示立即显示
   *
   * @default 0
   */
  focusDelay?: number
  /**
   * CSS selector of the trigger links
   *
   * 触发预览的链接选择器
   *
   * @default '.vp-doc a[href]'
   */
  selector?: string
  /**
   * Show the excerpt of the target page
   *
   * 是否展示目标页摘要
   *
   * @default true
   */
  showExcerpt?: boolean
  /**
   * Max characters of the excerpt, `0` means unlimited
   *
   * 摘要最大字符数，`0` 表示不截断
   *
   * @default 120
   */
  excerptLength?: number
  /**
   * Show the first few headings of the target page
   *
   * 是否展示目标页的前几个标题
   *
   * @default false
   */
  showHeadings?: boolean
  /**
   * Max headings, 1–6
   *
   * 最多展示的标题数量（1–6）
   *
   * @default 3
   */
  headingsLimit?: number
  /**
   * Show the tags of the target page
   *
   * 是否展示目标页标签
   *
   * @default true
   */
  showTags?: boolean
  /**
   * Show the last updated date of the target page (requires the git plugin)
   *
   * 是否展示目标页最后更新时间（依赖 git 插件）
   *
   * @default true
   */
  showUpdatedTime?: boolean
  /**
   * Max card width in px, 240–520
   *
   * 卡片最大宽度（px，240–520）
   *
   * @default 360
   */
  maxWidth?: number
  /**
   * Excluded target paths, supports glob
   *
   * 排除的目标路径，支持 glob
   *
   * @default []
   */
  exclude?: string[]
}

/**
 * Link preview item written into page data, keyed by the normalized route path
 *
 * 写入页面数据的内链预览项，以归一化后的路由路径为键
 */
export interface ThemeLinkPreviewItem {
  /**
   * Target page title
   *
   * 目标页标题
   */
  title: string
  /**
   * Plain-text excerpt
   *
   * 纯文本摘要
   */
  excerpt?: string
  /**
   * First few heading texts
   *
   * 前几个标题文本
   */
  headings?: string[]
  /**
   * Tags
   *
   * 标签
   */
  tags?: string[]
  /**
   * Last updated timestamp in ms
   *
   * 最后更新时间（毫秒时间戳）
   */
  updatedTime?: number
}
