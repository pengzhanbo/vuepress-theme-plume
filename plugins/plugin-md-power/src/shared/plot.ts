/**
 * 是否启用 `!! !!`  markdown （该标记为非标准标记，脱离插件将不生效）
 */
export interface PlotOptions {
  /**
   * 触发方式
   *
   * @default 'hover'
   */
  trigger?: 'hover' | 'click'

  /**
   * 遮罩层效果
   *
   * @default 'mask'
   */
  effect?: 'mask' | 'blur'

}
