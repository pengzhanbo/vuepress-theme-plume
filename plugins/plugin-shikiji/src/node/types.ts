import type {
  BuiltinTheme,
  Highlighter,
  LanguageInput,
  ShikijiTransformer,
  ThemeRegistration,
} from 'shikiji'

export type ThemeOptions =
  | ThemeRegistration
  | BuiltinTheme
  | {
    light: ThemeRegistration | BuiltinTheme
    dark: ThemeRegistration | BuiltinTheme
  }

export interface HighlighterOptions {
  /**
   * Custom theme for syntax highlighting.
   *
   * You can also pass an object with `light` and `dark` themes to support dual themes.
   *
   * @example { theme: 'github-dark' }
   * @example { theme: { light: 'github-light', dark: 'github-dark' } }
   *
   * You can use an existing theme.
   * @see https://github.com/antfu/shikiji/blob/main/docs/themes.md#all-themes
   * Or add your own theme.
   * @see https://github.com/antfu/shikiji/blob/main/docs/themes.md#load-custom-themes
   */
  theme?: ThemeOptions
  /**
   * Languages for syntax highlighting.
   * @see https://github.com/antfu/shikiji/blob/main/docs/languages.md#all-themes
   */
  languages?: LanguageInput[]
  /**
   * Custom language aliases.
   *
   * @example { 'my-lang': 'js' }
   * @see https://github.com/antfu/shikiji/tree/main#custom-language-aliases
   */
  languageAlias?: Record<string, string>
  /**
   * Setup Shikiji instance
   */
  shikijiSetup?: (shikiji: Highlighter) => void | Promise<void>
  /**
   * Fallback language when the specified language is not available.
   */
  defaultHighlightLang?: string
  /**
   * Transformers applied to code blocks
   * @see https://github.com/antfu/shikiji#hast-transformers
   */
  codeTransformers?: ShikijiTransformer[]
}
