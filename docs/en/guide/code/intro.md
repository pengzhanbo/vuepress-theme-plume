---
title: Introduction
icon: ic:outline-code
createTime: 2025/10/08 10:35:45
permalink: /en/guide/code/intro/
---

## Overview

The theme uses [Shiki](https://shiki.style/) to implement syntax highlighting in Markdown code blocks.

## Languages

[Shiki](https://shiki.style/) supports over 190+ languages.
You can view the complete list of supported languages at [languages](https://shiki.style/languages).

You can use the following syntax to enable highlighting for code written in your chosen language:

````md
``` [lang]
<!-- Your code content -->
```
````

Where `[lang]` represents the programming language you are using.

Example:

````md
// [!code word:js]
``` js
const a = 1
console.log(a)
```
````

```js
const a = 1
console.log(a)
```

## Highlighting Themes

[Shiki](https://shiki.style/) supports over 40+ highlighting themes.

You can find the complete list of supported themes at [Themes](https://shiki.style/themes) and
customize the highlighting theme according to your preference.

Theme Plume's default configuration for code block themes:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' }, // [!code highlight]
    }
  })
})
```

The default configuration supports using the `vitesse-light`/`vitesse-dark` themes for light/dark modes respectively.

## Additional Features

Thanks to the powerful capabilities of [Shiki](https://shiki.style/), Theme Plume provides additional
[feature support](./features.md) for code blocks, enhancing their expressive power.

Additionally, to facilitate better code demonstrations, Theme Plume provides syntax support for embedding
[CodePen](../repl/codepen.md), [Js Fiddle](../repl/js-fiddle.md), [Code Sandbox](../repl/code-sandbox.md),
and [Replit](../repl/replit.md), allowing you to easily embed code demonstrations.

## Examples

<!-- @include: ../../../snippet/code-block.snippet.md -->
