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

插件默认启用 `katex`。

::: code-tabs
@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownMath: {
        type: 'katex',
      }
    }
  }),
})
```

:::
