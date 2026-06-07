---
title: 介绍
icon: ic:outline-code
createTime: 2024/04/04 10:35:45
permalink: /guide/code/intro/
---

## 概述

主题 使用 [Shiki](https://shiki.style/) 在 Markdown 代码块实现语法高亮。

## 语言

[Shiki](https://shiki.style/) 支持 超过 190+ 种语言，
你可以在 [languages](https://shiki.style/languages) 查看所有支持的语言列表。

你可以通过以下语法为你使用的 语言所编写的代码 实现高亮效果：

````md
``` [lang]
<!-- 代码内容 -->
```
````

其中，`[lang]` 为你使用的语言。

示例：

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

## 高亮主题

[Shiki](https://shiki.style/) 支持 超过 40+ 种高亮主题。

你可以在 [Themes](https://shiki.style/themes) 找到所有支持的主题列表，根据个人的喜欢自定义
高亮主题。

Theme Plume 默认为 代码块使用的主题配置：

```ts
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' }, // [!code highlight]
    }
  })
})
```

默认配置支持在 亮色/暗色 模式分别使用 `vitesse-light`/`vitesse-dark` 主题。

## 更多支持

得益于 [Shiki](https://shiki.style/) 的强大能力，Theme Plume 还为 代码块
提供了 更多的 [特性支持](./features.md)，它们让 代码块具备更强的表达能力。

同时，为了方便 更好的 完成 代码演示，Theme Plume 还提供了嵌入 [CodePen](../repl/codepen.md)，
[Js Fiddle](../repl/jsFiddle.md)，[Code Sandbox](../repl/codeSandbox.md)，
[Replit](../repl/replit.md) 的语法支持，你可以很方便的嵌入代码演示。

## 示例

<!-- @include: ../../snippet/code-block.snippet.md -->
