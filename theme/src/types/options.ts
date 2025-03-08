import type { CommentPluginOptions } from '@vuepress/plugin-comment'
import type { ChangelogOptions, ContributorsOptions } from '@vuepress/plugin-git'
import type { ShikiPluginOptions } from '@vuepress/plugin-shiki'
import type { WatermarkPluginOptions } from '@vuepress/plugin-watermark'
import type { LocaleConfig } from 'vuepress'
import type {
  AutoFrontmatterOptions,
  BlogOptions,
  EncryptOptions,
  LastUpdatedOptions,
  MarkdownOptions,
  SearchOptions,
} from './features/index.js'
import type { ThemeLocaleData } from './locale.js'
import type { ThemeBuiltinPlugins } from './plugins.js'

/**
 * 主题配置 （支持热更新）
 */
export interface ThemeConfig extends ThemeLocaleData {
  /**
   * 多语言配置
   */
  locales?: LocaleConfig<ThemeLocaleData>

  /**
   * 站点加密配置
   */
  encrypt?: EncryptOptions
}

/**
 * 主题全量配置
 */
export interface ThemeOptions extends ThemeConfig, ThemeFeatureOptions {

  /**
   * 主题内置插件配置
   *
   * 请勿将此配置与 [vuepress plugins](https://v2.vuepress.vuejs.org/zh/reference/config.html#plugins) 混淆
   */
  plugins?: ThemeBuiltinPlugins

  /**
   * 部署站点域名。
   * 用于生成 sitemap、 seo等。
   *
   */
  hostname?: string

  /**
   * 博客配置
   */
  blog?: false | BlogOptions

  /**
   * 文章链接前缀
   *
   * @default '/article/'
   */
  article?: string

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
}

/**
 * 主题功能配置，此配置用于扁平化管理内置插件、功能
 */
export interface ThemeFeatureOptions {
  /**
   * 是否启用编译缓存
   *
   * @default 'filesystem'
   */
  cache?: false | 'memory' | 'filesystem'

  /**
   * 自定义主题配置文件路径
   */
  configFile?: string

  /**
   * 自动插入 frontmatter
   */
  autoFrontmatter?: false | Omit<AutoFrontmatterOptions, 'frontmatter'>

  /**
   * 是否显示 "编辑此页"
   *
   * @default true
   */
  editLink?: boolean

  /**
   * 最后更新时间
   *
   * @default { formatOptions: { dateStyle: 'short', timeStyle: 'short' } }
   */
  lastUpdated?: false | LastUpdatedOptions

  /**
   * 贡献者配置
   */
  contributors?: boolean | ContributorsOptions & { mode?: 'inline' | 'block' }

  /**
   * 页面变更记录配置
   */
  changelog?: boolean | ChangelogOptions

  /**
   * 站点搜索配置
   *
   * @default { provider: 'local' }
   */
  search?: boolean | SearchOptions

  /**
   * markdown 功能增强配置
   */
  markdown?: MarkdownOptions

  /**
   * 代码块高亮配置，主题使用 `shiki` 作为代码块高亮器
   */
  codeHighlighter?: false | ShikiPluginOptions

  /**
   * 评论配置
   */
  comment?: boolean | CommentPluginOptions

  /**
   * 水印配置
   */
  watermark: boolean | (WatermarkPluginOptions & { fullPage?: boolean })
}
