import type { LocaleData } from 'vuepress'
import type { SocialLink, SocialLinkIconUnion, ThemeOutline } from './common/index.js'
import type {
  BulletinOptions,
  CopyrightLicense,
  CopyrightOptions,
  ProfileOptions,
  ThemeNavItem,
  ThemeNoteListOptions,
  ThemeSidebarMulti,
  TransitionOptions,
} from './features/index.js'

/**
 * 内置的多语言配置
 */
export interface PresetLocale extends Record<CopyrightLicense, string> {}

export interface ThemeLocale extends LocaleData {
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
   * 配置博主拥有者 个人资料
   *
   * 显示在博客右侧侧边栏
   */
  profile?: ProfileOptions

  /**
   * 社交账号配置
   */
  social?: SocialLink[]

  /**
   * 导航栏配置
   *
   * 设置为 `false` 将会禁用导航栏
   */
  navbar?: false | ThemeNavItem[]

  /**
   * 允许显示在导航栏的社交类型
   * @default ['github', 'twitter', 'discord', 'facebook']
   */
  navbarSocialInclude?: (SocialLinkIconUnion | (string & { zz_IGNORE_ME?: never }))[]

  /**
   * 笔记配置， 笔记中的文章默认不会出现在首页文章列表
   *
   * 注：也可以将notes配置到navbar中
   */
  notes?: false | ThemeNoteListOptions

  /**
   * 侧边栏配置
   */
  sidebar?: ThemeSidebarMulti

  /**
   * 是否显示侧边栏滚动条
   * @default true
   */
  sidebarScrollbar?: boolean

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
   * 配置公告
   */
  bulletin?: true | BulletinOptions

  /**
   * 配置版权信息
   * @default false
   */
  copyright?: boolean | CopyrightLicense | CopyrightOptions

  /**
   * 是否启用过渡动画效果
   *
   * @default true
   */
  transition?: boolean | TransitionOptions

  /**
   * "编辑此页" 的链接匹配模式
   *
   * @example ':repo/edit/:branch/:path'
   */
  editLinkPattern?: string

  /**
   * 是否显示上一页
   *
   * @default true
   */
  prevPage?: boolean

  /**
   * 是否显示下一页
   *
   * @default true
   */
  nextPage?: boolean

  /**
   * 是否显示外部链接图标
   *
   * @default true
   */
  externalLinkIcon?: boolean

  /**
   * 是否在文章页显示创建时间
   *
   * @default true
   */
  createTime?: boolean | 'only-blog'

  /**
   * 页脚配置
   */
  footer?:
    | false
    | {
      message?: string
      copyright?: string
    }
}

/**
 * 已弃用的配置
 */
export interface ThemeLocaleDeprecated {
  /**
   * @deprecated 弃用，使用 `profile` 代替
   */
  avatar?: ProfileOptions
}

/**
 * 主题多语言文本配置
 */
export interface ThemeLocaleText {
  /**
   * 深色模式切换按钮的文本
   * @default 'Appearance'
   */
  appearanceText?: string
  /**
   * 切换到浅色模式提示文本
   * @default 'Switch to light theme'
   */
  lightModeSwitchTitle?: string
  /**
   * 切换到深色模式的提示文本
   * @default 'Switch to dark theme'
   */
  darkModeSwitchTitle?: string

  /**
   * 版权所有的文本
   * @default 'Copyright'
   */
  copyrightText?: string

  /**
   * 版权归属者的文本
   * @default 'Copyright Ownership:'
   */
  copyrightAuthorText?: string

  /**
   * 本文链接的文本
   * @default 'This article link:'
   */
  copyrightCreationOriginalText?: string

  /**
   * 本文翻译链接的文本
   * @default 'This article is translated from:'
   */
  copyrightCreationTranslateText?: string

  /**
   * 转载链接的文本
   * @default 'This article is reprint from:'
   */
  copyrightCreationReprintText?: string

  /**
   * 许可证的文本
   * @default 'License under:'
   */
  copyrightLicenseText?: string

  /**
   * 选择语言菜单 的文本。
   * @default 'Languages'
   */
  selectLanguageText?: string
  /**
   * 选择语言菜单 的 `aria-label` 属性。
   */
  selectLanguageAriaLabel?: string
  /**
   * 语言名称
   *
   * 仅能在主题配置的 locales 的内部生效 。
   * 它将被用作 locale 的语言名称，展示在 选择语言菜单 内。
   */
  selectLanguageName?: string

  /**
   * "编辑此页" 的文本
   *
   * @default "Edit this page"
   */
  editLinkText?: string

  /**
   * "最后更新时间" 的文本
   *
   * @default 'Last updated'
   */
  lastUpdatedText?: string

  /**
   * 贡献者的文本
   * @default 'Contributors'
   */
  contributorsText?: string

  /**
   * 变更历史的文本
   * @default 'Changelog'
   */
  changelogText?: string

  /**
   * 单次变更记录的时间文本
   * @default 'On'
   */
  changelogOnText?: string

  /**
   * 查看完整的变更历史的文本
   *
   * @default 'View All Changelog'
   */
  changelogButtonText?: string

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
   * 上一页的文本
   *
   * @default 'Previous Page'
   */
  prevPageLabel?: string

  /**
   * 下一页的文本
   *
   * @default 'Next Page'
   */
  nextPageLabel?: string

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
   * 页脚
   */
  footer?: {
    message?: string
    copyright?: string
  }

  /**
   * 首页文本，用于默认生成的导航栏、面包屑导航中
   */
  homeText?: string
  /**
   * 博客文本，用于默认生成的导航栏、面包屑导航中
   */
  blogText?: string
  /**
   * 标签文本，用于默认生成的导航栏、博客标签页中
   */
  tagText?: string
  /**
   * 归档文本，用于默认生成的导航栏、博客归档页中
   */
  archiveText?: string
  /**
   * 分类文本，用于默认生成的导航栏、博客分类页中
   */
  categoryText?: string
  /**
   * 博客总数文本，用于默认生成的导航栏、博客归档页中
   * @default '{count} articles''
   */
  archiveTotalText?: string

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
