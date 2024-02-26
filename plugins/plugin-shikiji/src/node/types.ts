import type {
  BuiltinTheme,
  Highlighter,
  LanguageInput,
  ShikiTransformer,
  ThemeRegistration,
} from 'shiki'

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
   * You can use an existing theme.
   *
   * @see https://shiki.style/themes
   *
   * Or add your own theme.
   *
   * @see https://shiki.style/guide/load-theme
   *
   * @example { theme: 'github-dark' }
   * @example { theme: { light: 'github-light', dark: 'github-dark' } }
   *
   */
  theme?: ThemeOptions
  /**
   * Languages for syntax highlighting.
   * @see https://shiki.style/languages
   */
  languages?: LanguageInput[]
  /**
   * Custom language aliases.
   *
   * @example { 'my-lang': 'js' }
   * @see https://shiki.style/guide/load-lang#custom-language-aliases
   */
  languageAlias?: Record<string, string>
  /**
   * Setup Shikiji instance
   */
  shikiSetup?: (shikiji: Highlighter) => void | Promise<void>
  /**
   * Fallback language when the specified language is not available.
   */
  defaultHighlightLang?: string
  /**
   * Transformers applied to code blocks
   * @see https://shiki.style/guide/transformers
   */
  codeTransformers?: ShikiTransformer[]

  /**
   * @experiment
   * Enable transformerTwoslash
   * @default false
   */
  twoslash?: boolean

  /**
   * Enable transformerRenderWhitespace
   * @default false
   */
  whitespace?: boolean
}
