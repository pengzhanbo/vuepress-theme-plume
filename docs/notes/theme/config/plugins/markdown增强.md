---
title: Markdown Enhance
author: pengzhanbo
createTime: 2024/03/06 20:25:36
permalink: /config/plugins/markdown-enhance/
---

## 概述

提供 Markdown 增强功能。

关联插件：[vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/zh/)

默认配置：

::: code-tabs
@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownEnhance: {
        // 以下可选项在 主题中默认不启用，
        // 请在主题中自行配置
        // chartjs: true, // 图表支持
        // echarts: true, // ECharts 图表支持
        // flowchart: true, // 流程图支持
        // markmap: true, // Markmap 图表支持
        // stylize: true, // 对行内语法进行样式化以创建代码片段
        // playground: true, // 交互演示
        // kotlinPlayground: true, // Kotlin 交互演示
        // vuePlayground: true, // Vue 交互演示
        // sandpack: true, // sandpack 交互演示
        // demo: true, // 代码案例
      }
    }
  }),
})
```

:::

## 配置

详见 [vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/zh/config.html)

:::tip 说明
主题还未完全对 该插件提供的 所有 增强功能 进行 样式上的适配。
如果你在使用过程中遇到样式上的问题，可以在 [issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues) 里提出。
:::

::: warning
该插件从 `2.0.0-rc.53` 开始，移除了部分功能。主题从 `1.0.0-rc.103` 版本开始，适配至最新版。
由此带来的影响是，`plugins.mdEnhance` 中 `imgSize`/`imgLazyload`/`imgMark`/`figure`/`obsidianImgSize`/`katex`/`mathjax`/`tabs`/`code-tabs`/`hint`/`alerts`弃用。

- `imgSize`/`imgLazyload`/`imgMark`/`figure`/`obsidianImgSize` 所实现的功能，您可以使用 `plugins.markdownImage` 重新进行配置。
- `katex` / `mathjax` 所实现的功能，您可以使用 `plugins.markdownMath` 进行配置。
- `tabs` / `code-tabs` / `hint` / `alerts` 已变更为 主题的内置功能，您无需额外的配置。
:::

::: warning
该插件在 `2.0.0-rc.60` 版本中，移除了 `include` 选项。主题从 `1.0.0-rc.120` 版本开始，适配至最新版。
由此带来的影响是，使用 `@vuepress/plugin-markdown-include` 插件实现相同的功能，请使用 `plugins.markdownInclude`
进行配置。
:::
