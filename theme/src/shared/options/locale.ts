import type { LocaleData } from '@vuepress/core'
import type { NotesDataOptions } from '@vuepress-plume/plugin-notes-data'
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
  | 'qq'
  | 'weibo'
  | 'bilibili'
  | { svg: string }

export interface PlumeThemeBlog {
  /**
     * blog 文章读取目录
     *
     * @default './' 即 vuepress 配置的 source 目录
     */
  dir?: string

  /**
   * blog list link
   *
   * @default '/blog/'
   */
  link?: string

  /**
   * 在 `blog.dir` 目录中，通过 glob string 配置包含文件
   *
   * @default - ['**\*.md']
   */
  include?: string[]

  /**
   * 在 `blog.dir` 目录中，通过 glob string 配置排除的文件
   *
   *  _README.md 文件一般作为主页或者某个目录下的主页，不应该被读取为 blog文章_
   *
   * @default - ['.vuepress/', 'node_modules/', '{README,index}.md']
   */
  exclude?: string[]

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
  lastUpdated?: boolean

  /**
   * Page meta - last updated config
   *
   * The text to replace the default "Last Updated"
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
}
