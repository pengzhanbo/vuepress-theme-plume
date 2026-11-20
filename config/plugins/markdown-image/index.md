---
url: /config/plugins/markdown-image/index.md
---
## 概述

为 Markdown 图像添加附加功能。

关联插件：[@vuepress/plugin-markdown-image](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-image.html)

## 配置

* **类型：** `false | MarkdownImagePluginOptions`
* **默认值：** `false`

插件默认不启用任何功能，你需要手动开启它们。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      image: {
        // 启用 figure
        // figure: true,

        // 启用图片懒加载
        // lazyload: true,

        // 启用图片标记
        // mark: true,

        // 启用图片大小
        // size: true,
      }
    },
  }),
})
```

关于配置入口的优先级说明，请参考 [插件配置入口](./README.md#配置入口优先级)。

## 配置项

### figure

* **类型：** `boolean | MarkdownItFigureOptions`
* **默认值：** `false`
* **详情：** 是否将单独的图片渲染为 figure

### lazyload

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用原生的图片懒加载

### mark

* **类型：** `boolean | MarkdownItImgMarkOptions`
* **默认值：** `false`
* **详情：** 是否启用 GFM 图片 ID 标记

### size

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用图片大小支持

### obsidianSize

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 Obsidian 图片大小支持

### legacySize

* **类型：** `boolean`
* **默认值：** `false`
* **详情：**  是否启用旧版图片大小支持

::: tip 与 `markdown.imageSize` 的区别
本页的 `size` / `obsidianSize` 是**语法层**支持，用于书写 `![alt](./a.png =200x100)` 这类图片尺寸。
若希望在构建阶段自动为图片补全 `width` / `height` 属性（解决布局抖动），
请改用 [markdown 配置中的 `imageSize`](../markdown.md#imagesize)。
:::
