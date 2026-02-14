/**
 * Transition animation options
 *
 * 过渡动画选项
 */
export interface TransitionOptions {
  /**
   * Enable page transition animation
   *
   * 是否启用 页面间跳转过渡动画
   * @default true
   */
  page?: boolean
  /**
   * Enable blog post list transition animation
   *
   * 是否启用 博客文章列表过渡动画
   * @default true
   */
  postList?: boolean
  /**
   * Enable dark/light mode switch transition animation
   *
   * 是否启用 深色/浅色 模式切换过渡动画
   * @default 'fade'
   */
  appearance?: boolean | 'fade' | 'circle-clip' | 'horizontal-clip' | 'vertical-clip' | 'skew-clip' | 'blinds-vertical' | 'blinds-horizontal' | 'soft-blur-fade' | 'diamond-reveal'
}
