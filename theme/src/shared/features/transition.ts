export interface TransitionOptions {
  /**
   * 是否启用 页面间跳转过渡动画
   * @default true
   */
  page?: boolean
  /**
   * 是否启用 博客文章列表过渡动画
   * @default true
   */
  postList?: boolean
  /**
   * 是否启用 深色/浅色 模式切换过渡动画
   * @default 'fade'
   */
  appearance?: boolean | 'fade' | 'circle-clip' | 'horizontal-clip' | 'vertical-clip' | 'skew-clip'
}
