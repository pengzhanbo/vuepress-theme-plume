import type { LiteralUnion } from '@pengzhanbo/utils'
import type { LocaleData } from 'vuepress'
import type { SocialLink, SocialLinkIconUnion, ThemeOutline, ThemeReadAid } from './common/index.js'
import type {
  BulletinOptions,
  CopyrightLicense,
  CopyrightOptions,
  FeedOptions,
  LinkPreviewOptions,
  ProfileOptions,
  ReaderPreferencesOptions,
  RelatedPostsOptions,
  SeriesOptions,
  ThemeCollections,
  ThemeNavItem,
  ThemeSidebarMulti,
  TransitionOptions,
} from './features/index.js'

/**
 * Built-in multilingual configuration
 *
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
  navbarSocialInclude?: LiteralUnion<SocialLinkIconUnion>[]

  /**
   * 笔记配置， 笔记中的文章默认不会出现在首页文章列表
   *
   * 注：也可以将notes配置到navbar中
   *
   * @deprecated 使用 {@link collections} 代替
   */
  notes?: never

  /**
   * 侧边栏配置
   */
  sidebar?: ThemeSidebarMulti

  /**
   * 文章集合，当前支持 博客类型 或 文档类型
   */
  collections?: ThemeCollections

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
   * - `'left'` 表示将有侧边栏移动到文章内容左侧，sidebar 右侧
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
  createTime?: boolean | 'only-posts'

  /**
   * 页脚配置
   */
  footer?:
    | false
    | {
      message?: string
      copyright?: string
    }

  /**
   * 配置阅读辅助线。
   *
   * 该配置将被合并到 collections 中的每个集合中。
   *
   * @default false
   * @deprecated 请改用 `readerPreferences.readAid`，阅读辅助线已并入阅读偏好，
   * 且可以在客户端的面板中切换。此处配置仍会作为默认形态生效
   * （`readerPreferences.readAid` 未指定默认形态时）。
   */
  readAid?: boolean | ThemeReadAid

  /**
   * 配置阅读偏好（阅读进度、继续阅读、内容宽度、护眼背景、专注模式）
   *
   * - `true` 表示启用全部子项
   * - `false` 表示完全关闭
   * - 传入对象可逐项开关
   *
   * 该配置按**语言环境**生效，可在 `locales` 中为不同语言单独设置
   * @default false
   */
  readerPreferences?: boolean | ReaderPreferencesOptions

  /**
   * 配置相关文章推荐
   *
   * - `true` 表示启用并使用默认配置
   * - `false` 表示关闭
   *
   * 集合级配置（`collections[].relatedPosts`）优先于该配置
   * @default false
   */
  relatedPosts?: boolean | RelatedPostsOptions

  /**
   * 配置系列（专栏）
   *
   * - `true` 表示启用并使用默认配置
   * - `false` 表示关闭
   *
   * 系列是**跨集合**的内容分组维度：不改变 URL、不改变路由，仅补充顺序与目录。
   * 页面通过 frontmatter `series` 声明归属。
   *
   * @default false
   */
  series?: boolean | SeriesOptions

  /**
   * 配置内链悬浮预览
   *
   * - `true` 表示启用并使用默认配置
   * - `false` 表示关闭
   *
   * 该配置按**语言环境**生效，可在 `locales` 中为不同语言单独设置
   *
   * Configure internal link previews. Enabled per locale.
   *
   * @default false
   */
  linkPreview?: boolean | LinkPreviewOptions

  /**
   * Configure feed subscriptions
   *
   * - `true` 表示启用并使用默认配置
   * - `false` 表示关闭
   *
   * 需要同时配置 `hostname` 才能生成绝对链接。
   *
   * 配置 Feed 订阅
   *
   * @default false
   */
  feed?: boolean | FeedOptions
}

/**
 * Deprecated theme locale configuration
 *
 * 已弃用的配置
 */
export interface ThemeLocaleDeprecated {
  /**
   * @deprecated 弃用，使用 `profile` 代替
   */
  avatar?: ProfileOptions
}

