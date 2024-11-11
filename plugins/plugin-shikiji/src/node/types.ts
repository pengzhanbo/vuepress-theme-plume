import type { TransformerTwoslashOptions } from '@shikijs/twoslash/core'
import type {
  BuiltinTheme,
  BundledLanguage,
  Highlighter,
  LanguageInput,
  ShikiTransformer,
  SpecialLanguage,
  StringLiteralUnion,
  ThemeRegistration,
} from 'shiki'
import type { VueSpecificOptions } from 'twoslash-vue'
import type { LocaleConfig } from 'vuepress/shared'

export type ShikiLang =
  | LanguageInput
  | StringLiteralUnion<BundledLanguage>
  | SpecialLanguage

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
  languages?: ShikiLang[]
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
  shikiSetup?: (shiki: Highlighter) => void | Promise<void>
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
  twoslash?: boolean | TransformerTwoslashOptions['twoslashOptions'] & VueSpecificOptions

  /**
   * Enable transformerRenderWhitespace
   * @default false
   */
  whitespace?: boolean | 'all' | 'boundary' | 'trailing'
}

export interface LineNumberOptions {
  /**
   * Show line numbers in code blocks
   * @default true
   */
  lineNumbers?: boolean | number
}

export interface PreWrapperOptions {
  /**
   * Wrap the `<pre>` tag with an extra `<div>` or not. Do not disable it unless you
   * understand what's it for
   *
   * - Required for `lineNumbers`
   * - Required for title display of default theme
   */
  preWrapper?: boolean

  /**
   * Hide extra rows when exceeding a specific number of lines.
   *
   * `true` is equivalent to `15` .
   *
   * @default false
   */
  collapsedLines?: number | boolean
}

/**
 * Options for copy code button
 *
 * `<button title="{title}" class="{className}"></button>`
 */
export interface CopyCodeOptions {
  /**
   * Class name of the button
   *
   * @default 'copy'
   */
  className?: string

  /**
   * Duration of the copied text
   *
   * @default 2000
   */
  duration?: number

  /**
   * Locale config for copy code button
   */
  locales?: LocaleConfig<CopyCodeLocaleOptions>
}

export interface CopyCodeLocaleOptions {
  /**
   * Title of the button
   *
   * @default 'Copy code'
   */
  title?: string

  /**
   * Copied text
   *
   * @default 'Copied!'
   */
  copied?: string
}
