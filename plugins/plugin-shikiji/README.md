# `@vuepress-plume/plugin-shikiji`

使用 [`shiki`](https://shiki.style/) 为 Markdown 代码块启用代码高亮。

> [!WARNING]
> 相比于 官方的 [@vuepress/plugin-shiki](https://ecosystem.vuejs.press/zh/plugins/shiki.html)，
> 本插件做了很多各种各样的调整，你可以认为这是试验性的。

## Install

```sh
npm install @vuepress-plume/plugin-shikiji
# or
pnpm add @vuepress-plume/plugin-shikiji
# or
yarn add @vuepress-plume/plugin-shikiji
```

## Usage

``` js
// .vuepress/config.[jt]s
import { shikiPlugin } from '@vuepress-plume/plugin-shikiji'

export default {
  // ...
  plugins: [
    shikiPlugin()
  ]
  // ...
}
```

## Options

```ts
interface ShikijiOptions {
  /**
   * Custom theme for syntax highlighting.
   *
   * You can also pass an object with `light` and `dark` themes to support dual themes.
   *
   * @example { theme: 'github-dark' }
   * @example { theme: { light: 'github-light', dark: 'github-dark' } }
   *
   * You can use an existing theme.
   * @see https://shiki.style/themes
   * Or add your own theme.
   * @see https://shiki.style/guide/load-theme
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
   * Enable transformerRenderWhitespace
   * @default false
   */
  whitespace?: boolean
}
```
