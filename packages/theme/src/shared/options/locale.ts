import type { NotesDataOptions } from '@vuepress-plume/vuepress-plugin-notes-data'
import type { LocaleData } from '@vuepress/core'
import type { NavItem } from './navbar.js'
// import type { NavbarConfig, NavLink } from '../layout/index.js'
// import type { PlumeThemeNotesOptions } from './notes.js'

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

export interface SocialLink {
  icon: SocialLinkIcon
  link: string
}

export type SocialLinkIcon =
  | 'discord'
  | 'facebook'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'mastodon'
  | 'slack'
  | 'twitter'
  | 'youtube'
  | { svg: string }

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
  appearance?: boolean | 'dark'

  /**
   * 部署站点域名。
   * 用于生成 sitemap、 seo等。
   *
   */
  hostname?: string

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
   * 文章链接前缀
   *
   * @default： /article/
   */
  article?: string

  /**
   * 标签页链接 与 navbar配置
   *
   * @def：{ text: '标签', link: '/tag/' }
   */
  // tag?: false | NavItemWithLink

  /**
   * 文章分类 与 navbar配置
   *
   * @default： { text: '分类', link: '/category/ }
   */
  // category?: false | NavItemWithLink

  /**
   * 归档页 链接与 navbar 配置
   *
   * (注，由于页面样式为 timeline， 所以默认链接为 timeline )
   *
   * @default： { text: '归档', link: '/timeline/' }
   */
  // archive?: false | NavItemWithLink

  /**
   * 笔记配置， 笔记中的文章默认不会出现在首页文章列表
   *
   * 注：你也可以将notes配置到navbar中，默认自动生成在右侧栏目中
   */
  notes?: false | NotesDataOptions

  /**
   * language text
   */
  // selectLanguageText?: string
  /**
   * language aria label
   */
  // selectLanguageAriaLabel?: string
  /**
   * language name
   */
  // selectLanguageName?: string
  /**
   * repository of navbar
   */
  // repo?: null | string
  /**
   * repository text of navbar
   */
  // repoLabel?: string

  /**
   * Navbar config
   *
   * Set to `false` to disable navbar in current locale
   */
  navbar?: false | NavItem[]
  /**
   * 外部链接打开方式
   */
  openInNewWindow?: string | boolean

  // notFound?: string[]

  // backToHome?: string

  footer?:
    | false
    | {
        message?: string
        copyright?: string
      }
}
