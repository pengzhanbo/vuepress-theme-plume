import type { BuiltinTheme, ThemeRegistration } from 'shiki'

/**
 * Theme options for REPL
 *
 * REPL 主题选项
 */
export type ThemeOptions
  = | BuiltinTheme
    | {
      /**
       * Light theme
       *
       * 浅色主题
       */
      light: BuiltinTheme
      /**
       * Dark theme
       *
       * 深色主题
       */
      dark: BuiltinTheme
    }

/**
 * REPL options
 *
 * REPL 配置选项
 */
export interface ReplOptions {
  /**
   * Theme for code editor
   *
   * 代码编辑器主题
   */
  theme?: ThemeOptions

  /**
   * Whether to enable Go language support
   *
   * 是否启用 Go 语言支持
   */
  go?: boolean
  /**
   * Whether to enable Kotlin language support
   *
   * 是否启用 Kotlin 语言支持
   */
  kotlin?: boolean
  /**
   * Whether to enable Rust language support
   *
   * 是否启用 Rust 语言支持
   */
  rust?: boolean
  /**
   * Whether to enable Python language support
   *
   * 是否启用 Python 语言支持
   */
  python?: boolean
}

/**
 * REPL editor data
 *
 * REPL 编辑器数据
 */
export interface ReplEditorData {
  /**
   * Grammar definitions for languages
   *
   * 语言的语法定义
   */
  grammars: {
    go?: any
    kotlin?: any
    rust?: any
    python?: any
  }
  /**
   * Theme registration
   *
   * 主题注册
   */
  theme: ThemeRegistration | {
    light: ThemeRegistration
    dark: ThemeRegistration
  }
}
