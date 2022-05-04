import type { LocaleConfig } from '@vuepress/core'
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
   * @default 300
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

  locales?: CopyCodeLocaleOption
}

export type CopyCodeLocaleOption = LocaleConfig<CopyCodeLocaleData>

export interface CopyCodeLocaleData {
  /**
   * 复制按钮文字
   */
  copy: string

  /**
   * 复制成功提示文字
   */
  hint: string
}
