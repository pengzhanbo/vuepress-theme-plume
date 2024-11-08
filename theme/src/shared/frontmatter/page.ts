import type { WatermarkPluginFrontmatter } from '@vuepress/plugin-watermark'
import type { ThemeOutline } from '../base.js'
import type { NavItemWithLink } from '../navbar.js'
import type { PlumeNormalFrontmatter } from './normal.js'

export interface PlumeThemePageFrontmatter extends PlumeNormalFrontmatter {
  home?: never
  friends?: never
  /**
   * 是否开启评论
   */
  comments?: boolean
  /**
   * 是否显示编辑按钮
   */
  editLink?: boolean
  /**
   * 编辑链接模式
   */
  editLinkPattern?: string
  /**
   * 是否显示最近更新时间
   */
  lastUpdated?: boolean
  /**
   * 是否显示贡献者
   */
  contributors?: boolean | string[]

  /**
   * 是否显示变更历史
   */
  changelog?: boolean
  /**
   * 上一篇
   */
  prev?: string | NavItemWithLink
  /**
   * 下一篇
   */
  next?: string | NavItemWithLink
  /**
   * 是否显示侧边栏，也可以强制指定当前页面显示哪个侧边栏
   */
  sidebar?: string | false
  /**
   * 是否显示页内侧边栏
   */
  aside?: boolean | 'left'
  /**
   * 是否显示内容大纲，仅在页内侧边栏开启时生效
   */
  outline?: ThemeOutline
  /**
   * 是否显示阅读时间、字数
   */
  readingTime?: boolean
  /**
   * 水印配置
   */
  watermark?: WatermarkPluginFrontmatter['watermark'] & { fullPage?: boolean }

  /**
   * 用作 navbar 、 sidebar 的图标
   * 支持 iconify 图标，直接使用 iconify name 即可自动加载
   * 支持 本地、远程 svg 图标，直接使用 svg 的 url 即可
   * 或直接传入 svg 字符串
   */
  icon?: string | { svg: string }

  /**
   * 标题徽章
   */
  badge?: string | {
    text: string
    type?: 'info' | 'tip' | 'warning' | 'danger'
  }
}
