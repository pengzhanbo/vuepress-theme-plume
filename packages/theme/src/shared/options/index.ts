import type { ThemeData } from '@vuepress/plugin-theme-data'
import type { PlumeThemeLocaleData } from './locale.js'
import type { PlumeThemePluginOptions } from './plugins.js'

export interface PlumeThemeOptions extends PlumeThemeLocaleOptions {
  /**
   * 对主题内部使用的插件进行配置
   */
  themePlugins?: PlumeThemePluginOptions

  /**
   * 是否仅使用博客功能
   *
   * @default false
   */
  onlyBlog?: boolean

  blog?: {
    /**
     * blog 文章读取目录
     *
     * @default './' 即 vuepress 配置的 source 目录
     */
    dir?: string

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
  }

  notes?: {
    dir?: string
  }
}

export type PlumeThemeLocaleOptions = PlumeThemeData

export type PlumeThemeData = ThemeData<PlumeThemeLocaleData>

export * from './locale.js'
export * from './plugins.js'
