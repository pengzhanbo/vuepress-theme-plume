import type { BuiltinTheme, ThemeRegistration } from 'shiki'

export type ThemeOptions =
  | BuiltinTheme
  | {
    light: BuiltinTheme
    dark: BuiltinTheme
  }

export interface ReplOptions {
  theme?: ThemeOptions

  go?: boolean
  kotlin?: boolean
  rust?: boolean
  python?: boolean
}

export interface ReplEditorData {
  grammars: {
    go?: any
    kotlin?: any
    rust?: any
    python?: any
  }
  theme: ThemeRegistration | {
    light: ThemeRegistration
    dark: ThemeRegistration
  }
}
