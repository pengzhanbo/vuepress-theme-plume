/**
 * CanIUse Display Mode
 *
 * CanIUse 显示模式
 */
export type CanIUseMode
  = | 'embed'
    | 'baseline'
    /** @deprecated */
    | 'image'

/**
 * CanIUse Token Metadata
 *
 * CanIUse 令牌元数据
 */
export interface CanIUseTokenMeta {
  /**
   * Feature name
   *
   * 特性名称
   */
  feature: string
  /**
   * Display mode
   *
   * 显示模式
   */
  mode: CanIUseMode
  /**
   * Browser versions to display
   *
   * 要显示的浏览器版本
   */
  versions: string
}

/**
 * CanIUse Options
 *
 * CanIUse 配置选项
 */
export interface CanIUseOptions {
  /**
   * Embed mode
   *
   * embed - embed via iframe, providing interactive view
   *
   * image - embed via image, static
   *
   * 嵌入模式
   *
   * embed 通过iframe嵌入，提供可交互视图
   *
   * image 通过图片嵌入，静态
   *
   * @default 'embed'
   */
  mode?: CanIUseMode
}
