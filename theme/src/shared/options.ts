import type { CommentPluginOptions } from '@vuepress/plugin-comment'
import type { CopyCodePluginOptions } from '@vuepress/plugin-copy-code'
import type { ChangelogOptions, ContributorsOptions } from '@vuepress/plugin-git'
import type { ReadingTimePluginOptions } from '@vuepress/plugin-reading-time'
import type { ShikiPluginOptions } from '@vuepress/plugin-shiki'
import type { WatermarkPluginOptions } from '@vuepress/plugin-watermark'
import type { ReplaceAssetsPluginOptions } from 'vuepress-plugin-replace-assets'
import type { ThemeBaseData, ThemeData } from './data.js'
import type {
  AutoFrontmatterOptions,
  BlogOptions,
  EncryptOptions,
  LastUpdatedOptions,
  MarkdownOptions,
  SearchOptions,
} from './features/index.js'
import type { ThemeBuiltinPlugins } from './plugins.js'

/**
 * 主题配置 （支持热更新）
 */
export interface ThemeConfig extends ThemeBaseData {
  /**
   * 站点加密配置
   */
  encrypt?: EncryptOptions

  /**
   * 自动插入 frontmatter
   */
  autoFrontmatter?: false | Omit<AutoFrontmatterOptions, 'frontmatter'>
}

/**
 * 主题全量配置
 */
export interface ThemeOptions extends ThemeConfig, ThemeFeatureOptions,
  Omit<ThemeData, 'changelog' | 'contributors' | 'blog'> {

  /**
   * 主题内置插件配置
   *
   * 请勿将此配置与 [vuepress plugins](https://v2.vuepress.vuejs.org/zh/reference/config.html#plugins) 混淆
   */
  plugins?: ThemeBuiltinPlugins
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
   * 博客配置
   */
  blog?: false | BlogOptions

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
  comment?: false | CommentPluginOptions

  /**
   * 水印配置
   */
  watermark?: boolean | (WatermarkPluginOptions & { fullPage?: boolean })

  /**
   * 阅读时间、字数统计
   */
  readingTime?: false | ReadingTimePluginOptions

  /**
   * 代码复制
   */
  copyCode?: false | CopyCodePluginOptions

  /**
   * 资源链接替换
   */
  replaceAssets?: false | ReplaceAssetsPluginOptions
}
