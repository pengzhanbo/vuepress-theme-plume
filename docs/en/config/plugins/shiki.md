---
title: Code Highlighting
createTime: 2025/10/09 10:21:47
permalink: /en/config/plugins/code-highlight/
---

## Overview

The theme's built-in code highlighting plugin provides syntax highlighting for code blocks.

Related plugin: [@vuepress/plugin-shiki](https://ecosystem.vuejs.press/plugins/markdown/shiki.html)

The theme uses [Shiki](https://github.com/shikijs/shiki) to implement syntax highlighting with colored
text in Markdown code blocks. Shiki supports multiple programming languages.

You can find the [list of supported languages](https://shiki.style/languages) in Shiki's repository.

## Features

- [Code Block Titles](../../guide/code/features.md#code-block-title)
- [Line Highlighting](../../guide/code/features.md#line-highlighting-in-code-blocks)
- [Code Focus](../../guide/code/features.md#focus-in-code-blocks)
- [Code Diff](../../guide/code/features.md#diff-in-code-blocks)
- [Error and Warning Highlighting](../../guide/code/features.md#highlight-errors-and-warnings)
- [Word Highlighting](../../guide/code/features.md#word-highlighting-in-code-blocks)
- [Code Block Folding](../../guide/code/features.md#collapsed-code-blocks)
- [twoslash](../../guide/code/twoslash.md): Provides inline type hints within code blocks.

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
  }),
})
```

For configuration entry priority information, please refer to [Plugin Configuration Entry](./README.md#configuration-entry-priority).

### theme

- Type: `string | ThemeRegistration`
- Default: The theme injects `themes: { light: 'vitesse-light', dark: 'vitesse-dark' }` by default

Single-theme configuration, mutually exclusive with `themes`.
Once `theme` is provided, the theme will **no longer inject** the default light/dark dual themes.

### themes

- Type: `{ light: string, dark: string }`
- Default: `{ light: 'vitesse-light', dark: 'vitesse-dark' }`

Code highlighting themes supporting light/dark dual themes.

You can choose your preferred themes from the [list of supported themes](https://shiki.style/themes).

### langs

- Type: `string[]`
- Default: `[]`

Programming languages to be highlighted, such as `javascript`, `typescript`, `python`, `java`, `c++`, `c#`, etc.
By default, languages are automatically detected based on code block language identifiers.

You can find the [list of supported languages](https://shiki.style/languages) in Shiki's repository.

### langAlias

- Type: `Record<string, string>`
- Default: `{}`

Custom language aliases, for example `{ 'my-lang': 'javascript' }`.

See [Custom Language Aliases](https://shiki.style/guide/load-lang#custom-language-aliases) for more information.

### defaultLang

- Type: `string`
- Default: `plain`

Fallback language to use when the specified language is not available. A warning is emitted when a language is not available (kept silent when `logLevel` is `silent`).

### lineNumbers

- Type: `boolean | number`
- Default: `true`

Whether to display code line numbers.

- `true`: Always display line numbers
- `false`: Do not display line numbers
- `number`: Only display line numbers when the code block has at least that many lines

A single code block can override this configuration with `:line-numbers` / `:no-line-numbers`.

### twoslash

- Type: `boolean | ShikiTwoslashOptions`
- Default: `false`

Whether to enable type hint support for `typescript` and `vue` languages.

### whitespace

- Type: `boolean | 'all' | 'boundary' | 'leading' | 'trailing'`
- Default: `false`

Render whitespace characters (tabs and spaces) as separate spans (with `tab` or `space` class names).

- `true`: Enables whitespace rendering, but renders no whitespace characters by default
- `false`: Disables it entirely
- `'all'`: Renders all whitespace characters
- `'boundary'`: Renders the leading and trailing whitespace characters of each line
- `'leading'`: Renders the leading whitespace characters of each line
- `'trailing'`: Renders the trailing whitespace characters of each line

A single code block can override this with `:whitespace`, `:no-whitespace`, or `:whitespace=all|boundary|leading|trailing`.

Effect:

<!-- @include: ../../../snippet/whitespace.snippet.md{17-23} -->

### collapsedLines

- Type: `boolean | number | 'disable'`
- Default: `false` (explicitly set by the theme; `'disable'` means the feature is not registered at all)

Collapse code blocks to the specified number of lines. `number` is the collapse threshold, and `false` means no collapsing.

A single code block can override this with `:collapsed-lines`, `:collapsed-lines=10`, or `:no-collapsed-lines`.

### removeLastLine

- Type: `boolean`
- Default: `false`

Whether to remove the last line of a code block when calculating line numbers and collapsed lines (used to ignore a trailing empty line).

### renderIndentGuides

- Type: `boolean | Partial<TransformerRenderIndentGuidesOptions>`
- Default: `false`

Whether to render indent guides in code blocks. When enabled, indentation in the code will be displayed as visual guides, making it easier to read deeply nested code.

### colorizedBrackets

- Type: `boolean | Partial<TransformerColorizedBracketsOptions>`
- Default: `false`

Whether to add color matching for brackets in code blocks. When enabled, matching pairs of brackets will be displayed in different colors, making it easier to identify bracket matching relationships in the code.

### transformers

- Type: `ShikiTransformer[]`
- Default: `[]`

Code transformers. Refer to [shiki transformers](https://shiki.style/guide/transformers) for more information.

### shikiSetup

- Type: `(shiki: Highlighter) => Promise<void> | void`
- Default: `undefined`

A function used to customize the Shiki highlighter instance. It is called after the highlighter is created and before languages and themes are loaded.

### removeComments

- Type: `boolean`
- Default: `false`

Whether to remove comments from code blocks.

### logLevel

- Type: `'debug' | 'silent' | 'warn'`
- Default: `'warn'` (`'debug'` when the `--debug` flag is enabled)

Log level of the highlighter's language detector. When a code block uses an unavailable language,
`warn` outputs a warning, `debug` outputs additional information, and `silent` stays silent.

### preWrapper

- Type: `boolean`
- Default: `true`

Whether to wrap a `<div>` around `<pre>`.
Line numbers, code block titles, and the collapsing feature all depend on this wrapper, so do not disable it unless you fully understand what it does.

### codeBlockTitle

- Type: `CodeBlockTitleRender | boolean`
- Default: `true` (**handled by the theme**)

::: warning Custom implementations passed to this field have no effect
The theme always uses its built-in `codeBlockTitle` renderer to output code block titles with file icons,
and `codeHighlighter.codeBlockTitle` is ignored entirely.
:::
