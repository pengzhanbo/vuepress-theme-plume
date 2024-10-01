import type { PageFrontmatter } from 'vuepress'

export type PlumeNormalFrontmatter = PageFrontmatter<{

  /**
   * @deprecated
   *
   * 使用 pageLayout = 'home' 代替
   */
  home?: boolean

  /**
   * @deprecated
   *
   * 使用 pageLayout = 'friends' 代替
   */
  friends?: boolean

  /**
   * page layout
   */
  pageLayout?: false | 'home' | 'blog' | 'doc' | 'custom' | 'page' | 'friends'

  /**
   * 自定义页面 class
   */
  pageClass?: string

  /**
   * 是否显示导航栏
   *
   * @default true
   */
  navbar?: boolean

  /**
   * 是否显示返回顶部按钮
   *
   * @default true
   */
  backToTop?: boolean

  /**
   * 当前页面是否显示 外部链接图标
   *
   * @default true
   */
  externalLinkIcon?: boolean

  /**
   * @deprecated 使用 `externalLinkIcon` 代替
   */
  externalLink?: boolean
}>
