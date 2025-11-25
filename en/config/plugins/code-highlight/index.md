---
url: /en/config/plugins/code-highlight/index.md
---
## Overview

The theme's built-in code highlighting plugin provides syntax highlighting for code blocks.

Related plugin: [@vuepress/plugin-shiki](https://ecosystem.vuejs.press/zh/plugins/markdown/shiki.html)

The theme uses [Shiki](https://github.com/shikijs/shiki) to implement syntax highlighting with colored
text in Markdown code blocks. Shiki supports multiple programming languages.

You can find the [list of supported languages](https://shiki.style/languages) in Shiki's repository.

## Features

* [Code Block Titles](../../guide/code/features.md#code-block-titles)
* [Line Highlighting](../../guide/code/features.md#line-highlighting-in-code-blocks)
* [Code Focus](../../guide/code/features.md#focus-in-code-blocks)
* [Code Diff](../../guide/code/features.md#color-differences-in-code-blocks)
* [Error and Warning Highlighting](../../guide/code/features.md#highlighting-errors-and-warnings)
* [Word Highlighting](../../guide/code/features.md#word-highlighting-in-code-blocks)
* [Code Block Folding](../../guide/code/features.md#collapsing-code-blocks)
* [twoslash](../../guide/code/twoslash.md#twoslash): Provides inline type hints within code blocks.

## Configuration

Default configuration:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      notationDiff: true,
      notationErrorLevel: true,
      notationFocus: true,
      notationHighlight: true,
      notationWordHighlight: true,
      highlightLines: true,
      collapsedLines: false,
      lineNumbers: true,
    },
    // Can also be configured via plugins.shiki, but not recommended
    plugins: {
      shiki: {}
    }
  }),
})
```

### themes

* Type: `{ light: string, dark: string }`
* Default: `{ light: 'vitesse-light', dark: 'vitesse-dark' }`

Code highlighting themes supporting light/dark dual themes.

You can choose your preferred themes from the [list of supported themes](https://shiki.style/themes).

### langs

* Type: `string[]`
* Default: `[]`

Programming languages to be highlighted, such as `javascript`, `typescript`, `python`, `java`, `c++`, `c#`, etc.
By default, languages are automatically detected based on code block language identifiers.

You can find the [list of supported languages](https://shiki.style/languages) in Shiki's repository.

### defaultLang

* Type: `string`
* Default: `text`

Fallback language to use when the specified language is not available.

### lineNumbers

* Type: `boolean | number`
* Default: `true`

Whether to display line numbers.

`true`: Display line numbers\
`false`: Hide line numbers\
`number`: Minimum number of lines required to display line numbers.

### twoslash

* Type: `boolean | ShikiTwoslashOptions`
* Default: `false`

Whether to enable type hint support for `typescript` and `vue` languages.

### whitespace

* Type: `boolean | 'all' | 'boundary' | 'trailing'`
* Default: `false`

Render whitespace characters (tabs and spaces) as separate spans (with `tab` or `space` class names).

Effect:

### collapsedLines

* Type: `boolean | number`
* Default: `false`

Collapse code blocks to the specified number of lines.

### transformers

* Type: `ShikiTransformer[]`
* Default: `[]`

Code transformers. Refer to [shiki transformers](https://shiki.style/guide/transformers) for more information.
