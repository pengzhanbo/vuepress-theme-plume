export interface CopyCodeOptions {
  /**
   * 代码块选择器
   *
   * @default '.theme-default-content dev[class*="language-"] pre'
   */
  selector?: string | string[]

  /**
   * 提示消息显示时间
   *
   * @description 设置为 `0` 将会禁用提示
   *
   * @default 1500
   */
  duration?: number

  /**
   * 是否展示在移动端
   */
  showInMobile?: boolean

  /**
   * 注册复制按钮的延时，单位 ms
   *
   * @default 500
   */
  delay?: number
}
