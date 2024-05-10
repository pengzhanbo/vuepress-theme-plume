import type { LocaleData } from 'vuepress/core'
import type { NotesDataOptions } from '@vuepress-plume/plugin-notes-data'
import type { PlumeThemeImage } from '../base.js'
import type { NavItem } from './navbar.js'

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

export interface SocialLink {
  icon: SocialLinkIcon
  link: string
  ariaLabel?: string
}

export type SocialLinkIconUnion =
  | 'discord'
  | 'facebook'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'mastodon'
  | 'npm'
  | 'slack'
  | 'twitter'
  | 'x'
  | 'youtube'
  | 'qq'
  | 'weibo'
  | 'bilibili'
  | 'gitlab'
  | 'docker'
  | 'juejin'
  | 'zhihu'
  | 'douban'
  | 'steam'
  | 'stackoverflow'
  | 'xbox'

export type SocialLinkIcon = SocialLinkIconUnion | { svg: string }

export interface PlumeThemeBlog {

  /**
   * blog list link
   *
   * @default '/blog/'
   */
  link?: string

  /**
   * 通过 glob string 配置包含文件
   *
   * @default - ['**\*.md']
   */
  include?: string[]

  /**
   * 通过 glob string 配置排除的文件
   *
   *  _README.md 文件一般作为主页或者某个目录下的主页，不应该被读取为 blog文章_
   *
   * @default - ['.vuepress/', 'node_modules/', '{README,index}.md']
   */
  exclude?: string[]

  /**
   * 分页
   */
  pagination?: false | {
    /**
     * 每页显示的文章数量
     * @default 20
     */
    perPage?: number
    /**
     * 前一页的文本
     * @default 'Prev'
     */
    prevPageText?: string
    /**
     * 后一页的文本
     * @default 'Next'
     */
    nextPageText?: string
  }

  /**
   * 是否启用标签页
   * @default true
   */
  tags?: boolean
  /**
   * 是否启用归档页
   * @default true
   */
  archives?: boolean
}

export interface PlumeThemeEncrypt {
  /**
   * 是否启用全站加密
   * @default false
   */
  global?: boolean
  /**
   * 超级权限密码, 该密码可以解密全站，以及任意加密的文章
   *
   */
  admin?: string | string[]

  /**
   * 文章密码， 可以通过 文章的 markdown 文件相对路径、页面访问路径、
   * 目录路径 等，对 单个文章 或者 整个目录 进行 加密。
   * 如果是以 `^` 开头，则被认为是类似于正则表达式进行匹配。
   *
   * @example
   * ```json
   * {
   *   "前端/基础/html.md": "123",
   *   "/article/23c44c/": ["456", "789"],
   *   "^/note/(note1|note2)/": "123"
   * }
   * ```
   */
  rules?: {
    [key: string]: string | string[]
  }
}

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
   * @default： /article/
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
  navbar?: false | NavItem[]
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
  /**
   * 外部链接打开方式
   */
  openInNewWindow?: string | boolean

  // backToHome?: string

  /**
   * sidebar menu label
   */
  sidebarMenuLabel?: string

  /**
   * return to top label
   */
  returnToTopLabel?: string

  outlineLabel?: string

  prevPageLabel?: string

  nextPageLabel?: string

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
   * 加密
   */
  encrypt?: PlumeThemeEncrypt

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
