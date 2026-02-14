import type { PageFrontmatter } from 'vuepress'

/**
 * Normal page frontmatter
 *
 * 普通页面 frontmatter
 */
export type ThemeNormalFrontmatter = PageFrontmatter<{

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
   * Page layout
   *
   * 页面布局
   */
  pageLayout?: false | 'home' | 'posts' | 'doc' | 'custom' | 'page' | 'friends'

  /**
   * Custom page class
   *
   * 自定义页面 class
   */
  pageClass?: string

  /**
   * Show navigation bar
   *
   * 是否显示导航栏
   *
   * @default true
   */
  navbar?: boolean

  /**
   * Show back to top button
   *
   * 是否显示返回顶部按钮
   *
   * @default true
   */
  backToTop?: boolean

  /**
   * Show down arrow sign
   *
   * 是否显示向下箭头标志
   *
   * @default false
   */
  signDown?: boolean

  /**
   * Show external link icon on current page
   *
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
