import type { SizeOptions } from './size'

/**
 * CodePen Token Metadata
 *
 * CodePen 令牌元数据
 */
export interface CodepenTokenMeta extends SizeOptions {
  /**
   * Pen title
   *
   * Pen 标题
   */
  title?: string
  /**
   * User name
   *
   * 用户名
   */
  user?: string
  /**
   * Pen slug
   *
   * Pen 标识
   */
  slash?: string
  /**
   * Display tabs
   *
   * 显示的选项卡
   */
  tab?: string
  /**
   * Theme
   *
   * 主题
   */
  theme?: string
  /**
   * Whether to show preview
   *
   * 是否显示预览
   */
  preview?: boolean
  /**
   * Whether editable
   *
   * 是否可编辑
   */
  editable?: boolean
}
