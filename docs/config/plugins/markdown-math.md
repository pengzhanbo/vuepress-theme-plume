---
title: Markdown Math
createTime: 2024/09/24 13:20:41
permalink: /config/plugins/markdown-math/
---

## 概述

为 Markdown 添加数学支持。

关联插件：[@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-math.html)

此插件允许你使用 mathjax 或 katex 在 Markdown 中渲染 $\TeX$ 内容。

## 配置

- **类型：** `false | MarkdownMathPluginOptions`
- **默认值：** `{ type: 'katex' }`

插件默认启用 `katex`，设置为 `false` 可关闭。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      math: {
        type: 'katex',
      },
    },
  }),
})
```

关于配置入口的优先级说明，请参考 [插件配置入口](./README.md#配置入口优先级)。

## 配置项

### type

- **类型：** `'katex' | 'mathjax'`
- **默认值：** `'katex'`
- **详情：** 数学公式渲染器。`mathjax` 的能力更完整但体积更大，`katex` 更快

### copy

- **类型：** `boolean`
- **默认值：** `false`
- **详情：** 是否启用公式复制。**仅 `type: 'katex'` 时可用**

### mhchem

- **类型：** `boolean`
- **默认值：** `false`
- **详情：** 是否启用 [mhchem](https://mhchem.github.io/MathJax-mhchem/) 化学公式扩展。**仅 `type: 'katex'` 时可用**

::: tip 其它选项
除上述选项外，`katex` / `mathjax` 的渲染选项会透传给对应的底层实现，
参考 [@mdit/plugin-katex](https://mdit-plugins.github.io/zh/katex.html) 与
[@mdit/plugin-mathjax](https://mdit-plugins.github.io/zh/mathjax.html)。
:::
