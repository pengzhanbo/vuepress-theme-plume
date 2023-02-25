import type fs from 'node:fs'
export interface MarkdownFile {
  filepath: string
  relativePath: string
  content: string
  createTime: Date
  stats: fs.Stats
}

export type FormatterFn<T = any, K = object> = (
  value: T,
  file: MarkdownFile,
  data: K
) => T | PromiseLike<T>

export type FormatterObject<K = object, T = any> = {
  [P: string]: FormatterFn<T, K>
}

export type FormatterArray = {
  include: string | string[]
  formatter: FormatterObject
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
  formatter?: FormatterArray | FormatterObject
}
