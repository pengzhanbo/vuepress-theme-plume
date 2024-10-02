import type { LocaleData } from 'vuepress/core'
import type { SocialLink, SocialLinkIconUnion, ThemeOutline, ThemeTransition } from '../base.js'
import type { PlumeThemeBlog } from '../blog.js'
import type { NavItem } from '../navbar.js'
import type { NotesOptions } from '../notes.js'
import type { SidebarMulti } from '../sidebar.js'

export interface PlumeThemeLocaleData extends LocaleData {
  /**
   * 网站站点首页
   */
  home?: string
  /**
   * 网站站点logo
   */
  logo?: string
  /**
   * 深色模式下的网站站点logo
   */
  logoDark?: string
  /**
   * 是否启用深色模式切换按钮
   */
  appearance?: boolean | 'dark' | 'force-dark'

  /**
   * 深色模式切换按钮的文本
   */
  appearanceText?: string

  lightModeSwitchTitle?: string
  darkModeSwitchTitle?: string

  /**
   * @deprecated 弃用，使用 `profile` 代替
   */
  avatar?: PlumeThemeProfile

  /**
   * 配置博主拥有者 个人资料
   *
   * 显示在博客右侧侧边栏
   */
  profile?: PlumeThemeProfile

  /**
   * 社交账号配置
   */
  social?: SocialLink[]

  /**
   * 导航栏配置
   *
   * 设置为 `false` 将会禁用导航栏
   */
  navbar?: false | NavItem[]

  /**
   * 允许显示在导航栏的社交类型
   * @default - ['github', 'twitter', 'discord', 'facebook']
   */
  navbarSocialInclude?: (SocialLinkIconUnion | (string & { zz_IGNORE_ME?: never }))[]

  /**
   * 博客配置
   */
  blog?: false | PlumeThemeBlog

  /**
   * 文章链接前缀
   *
   * @default '/article/'
   */
  article?: string

  /**
   * 笔记配置， 笔记中的文章默认不会出现在首页文章列表
   *
   * 注：也可以将notes配置到navbar中
   */
  notes?: false | NotesOptions

  /**
   * 侧边栏配置
   */
  sidebar?: SidebarMulti

  /**
   * 要显示的标题级别。
   *
   * 单个数字表示只显示该级别的标题。
   *
   * 如果传递的是一个元组，第一个数字是最小级别，第二个数字是最大级别。
   *
   * 'deep' 与 [2, 6] 相同，将显示从 <h2> 到 <h6> 的所有标题。
   *
   * @default [2, 3]
   */
  outline?: ThemeOutline

  /**
   * 是否显示侧边栏
   *
   * - `false` 表示禁用 右侧边栏
   * - `true` 表示启用 右侧边栏
   * - `'left` 表示将有侧边栏移动到文章内容左侧，sidebar 右侧
   *
   * @default true
   */
  aside?: boolean | 'left'

  /**
   * 是否启用过渡动画效果
   *
   * @default true
   */
  transition?: boolean | ThemeTransition

  /**
   * 选择语言菜单 的文本。
   */
  selectLanguageText?: string
  /**
   * 选择语言菜单 的 `aria-label` 属性。
   */
  selectLanguageAriaLabel?: string
  /**
   * 语言名称
   *
   * 仅能在主题配置的 locales 的内部生效 。它将被用作 locale 的语言名称，展示在 选择语言菜单 内。
   */
  selectLanguageName?: string

  /**
   * 是否显示 "编辑此页"
   *
   * @default true
   */
  editLink?: boolean

  /**
   * "编辑此页" 的文本
   *
   * @default "Edit this page"
   */
  editLinkText?: string

  /**
   * "编辑此页" 的链接匹配模式
   *
   * @example ':repo/edit/:branch/:path'
   */
  editLinkPattern?: string
  /**
   * 文档仓库配置, 用于生成 Edit this page 链接
   */
  docsRepo?: string

  /**
   * 文档仓库分支配置，用于生成 `Edit this page` 链接。
   */
  docsBranch?: string

  /**
   * 文档仓库目录配置，用于生成 `Edit this page` 链接。
   */
  docsDir?: string
  /**
   * 最后更新时间
   *
   * @default { text: 'Last Updated', formatOptions: { dateStyle: 'short', timeStyle: 'short' } }
   */
  lastUpdated?: false | LastUpdatedOptions

  /**
   * @deprecated 使用 `lastUpdated.text` 代替.
   *
   * "最后更新时间" 的文本
   *
   * @default 'Last updated'
   */
  lastUpdatedText?: string

  /**
   * 是否显示贡献者
   */
  contributors?: boolean
  /**
   * 贡献者的文本
   */
  contributorsText?: string

  /**
   * 移动设备下的导航栏中 菜单选项的文字。
   *
   * @default 'Menu'
   */
  sidebarMenuLabel?: string

  /**
   * 移动设备下的导航栏中返回顶部的文字。
   *
   * @default 'return to top'
   */
  returnToTopLabel?: string

  /**
   * 侧边栏 outline 文本
   *
   * @default 'On this page'
   */
  outlineLabel?: string

  /**
   * 是否显示上一页
   *
   * @default true
   */
  prevPage?: boolean

  /**
   * 上一页的文本
   *
   * @default 'Previous Page'
   */
  prevPageLabel?: string

  /**
   * 是否显示下一页
   *
   * @default true
   */
  nextPage?: boolean

  /**
   * 下一页的文本
   *
   * @default 'Next Page'
   */
  nextPageLabel?: string

  /**
   * 是否显示外部链接图标
   *
   * @default true
   */
  externalLinkIcon?: boolean

  /**
   * 页脚配置。
   */
  footer?:
    | false
    | {
      message?: string
      copyright?: string
    }

  /**
   * 404 页面配置
   */
  notFound?: {
    code?: string | number
    title?: string
    quote?: string
    linkLabel?: string
    linkText?: string
  }

  /**
   * 全站加密时的提示
   */
  encryptGlobalText?: string

  /**
   * 文章加密时的提示
   */
  encryptPageText?: string

  /**
   * 加密确认按钮文本
   */
  encryptButtonText?: string

  /**
   * 加密时输入框的 placeholder
   */
  encryptPlaceholder?: string
}

/** =========================== Profile ================================ */

/**
 * 个人资料
 */
export interface PlumeThemeProfile {
  /**
   * @deprecated 弃用，使用 `avatar` 代替
   * 头像链接
   */
  url?: string

  /**
   * 头像链接地址
   */
  avatar?: string
  /**
   * 名称
   */
  name?: string
  /**
   * 描述
   */
  description?: string
  /**
   * 是否显示为圆形头像
   */
  circle?: boolean

  /**
   * 地理位置
   */
  location?: string

  /**
   * 组织，公司
   */
  organization?: string

  /**
   * 布局位置，左侧或者右侧
   * @default 'right'
   */
  layout?: 'left' | 'right'
}

/** ========================== Page Meta ====================== */

export interface LastUpdatedOptions {
  /**
   * Set custom last updated text.
   *
   * @default 'Last updated'
   */
  text?: string

  /**
   * Set options for last updated time formatting.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @default
   * { dateStyle: 'short', timeStyle: 'short' }
   */
  formatOptions?: Intl.DateTimeFormatOptions & { forceLocale?: boolean }
}
