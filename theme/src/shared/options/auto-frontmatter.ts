import type { Stats } from 'node:fs'
import type { PlumeThemePageFrontmatter } from '../frontmatter/page.js'

export interface AutoFrontmatterMarkdownFile {
  filepath: string
  relativePath: string
  content: string
  createTime: Date
  stats: Stats
}

export type FrontmatterFn<T = any> = (
  value: T,
  file: AutoFrontmatterMarkdownFile,
  data: PlumeThemePageFrontmatter
) => T | PromiseLike<T>

export type AutoFrontmatterObject<T = any> = Record<string, FrontmatterFn<T>>

export type AutoFrontmatterArray = {
  include: string | string[]
  frontmatter: AutoFrontmatterObject
}[]

export interface AutoFrontmatterOptions {
  /**
   * glob 匹配，被匹配的文件将会自动生成 frontmatter
   *
   * @default ['**\/*.md']
   */
  include?: string | string[]

  /**
   * glob 匹配，被匹配的文件将不会自动生成 frontmatter
   */
  exclude?: string | string[]

  /**
   * 是否自动生成 permalink
   *
   * @default true
   */
  permalink?: boolean
  /**
   * 是否自动生成 createTime
   *
   * 默认读取 文件创建时间，`createTitme` 比 vuepress 默认的 `date` 时间更精准到秒
   */
  createTime?: boolean
  /**
   * 是否自动生成 author
   *
   * 默认读取 `profile.name` 或 `package.json` 的 `author`
   *
   * @deprecated 不再默认生成 `author`, 该配置已废弃
   */
  author?: boolean
  /**
   * 是否自动生成 title
   *
   * 默认读取文件名作为标题
   */
  title?: boolean

  /**
   * {
   *    key(value, file, data) {
   *      return value
   *    }
   * }
   */
  frontmatter?: AutoFrontmatterArray | AutoFrontmatterObject
}
