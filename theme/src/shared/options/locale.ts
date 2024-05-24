import type { LocaleData } from 'vuepress/core'
import type { NotesDataOptions } from '@vuepress-plume/plugin-notes-data'
import type { SocialLink, SocialLinkIconUnion } from '../base.js'
import type { PlumeThemeBlog } from '../blog.js'
import type { NavItem } from './navbar.js'

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

  /**
   * 配置博主拥有者信息
   *
   * 显示在右侧侧边栏
   */
  avatar?: PlumeThemeAvatar

  /**
   * 社交账号配置
   */
  social?: SocialLink[]

  /**
   * Navbar config
   *
   * Set to `false` to disable navbar in current locale
   */
  navbar?: false | NavItem[]

  /**
   * 允许显示在导航栏的社交类型
   * @default - ['github', 'twitter', 'discord', 'facebook']
   */
  navbarSocialInclude?: SocialLinkIconUnion[]

  /**
   * 博客配置
   */
  blog?: PlumeThemeBlog

  /**
   * 文章链接前缀
   *
   * @default '/article/'
   */
  article?: string

  /**
   * 笔记配置， 笔记中的文章默认不会出现在首页文章列表
   *
   * 注：你也可以将notes配置到navbar中，默认自动生成在右侧栏目中
   */
  notes?: false | NotesDataOptions

  /**
   * language text
   */
  selectLanguageText?: string
  /**
   * language aria label
   */
  selectLanguageAriaLabel?: string
  /**
   * language name
   */
  selectLanguageName?: string

  /**
   * Page meta - edit link config
   *
   * Whether to show "Edit this page" or not
   */
  editLink?: boolean

  /**
   * Page meta - edit link config
   *
   * The text to replace the default "Edit this page"
   */
  editLinkText?: string

  /**
   * Page meta - edit link config
   *
   * Pattern of edit link
   *
   * @example ':repo/edit/:branch/:path'
   */
  editLinkPattern?: string
  /**
   * Page meta - edit link config
   *
   * Use `repo` config by default
   *
   * Set this config if your docs is placed in a different repo
   */
  docsRepo?: string

  /**
   * Page meta - edit link config
   *
   * Set this config if the branch of your docs is not 'main'
   */
  docsBranch?: string

  /**
   * Page meta - edit link config
   *
   * Set this config if your docs is placed in sub dir of your `docsRepo`
   */
  docsDir?: string
  /**
   * Page meta - last updated config
   *
   * Whether to show "Last Updated" or not
   */
  lastUpdated?: false | LastUpdatedOptions

  /**
   * @deprecated Use `lastUpdated.text` instead.
   *
   * Set custom last updated text.
   *
   * @default 'Last updated'
   */
  lastUpdatedText?: string

  /**
   * Page meta - contributors config
   *
   * Whether to show "Contributors" or not
   */
  contributors?: boolean
  /**
   * Page meta - contributors config
   *
   * The text to replace the default "Contributors"
   */
  contributorsText?: string

  // backToHome?: string

  /**
   * sidebar menu label
   */
  sidebarMenuLabel?: string

  /**
   * return to top label
   */
  returnToTopLabel?: string

  /**
   * 侧边栏 outline 文本
   *
   * @default 'On this page'
   */
  outlineLabel?: string

  prevPageLabel?: string

  nextPageLabel?: string

  /**
   * 是否显示外部链接图标
   */
  externalLinkIcon?: string

  footer?:
    | false
    | {
      message?: string
      copyright?: string
    }

  /**
   * 404 page options
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

/** =========================== Avatar ================================ */

export interface PlumeThemeAvatar {
  /**
   * 头像链接
   */
  url?: string
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
