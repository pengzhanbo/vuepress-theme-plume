import type { AutoFrontmatterOptions } from './auto-frontmatter.js'
import type { EncryptOptions } from './encrypt.js'
import type { PlumeThemeData } from './locale.js'
import type { PlumeThemePluginOptions } from './plugins.js'

export type PlumeThemeLocaleOptions = PlumeThemeData

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
  encrypt?: EncryptOptions

  /**
   * 自定义主题配置文件路径
   */
  configFile?: string

  /**
   * 自动插入 frontmatter
   */
  autoFrontmatter?: false | Omit<AutoFrontmatterOptions, 'frontmatter'>
}
