export interface MarkdownFile {
  filepath: string
  relativePath: string
  content: string
  createTime: Date
}

export interface FormatterFn<T = any, K = object> {
  (value: T, data: K, file: MarkdownFile): T
}

export type FormatterObject<K = object, T = any> = Record<
  string,
  FormatterFn<T, K>
>

export type FormatterArray = {
  include: string
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
   *    key(value, data, file) {
   *      return value
   *    }
   * }
   */
  formatter?: FormatterObject | FormatterArray
}
