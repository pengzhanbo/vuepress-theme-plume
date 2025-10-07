export type AutoFrontmatterData = Record<string, any>

/**
 * The context of the markdown file
 *
 * markdown 文件的上下文
 */
export interface AutoFrontmatterContext {
  /**
   * The absolute path to the file
   *
   * 文件绝对路径
   */
  filepath: string
  /**
   * The relative path to the file
   *
   * 文件相对路径
   */
  relativePath: string
  /**
   * The markdown content of the file
   *
   * 文件 markdown 内容
   */
  content: string
}

/**
 * The function to handle the frontmatter data
 *
 * 处理 frontmatter 数据的函数
 *
 * @example
 * ```ts
 * function transform(data, context) {
 *   data.foo ??= 'foo'
 *   return data
 * }
 * ```
 */
export type AutoFrontmatterHandle<
  D extends AutoFrontmatterData = AutoFrontmatterData,
> = (data: D, context: AutoFrontmatterContext) => D | Promise<D>

export interface AutoFrontmatterRule {
  /**
   * File filter, matches the relative path of the file
   *
   * Uses [picomatch](https://github.com/micromatch/picomatch) for pattern matching
   *
   * 文件过滤器，匹配文件的相对路径
   *
   * 使用 [picomatch](https://github.com/micromatch/picomatch) 进行模式匹配
   */
  filter: string[] | string | ((relativePath: string) => boolean)
  /**
   * The function to handle the frontmatter data
   *
   * 处理 frontmatter 数据的函数
   *
   * @example
   * ```ts
   * {
   *   handle: (data, context) => {
   *     data.foo ??= 'foo'
   *     return data
   *   }
   * }
   * ```
   */
  handle: AutoFrontmatterHandle
}

export interface AutoFrontmatterOptions {
  /**
   * 是否自动生成 permalink
   *
   * @default true
   */
  permalink?: boolean
  /**
   * 是否自动生成 createTime
   *
   * 默认读取 文件创建时间，`createTime` 比 vuepress 默认的 `date` 时间更精准到秒
   */
  createTime?: boolean
  /**
   * 是否自动生成 title
   *
   * 默认读取文件名作为标题
   */
  title?: boolean

  /**
   * 自定义 frontmatter 生成函数
   *
   * - 你应该直接将新字段添加到 `data` 中
   * - 如果返回全新的 `data` 对象，会覆盖之前的 frontmatter
   * @param data 页面已存在的 frontmatter
   * @param context 当前页面的上下文信息
   * @param locale 当前语言路径
   * @returns 返回处理后的 frontmatter
   *
   * @example
   * ```ts
   * {
   *   transform: (data, context, locale) => {
   *     data.foo ??= 'foo'
   *     return data
   *   }
   * }
   * ```
   */
  transform?: <
    D extends AutoFrontmatterData = AutoFrontmatterData,
  >(data: D,
    context: AutoFrontmatterContext,
    locale: string
  ) => D | Promise<D>
}
