import type { SizeOptions } from './size'

/**
 * JSFiddle token metadata
 *
 * JSFiddle 令牌元数据
 */
export interface JSFiddleTokenMeta extends SizeOptions {
  /**
   * Source URL
   *
   * 源 URL
   */
  source: string
  /**
   * Fiddle title
   *
   * Fiddle 标题
   */
  title?: string
  /**
   * Theme
   *
   * 主题
   */
  theme?: string
  /**
   * Display tabs
   *
   * 显示的选项卡
   */
  tab?: string
}
