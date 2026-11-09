import type { PageFrontmatter } from 'vuepress'
import type { FeedPageOptions } from '../features/feed.js'

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
  pageLayout?:
    | false
    | 'home' | 'posts' | 'doc' | 'custom' | 'page' | 'friends'
    | 'blog' /** @deprecated */

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

  /**
   * Mark the current page as a draft
   *
   * Draft pages are completely excluded from the production build,
   * but still visible in the dev server.
   *
   * 标记当前页面为草稿。
   *
   * 草稿页面在生产构建时被完全排除，但在开发模式下仍然可访问。
   *
   * @default false
   */
  draft?: boolean

  /**
   * Include the page in feeds
   *
   * - `false`: exclude the page from every feed
   * - object: override the entry metadata
   *
   * 是否将当前页面包含在 Feed 中；`false` 时从所有频道排除。
   *
   * @default true
   */
  feed?: boolean | FeedPageOptions
}>
