---
title: markdown增强
author: pengzhanbo
createTime: 2024/03/06 20:25:36
permalink: /config/plugins/markdown-enhance/
---

## 概述

提供 Markdown 增强功能。

关联插件：[vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/zh/)

默认配置：

```ts
import { plumeTheme } from 'vuepress-theme-plume'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownEnhance: {
        hint: true,
        codetabs: true,
        tabs: true,
        align: true,
        mark: true,
        tasklist: true,
        attrs: true,
        sup: true,
        sub: true,
        alert: true,
        footnote: true,
        katex: true,
      }
    }
  }),
})
```

## 配置

详见 [vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/zh/config.html)


:::tip 说明
主题还未完全对 该插件提供的 所有 增强功能 进行 样式上的适配。
如果你在使用过程中遇到样式上的问题，可以在 [issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues) 里提出。
:::
