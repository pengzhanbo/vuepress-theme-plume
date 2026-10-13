---
title: Markdown Math
createTime: 2025/10/09 13:20:41
permalink: /en/config/plugins/markdown-math/
---

## Overview

Adds mathematical formula support for Markdown.

Related plugin: [@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/plugins/markdown/markdown-math.html)

This plugin allows you to render $\TeX$ content in Markdown using MathJax or KaTeX.

## Configuration

- **Type:** `false | MarkdownMathPluginOptions`
- **Default:** `{ type: 'katex' }`

The plugin enables `katex` by default; set it to `false` to disable it.

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      math: {
        type: 'katex',
      }
    },
  }),
})
```

For configuration entry priority information, please refer to [Plugin Configuration Entry](./README.md#configuration-entry-priority).

## Configuration Options

### type

- **Type:** `'katex' | 'mathjax'`
- **Default:** `'katex'`
- **Details:** The math formula renderer. `mathjax` is more feature-complete but larger in size, while `katex` is faster

### copy

- **Type:** `boolean`
- **Default:** `false`
- **Details:** Whether to enable formula copy. **Only available when `type: 'katex'`**

### mhchem

- **Type:** `boolean`
- **Default:** `false`
- **Details:** Whether to enable the [mhchem](https://mhchem.github.io/MathJax-mhchem/) chemical formula extension. **Only available when `type: 'katex'`**

::: tip Other options
Besides the options above, the rendering options of `katex` / `mathjax` are passed through to the corresponding underlying implementation.
See [@mdit/plugin-katex](https://mdit-plugins.github.io/zh/katex.html) and
[@mdit/plugin-mathjax](https://mdit-plugins.github.io/zh/mathjax.html).
:::
