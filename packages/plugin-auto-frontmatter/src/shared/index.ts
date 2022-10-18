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
  glob: string
  formatter: FormatterObject
}[]

export interface AutoFrontmatterOptions {
  /**
   * glob string
   */
  glob?: string | string[]

  /**
   * {
   *    key(value, data, file) {
   *      return value
   *    }
   * }
   */
  formatter?: FormatterObject | FormatterArray
}
