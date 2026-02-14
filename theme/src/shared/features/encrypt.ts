/**
 * Encryption options
 * Configuration for site-wide and article-level encryption
 *
 * 加密配置
 * 用于全站和文章级别加密的配置
 */
export interface EncryptOptions {
  /**
   * Enable site-wide encryption
   * 是否启用全站加密
   * @default false
   */
  global?: boolean
  /**
   * Super admin password, can decrypt the entire site and any encrypted articles
   * 超级权限密码, 该密码可以解密全站，以及任意加密的文章
   */
  admin?: string | string[]

  /**
   * Article passwords, can encrypt single articles or entire directories
   * by matching the article's markdown file relative path, page access path,
   * or directory path. If starts with `^`, it's treated as a regex pattern.
   *
   * 文章密码， 可以通过 文章的 markdown 文件相对路径、页面访问路径、
   * 目录路径 等，对 单个文章 或者 整个目录 进行 加密。
   * 如果是以 `^` 开头，则被认为是类似于正则表达式进行匹配。
   *
   * @example
   * ```json
   * {
   *   "前端/基础/html.md": "123",
   *   "/article/23c44c/": ["456", "789"],
   *   "^/note/(note1|note2)/": "123"
   * }
   * ```
   */
  rules?: {
    [key: string]: string | string[]
  }
}
