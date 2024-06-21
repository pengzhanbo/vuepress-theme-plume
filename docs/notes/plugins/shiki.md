---
title: plugin-shikiji
author: pengzhanbo
createTime: 2024/03/11 17:26:31
permalink: /plugins/plugin-shikiji/
tags:
  - 插件
  - 代码高亮
---

## 指南

使用 [`shiki`](https://shiki.style) 来为 Markdown 代码块启用代码高亮。

## 安装

::: code-tabs
@tab  npm

``` sh
npm install @vuepress-plume/plugin-shikiji
```

@tab:active yarn

``` sh
yarn add @vuepress-plume/plugin-shikiji
```

@tab pnpm

``` sh
pnpm add @vuepress-plume/plugin-shikiji
```

:::

## 使用

```ts
// .vuepress/config.ts
import shikiPlugin from '@vuepress-plume/plugin-shikiji'
module.exports = {
  // ...
  plugins: [
    shikiPlugin({
      // options ...
    })
  ]
  // ...
}
```

## Options

```ts
interface ShikiOptions {
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
   * Setup Shiki instance
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

  /**
   * @experimental
   */
  twoslash?: boolean
}
```
