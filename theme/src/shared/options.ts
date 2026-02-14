import type { Prettify } from '@pengzhanbo/utils'
import type { CommentPluginOptions } from '@vuepress/plugin-comment'
import type { CopyCodePluginOptions } from '@vuepress/plugin-copy-code'
import type { ChangelogOptions, ContributorsOptions } from '@vuepress/plugin-git'
import type { LlmsPluginOptions } from '@vuepress/plugin-llms'
import type { ReadingTimePluginOptions } from '@vuepress/plugin-reading-time'
import type { ReplaceAssetsPluginOptions } from '@vuepress/plugin-replace-assets'
import type { ShikiPluginOptions } from '@vuepress/plugin-shiki'
import type { WatermarkPluginOptions } from '@vuepress/plugin-watermark'
import type { ThemeBaseData, ThemeData } from './data.js'
import type {
  AutoFrontmatterOptions,
  EncryptOptions,
  LastUpdatedOptions,
  MarkdownOptions,
  SearchOptions,
} from './features/index.js'
import type { ThemeBuiltinPlugins } from './plugins.js'

/**
 * Theme configuration (supports hot reload)
 * Core theme settings that can be updated during development
 *
 * 主题配置（支持热更新）
 * 可在开发过程中更新的核心主题设置
 */
export interface ThemeConfig extends ThemeBaseData {
  /**
   * Site encryption configuration
   * 站点加密配置
   */
  encrypt?: EncryptOptions

  /**
   * Automatic frontmatter insertion
   * 自动插入 frontmatter
   */
  autoFrontmatter?: false | Omit<AutoFrontmatterOptions, 'frontmatter'>
}

/**
 * Full theme configuration
 * Complete theme options including all features
 *
 * 主题全量配置
 * 包含所有功能的完整主题选项
 */
export interface ThemeOptions extends ThemeConfig, ThemeFeatureOptions,
  Omit<ThemeData, 'changelog' | 'contributors' | 'blog'> {

  /**
   * Theme built-in plugins configuration
   * Do not confuse this with [vuepress plugins](https://v2.vuepress.vuejs.org/zh/reference/config.html#plugins)
   *
   * 主题内置插件配置
   * 请勿将此配置与 [vuepress plugins](https://v2.vuepress.vuejs.org/zh/reference/config.html#plugins) 混淆
   */
  plugins?: ThemeBuiltinPlugins
}

/**
 * Theme feature configuration
 * Used for flat management of built-in plugins and features
 *
 * 主题功能配置
 * 此配置用于扁平化管理内置插件、功能
 */
export interface ThemeFeatureOptions {
  /**
   * Whether to enable compilation cache
   * 是否启用编译缓存
   * @default 'filesystem'
   */
  cache?: false | 'memory' | 'filesystem'

  /**
   * Custom theme configuration file path
   * 自定义主题配置文件路径
   */
  configFile?: string

  /**
   * Blog configuration
   * 博客配置
   * @deprecated Use {@link collections} instead / 使用 {@link collections} 代替
   */
  blog?: never

  /**
   * Whether to show "Edit this page" link
   * 是否显示 "编辑此页"
   * @default true
   */
  editLink?: boolean

  /**
   * Last updated time configuration
   * 最后更新时间
   * @default { formatOptions: { dateStyle: 'short', timeStyle: 'short' } }
   */
  lastUpdated?: false | LastUpdatedOptions

  /**
   * Contributors configuration
   * 贡献者配置
   */
  contributors?: boolean | Prettify<ContributorsOptions & { mode?: 'inline' | 'block' }>

  /**
   * Page changelog configuration
   * 页面变更记录配置
   */
  changelog?: boolean | ChangelogOptions

  /**
   * Site search configuration
   * 站点搜索配置
   * @default { provider: 'local' }
   */
  search?: boolean | SearchOptions

  /**
   * Markdown enhancement configuration
   * markdown 功能增强配置
   */
  markdown?: MarkdownOptions

  /**
   * Code block highlight configuration
   * Theme uses `shiki` as the code block highlighter
   * 代码块高亮配置，主题使用 `shiki` 作为代码块高亮器
   */
  codeHighlighter?: false | ShikiPluginOptions

  /**
   * Comment configuration
   * 评论配置
   */
  comment?: false | CommentPluginOptions

  /**
   * Watermark configuration
   * 水印配置
   */
  watermark?: boolean | Prettify<WatermarkPluginOptions & { fullPage?: boolean }>

  /**
   * Reading time and word count statistics
   * 阅读时间、字数统计
   */
  readingTime?: false | ReadingTimePluginOptions

  /**
   * Code copy configuration
   * 代码复制
   */
  copyCode?: false | CopyCodePluginOptions

  /**
   * Asset link replacement configuration
   * 资源链接替换
   */
  replaceAssets?: false | ReplaceAssetsPluginOptions

  /**
   * llmstxt configuration
   * llmstxt 配置
   */
  llmstxt?: boolean | LlmsPluginOptions
}
