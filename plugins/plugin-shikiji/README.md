# `@vuepress-plume/plugin-shikiji`

使用 [`shikiji`](https://shikiji.netlify.app/) 来为 Markdown 代码块启用代码高亮。

## Install
```
yarn add @vuepress-plume/plugin-shikiji
```
## Usage
``` js
// .vuepress/config.js
const shikijiPlugin = require('@vuepress-plume/plugin-shikiji')
module.exports = {
  //...
  plugins: [
    shikijiPlugin()
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

```
