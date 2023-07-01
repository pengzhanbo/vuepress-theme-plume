import type fs from 'node:fs'
export interface MarkdownFile {
  filepath: string
  relativePath: string
  content: string
  createTime: Date
  stats: fs.Stats
}

export type FrontmatterFn<T = any, K = object> = (
  value: T,
  file: MarkdownFile,
  data: K
) => T | PromiseLike<T>

export type FrontmatterObject<K = object, T = any> = {
  [P: string]: FrontmatterFn<T, K>
}

export type FrontmatterArray = {
  include: string | string[]
  frontmatter: FrontmatterObject
}[]

export interface AutoFrontmatterOptions {
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
  frontmatter?: FrontmatterArray | FrontmatterObject
}
