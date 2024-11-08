import type { ChangelogOptions, ContributorsOptions, GitChangelog, GitContributor } from '@vuepress/plugin-git'
import type { LocaleConfig } from 'vuepress/shared'
import type { AutoFrontmatter } from '../auto-frontmatter.js'
import type { PlumeThemeEncrypt } from './encrypt.js'
import type { LastUpdatedOptions, PlumeThemeLocaleData } from './locale.js'
import type { PlumeThemePluginOptions } from './plugins.js'

export interface PlumeThemeOptions extends PlumeThemeLocaleOptions {
  /**
   * 对主题内部使用的插件进行配置
   * @deprecated 配置项迁移至 `plugins`
   */
  themePlugins?: PlumeThemePluginOptions

  /**
   * 对主题内部使用的插件进行配置
   */
  plugins?: PlumeThemePluginOptions

  /**
   * 部署站点域名。
   * 用于生成 sitemap、 seo等。
   *
   */
  hostname?: string

  /**
   * 是否启用编译缓存
   *
   * @default 'filesystem'
   */
  cache?: false | 'memory' | 'filesystem'

  /**
   * 加密配置
   */
  encrypt?: PlumeThemeEncrypt

  /**
   * 自定义主题配置文件路径
   */
  configFile?: string

  /**
   * 自动插入 frontmatter
   */
  autoFrontmatter?: false | Omit<AutoFrontmatter, 'frontmatter'>
}

export type PlumeThemeLocaleOptions = PlumeThemeData

export type PlumeThemeData = PlumeThemeLocaleData & {
  locales?: LocaleConfig<Omit<PlumeThemeLocaleData, 'blog' | 'article'>>

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
  /**
   * 是否显示 "编辑此页"
   *
   * @default true
   */
  editLink?: boolean

  /**
   * 最后更新时间
   *
   * @default { text: 'Last Updated', formatOptions: { dateStyle: 'short', timeStyle: 'short' } }
   */
  lastUpdated?: false | LastUpdatedOptions

  /**
   * 是否显示贡献者
   */
  contributors?: boolean | ContributorsOptions & { mode?: 'inline' | 'block' }

  /**
   * 页面变更记录配置
   */
  changelog?: boolean | ChangelogOptions
}

export * from './bulletin.js'
export * from './encrypt.js'
export * from './locale.js'
export * from './plugins.js'

export {
  type GitChangelog,
  type GitContributor,
}
