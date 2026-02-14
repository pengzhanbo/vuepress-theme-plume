import type { LiteralUnion } from '@pengzhanbo/utils'

/**
 * Auto frontmatter data fields
 *
 * 自动 frontmatter 数据字段
 */
export type AutoFrontmatterData = Record<
  LiteralUnion<'title' | 'createTime' | 'permalink'>,
  any
>

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

/**
 * Auto frontmatter rule
 *
 * 自动 frontmatter 规则
 */
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

/**
 * Auto frontmatter options
 *
 * 自动 frontmatter 选项
 */
export interface AutoFrontmatterOptions {
  /**
   * 是否自动生成 permalink
   *
   * - `false`: 不自动生成 permalink
   * - `true`: 自动生成 permalink ，使用 nanoid 生成 8 位数随机字符串
   * - `filepath`: 根据文件路径生成 permalink
   *
   * 对于 `filepath`，如果文件路径中包含中文，可以手动安装 `pinyin-pro` ，
   * 主题内部会加载 `pinyin-pro` 进行中文拼音转换
   *
   * @default true
   */
  permalink?: boolean | 'filepath'
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
  transform?: (data: AutoFrontmatterData, context: AutoFrontmatterContext, locale: string) => AutoFrontmatterData | Promise<AutoFrontmatterData>
}
