import type { Stats } from 'node:fs'

export interface AutoFrontmatterMarkdownFile {
  filepath: string
  relativePath: string
  content: string
  createTime: Date
  stats: Stats
}

export type FrontmatterFn<T = any, K = object> = (
  value: T,
  file: AutoFrontmatterMarkdownFile,
  data: K
) => T | PromiseLike<T>

export type AutoFrontmatterObject<K = object, T = any> = Record<string, FrontmatterFn<T, K>>

export type AutoFrontmatterArray = {
  include: string | string[]
  frontmatter: AutoFrontmatterObject
}[]

export interface AutoFrontmatter {
  /**
   * FilterPattern
   */
  include?: string | string[]

  exclude?: string | string[]

  /**
   * {
   *    key(value, file, data) {
   *      return value
   *    }
   * }
   */
  frontmatter?: AutoFrontmatterArray | AutoFrontmatterObject
}
