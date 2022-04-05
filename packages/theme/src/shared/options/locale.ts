import type { LocaleData } from '@vuepress/core'
import type { NavbarConfig, NavLink } from '../layout'
import type { PlumeThemeNotesOptions } from './notes'

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
}

export interface PlumeThemeSocialOption {
  /**
   * 邮箱
   */
  email?: string
  /**
   * github链接 支持仅填写 organization / Repositories
   */
  github?: string
  /**
   * 微博
   */
  weiBo?: string
  /**
   * 知乎
   */
  zhiHu?: string
  /**
   * QQ
   */
  QQ?: string
  /**
   * facebook
   */
  facebook?: string
  /**
   * twitter
   */
  twitter?: string
  /**
   * linkedin 英领
   */
  linkedin?: string
}

export interface PlumeThemeLocaleData extends LocaleData {
  /**
   * 网站站点首页
   */
  home?: false | NavLink
  /**
   * 网站站点logo
   */
  logo?: string
  /**
   * 深色模式下的网站站点logo
   */
  logoDark?: string
  /**
   * 是否启用深色模式
   */
  darkMode?: boolean

  /**
   * 配置博主拥有者信息
   *
   * 显示在右侧侧边栏
   */
  avatar?: PlumeThemeAvatar

  /**
   * 社交账号配置
   */
  social?: PlumeThemeSocialOption

  /**
   * 文章链接前缀
   *
   * 默认： /article/
   */
  article?: string

  /**
   * 标签页链接 与 navbar配置
   *
   * 默认：{ text: '标签', link: '/tag/' }
   */
  tag?: false | NavLink

  /**
   * 文章分类 与 navbar配置
   *
   * 默认： { text: '分类', link: '/category/ }
   */
  category?: false | NavLink

  /**
   * 归档页 链接与 navbar 配置
   *
   * (注，由于页面样式为 timeline， 所以默认链接为 timeline )
   *
   * 默认： { text: '归档', link: '/timeline/' }
   */
  archive?: false | NavLink

  /**
   * 笔记配置， 笔记中的文章默认不会出现在首页文章列表
   *
   * 注：你也可以将notes配置到navbar中，默认自动生成在右侧栏目中
   */
  notes?: false | PlumeThemeNotesOptions

  footer?: false | { content: string; copyright: string }

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
   * repository of navbar
   */
  repo?: null | string
  /**
   * repository text of navbar
   */
  repoLabel?: string

  /**
   * Navbar config
   *
   * Set to `false` to disable navbar in current locale
   */
  navbar?: false | NavbarConfig
  /**
   * 外部链接打开方式
   */
  openInNewWindow?: string | boolean
}
