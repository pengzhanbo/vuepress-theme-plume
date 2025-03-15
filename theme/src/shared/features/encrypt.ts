export interface EncryptOptions {
  /**
   * 是否启用全站加密
   * @default false
   */
  global?: boolean
  /**
   * 超级权限密码, 该密码可以解密全站，以及任意加密的文章
   *
   */
  admin?: string | string[]

  /**
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
