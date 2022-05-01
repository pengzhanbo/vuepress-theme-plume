export type CanIUseMode = 'embed' | 'image'

/**
 * can-i-use plugin options
 */
export interface CanIUsePluginOptions {
  /**
   * 嵌入模式
   *
   * embed 通过iframe嵌入，提供可交互视图
   *
   * image 通过图片嵌入，静态
   */
  mode: CanIUseMode
}