/**
 * Theme multilingual text configuration
 *
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
   * 关闭按钮的无障碍标签，用于弹窗、面板等关闭按钮。
   *
   * @default 'Close'
   */
  closeLabel?: string

  /**
   * 跳转到主要内容链接的无障碍文本。
   *
   * @default 'Skip to content'
   */
  skipToContentLabel?: string

  /**
   * 移动端导航菜单按钮的无障碍标签。
   *
   * @default 'Mobile navigation'
   */
  mobileNavLabel?: string

  /**
   * 打印按钮的无障碍标签。
   *
   * @default 'Print'
   */
  printLabel?: string

  /**
   * 首页向下滚动指示器的无障碍标签。
   *
   * @default 'Scroll down'
   */
  scrollDownLabel?: string

  /**
   * 侧边栏导航区域的无障碍名称。
   *
   * @default 'Sidebar Navigation'
   */
  sidebarNavigationLabel?: string

  /**
   * 侧边栏折叠/展开按钮的无障碍标签。
   *
   * @default 'Toggle sidebar'
   */
  toggleSidebarLabel?: string

  /**
   * 公告（Bulletin）面板的无障碍名称，当公告未提供标题时使用。
   *
   * @default 'Announcement'
   */
  bulletinLabel?: string

  /**
   * 文档页脚「上一页 / 下一页」导航区域的无障碍名称。
   *
   * @default 'Document navigation'
   */
  docFooterNavLabel?: string

  /**
   * 分页导航区域的无障碍名称。
   *
   * @default 'Pagination'
   */
  paginationLabel?: string

  /**
   * 相关文章区块的标题。
   *
   * @default 'Related Posts'
   */
  relatedPostsText?: string

  /**
   * 相关文章区块的无障碍名称。
   *
   * @default 'Related posts'
   */
  relatedPostsLabel?: string

  /**
   * 系列落地页的类别前缀
   *
   * @default 'Series'
   */
  seriesText?: string
  /**
   * 系列总览页的标题，同时作为该页面的 `<title>`
   *
   * @default 'All Series'
   */
  seriesIndexText?: string
  /**
   * 文末系列区块的无障碍名称
   *
   * @default 'Series navigation'
   */
  seriesNavLabel?: string
  /**
   * 文首提示的前缀
   *
   * @default 'This post is part of'
   */
  seriesIncludedText?: string
  /**
   * 系列名的展示形态，书名号随语言变化，`{title}` 会被替换为系列标题
   *
   * @default '“{title}”'
   */
  seriesNameText?: string
  /**
   * 文首提示的篇号，`{index}` / `{total}` 会被替换为实际值
   *
   * @default '{index} of {total}'
   */
  seriesChapterText?: string
  /**
   * 文末「下一篇」标签
   *
   * @default 'Next'
   */
  seriesNextText?: string
  /**
   * 末篇提示
   *
   * @default 'Completed'
   */
  seriesFinishedText?: string
  /**
   * 开发模式下草稿章节的徽标
   *
   * @default 'Draft'
   */
  seriesDraftText?: string
  /**
   * 落地页的篇数统计，`{count}` 会被替换为实际值
   *
   * @default '{count} chapters'
   */
  seriesTotalText?: string
  /**
   * 落地页订阅按钮的文本，仅在生成了系列 feed 时显示
   *
   * @default 'Subscribe'
   */
  seriesFeedText?: string

  /**
   * 阅读偏好入口的文本
   *
   * @default 'Reading'
   */
  readerPreferencesText?: string

  /**
   * 阅读偏好面板的标题
   *
   * @default 'Reading settings'
   */
  readerPanelLabel?: string

  /**
   * 内容宽度分组的文本
   *
   * @default 'Content width'
   */
  readerWidthText?: string

  /**
   * 窄档位的文本
   *
   * @default 'Narrow'
   */
  readerWidthNarrowText?: string

  /**
   * 标准档位的文本
   *
   * @default 'Standard'
   */
  readerWidthStandardText?: string

  /**
   * 宽档位的文本
   *
   * @default 'Wide'
   */
  readerWidthWideText?: string

  /**
   * 铺满档位的文本
   *
   * @default 'Full'
   */
  readerWidthFullText?: string

  /**
   * 护眼背景分组的文本
   *
   * @default 'Background'
   */
  readerThemeText?: string

  /**
   * 默认背景的文本
   *
   * @default 'Default'
   */
  readerThemeDefaultText?: string

  /**
   * 暖白背景的文本
   *
   * @default 'Warm'
   */
  readerThemeWarmText?: string

  /**
   * 纸黄背景的文本
   *
   * @default 'Sepia'
   */
  readerThemeSepiaText?: string

  /**
   * 深色模式下护眼背景不可用的提示
   *
   * @default 'Not available in dark mode'
   */
  readerThemeDarkDisabledText?: string

  /**
   * 品牌色分组的文本
   *
   * @default 'Brand color'
   */
  readerBrandText?: string

  /**
   * 品牌色「默认」档位的文本
   *
   * @default 'Default'
   */
  readerBrandDefaultText?: string

  /**
   * 阅读辅助线分组的文本
   *
   * @default 'Reading aid'
   */
  readerAidText?: string

  /**
   * 关闭阅读辅助线的文本
   *
   * @default 'Off'
   */
  readerAidOffText?: string

  /**
   * 遮罩形态的文本
   *
   * @default 'Mask'
   */
  readerAidMaskText?: string

  /**
   * 左侧辅助线的文本
   *
   * @default 'Left'
   */
  readerAidLeftText?: string

  /**
   * 右侧辅助线的文本
   *
   * @default 'Right'
   */
  readerAidRightText?: string

  /**
   * 恢复默认偏好的文本
   *
   * @default 'Reset'
   */
  readerResetText?: string

  /**
   * 继续阅读提示的文本，`{percent}` 会被替换为百分比
   *
   * @default 'Last read {percent}%'
   */
  readerResumeText?: string

  /**
   * 继续阅读按钮的文本
   *
   * @default 'Continue'
   */
  readerResumeActionText?: string

  /**
   * 从头开始按钮的文本
   *
   * @default 'Start over'
   */
  readerResumeRestartText?: string

  /**
   * 专注模式的文本
   *
   * @default 'Focus mode'
   */
  readerFocusModeText?: string

  /**
   * 退出专注模式按钮的文本
   *
   * @default 'Exit focus mode'
   */
  readerFocusModeExitLabel?: string

  /**
   * 进入专注模式时的无障碍播报
   *
   * @default 'Focus mode on, press Esc to exit'
   */
  readerFocusModeEnterText?: string

  /**
   * 阅读进度条的无障碍名称
   *
   * @default 'Reading progress'
   */
  readerProgressLabel?: string

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
   * 打开新窗口的文本
   *
   * @default '(Open in new window)'
   */
  openNewWindowText?: string

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
  postsText?: string
  /**
   * 文章导航面板触发按钮的无障碍标签，供屏幕阅读器朗读
   * @default 'Posts Navigation'
   */
  postsExtractLabel?: string
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

  /**
   * 加密密码校验失败时的提示文本
   * @default 'Incorrect password'
   */
  encryptErrorText?: string

  // 以下字段与 PageContextMenu 相关 ------ start

  /**
   * 打开页面操作菜单按钮的无障碍名称
   *
   * Accessible name of the button that opens the page actions menu.
   * @default 'Open page actions menu'
   */
  pageContextMenuLabel?: string
  /**
   * 复制页面的文本
   */
  copyPageText?: string
  /**
   * 复制页面成功的文本
   */
  copiedPageText?: string
  /**
   * 复制页面中的文本
   */
  copingPageText?: string
  /**
   * 复制页面的标签文本
   */
  copyTagline?: string
  /**
   * 查看 Markdown 文本
   */
  viewMarkdown?: string
  /**
   * 查看 Markdown 标签文本
   */
  viewMarkdownTagline?: string
  /**
   * 咨询 AI 文本
   */
  askAIText?: string
  /**
   * 咨询 AI 标签文本
   */
  askAITagline?: string
  /**
   * 咨询 AI 消息文本
   */
  askAIMessage?: string

  // 以上字段与 PageContextMenu 相关 ------ end
}
