export interface PlotOptions {
  /**
   * 是否启用 `!! !!`  markdown （该标记为非标准标记，脱离插件将不生效）
   * @default true
   */
  tag?: boolean

  /**
   * 遮罩层颜色
   */
  mask?: string | { light: string, dark: string }

  /**
   * 文本颜色
   */
  color?: string | { light: string, dark: string }

  /**
   * 触发方式
   *
   * @default 'hover'
   */
  trigger?: 'hover' | 'click'
}
