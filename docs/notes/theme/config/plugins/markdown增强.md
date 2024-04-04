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

```ts
import { plumeTheme } from 'vuepress-theme-plume'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownEnhance: {
        hint: true, // 提示容器
        codetabs: true, // 代码组
        tabs: true, // 选项卡
        align: true, // 对齐容器
        mark: true, // 标记语法
        tasklist: true, // 任务列表语法
        attrs: true, // 属性语法
        sup: true, // 上标语法
        sub: true, // 下标语法
        alert: true, // GFM 通知语法
        footnote: true, // 注脚语法
        katex: true, // 数学公式

        // 以下可选项在 主题中默认不启用，
        // 请在主题中自行配置
        // include: true, // Markdown 导入支持
        // figure: true, // 启用图片 Figure 支持
        // imgLazyload: true, // 使用原生方式懒加载页面图片
        // imgMark: true, // 浅色/深色 图片标记
        // imgSize: true, // 图片尺寸支持
        // obsidianImgSize: true, // obsidian 图片尺寸支持
        // mathjax: true, //  Math Jax 数学公式 语法支持
        // chart: true, // 图表支持
        // echarts: true, // ECharts 图表支持
        // flowchart: true, // 流程图支持
        // markmap: true, // Markmap 图表支持
        // stylize: true, // 对行内语法进行样式化以创建代码片段
        // playground: true, // 交互演示
        // kotlinPlayground: true, // Kotlin 交互演示
        // vuePlayground: true, // Vue 交互演示
        // sandpack: true, // sandpack 交互演示
        // demo: true, // 代码案例
        // revealJs: true, // 幻灯片支持
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
