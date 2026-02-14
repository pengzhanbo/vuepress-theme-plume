import type { WatermarkPluginFrontmatter } from '@vuepress/plugin-watermark'
import type { ThemeBadge, ThemeIcon, ThemeOutline } from '../common/index.js'
import type { NavItemWithLink } from '../features/index.js'
import type { ThemeNormalFrontmatter } from './normal.js'

/**
 * Document page frontmatter
 *
 * 文档页面 frontmatter
 */
export interface ThemePageFrontmatter extends ThemeNormalFrontmatter {
  home?: never
  friends?: never
  /**
   * Enable comments
   *
   * 是否开启评论
   */
  comments?: boolean
  /**
   * Show edit button
   *
   * 是否显示编辑按钮
   */
  editLink?: boolean
  /**
   * Edit link pattern
   *
   * 编辑链接模式
   */
  editLinkPattern?: string
  /**
   * Show last updated time
   *
   * 是否显示最近更新时间
   */
  lastUpdated?: boolean
  /**
   * Show contributors
   *
   * 是否显示贡献者
   */
  contributors?: boolean | string[]

  /**
   * Show changelog
   *
   * 是否显示变更历史
   */
  changelog?: boolean
  /**
   * Previous page
   *
   * 上一篇
   */
  prev?: string | NavItemWithLink
  /**
   * Next page
   *
   * 下一篇
   */
  next?: string | NavItemWithLink
  /**
   * Show sidebar, can also force specify which sidebar to show on current page
   *
   * 是否显示侧边栏，也可以强制指定当前页面显示哪个侧边栏
   */
  sidebar?: string | false
  /**
   * Show page aside
   *
   * 是否显示页内侧边栏
   */
  aside?: boolean | 'left'
  /**
   * Show content outline, only works when page aside is enabled
   *
   * 是否显示内容大纲，仅在页内侧边栏开启时生效
   */
  outline?: ThemeOutline
  /**
   * Show reading time and word count
   *
   * 是否显示阅读时间、字数
   */
  readingTime?: boolean
  /**
   * Watermark configuration
   *
   * 水印配置
   */
  watermark?: WatermarkPluginFrontmatter['watermark'] & { fullPage?: boolean }

  /**
   * Icon used for navbar and sidebar
   * Supports iconify icons, use iconify name directly for auto-loading
   * Supports local and remote SVG icons, use SVG URL directly
   * Or pass SVG string directly
   *
   * 用作 navbar 、 sidebar 的图标
   * 支持 iconify 图标，直接使用 iconify name 即可自动加载
   * 支持 本地、远程 svg 图标，直接使用 svg 的 url 即可
   * 或直接传入 svg 字符串
   */
  icon?: ThemeIcon

  /**
   * Title badge
   *
   * 标题徽章
   */
  badge?: string | ThemeBadge
}
