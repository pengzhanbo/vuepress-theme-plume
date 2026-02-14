import type { SizeOptions } from './size.js'

/**
 * CodeSandbox Token Metadata
 *
 * CodeSandbox 令牌元数据
 */
export interface CodeSandboxTokenMeta extends SizeOptions {
  /**
   * User name
   *
   * 用户名
   */
  user?: string
  /**
   * Sandbox ID
   *
   * 沙箱 ID
   */
  id?: string
  /**
   * Layout
   *
   * 布局
   */
  layout?: string
  /**
   * Embed type
   *
   * 嵌入类型
   */
  type?: 'button' | 'embed'
  /**
   * Title
   *
   * 标题
   */
  title?: string
  /**
   * File path
   *
   * 文件路径
   */
  filepath?: string
  /**
   * Whether to show navbar
   *
   * 是否显示导航栏
   */
  navbar?: boolean
  /**
   * Whether to show console
   *
   * 是否显示控制台
   */
  console?: boolean
}
