---
title: 水印
createTime: 2024/06/17 15:37:18
permalink: /config/plugins/watermark/
---

## 概述

主题内置的水印插件，为全站，或者单个页面添加水印。

关联插件：[@vuepress/plugin-watermark](https://ecosystem.vuejs.press/zh/plugins/features/watermark.html)

功能说明请参考 [水印功能](../../guide/features/watermark.md)

## 使用

```ts title=".vuepress/config.ts" twoslash
// @errors: 7006
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // watermark: true,
    watermark: {
      // enabled: false,  // boolean 类型控制是否全局启用
      enabled: page => true, // function 类型 过滤哪些页面启用水印

      /**
       * 是否全屏水印，默认为 `true`，
       * 设置为 `false` 时，水印仅在 内容区域中显示。
       */
      fullPage: true,

      /** @see https://zhensherlock.github.io/watermark-js-plus/zh/config/ */
      watermarkOptions: {
        content: 'your watermark',
        // ...
      }
    },
  })
})
```

关于配置入口的优先级说明，请参考 [插件配置入口](./README.md#配置入口优先级)。

## 配置项

### enabled

- 类型： `boolean | ((page: Page) => boolean)`

- 默认值： `true`

- 详情：

  指定哪些页面需要添加水印。

  拥有 `true` 值的页面将会被添加水印。

  ::: tip 默认值 `true` 与「未配置时不显示水印」并不冲突
  只有配置了 `watermark`（顶层 `watermark` 或 `plugins.watermark`）时主题才会注册水印插件，
  注册时会显式传入 `enabled: true`。因此**未配置 `watermark` 时全站都不会有水印**，
  这里的 `true` 描述的是「已配置水印时的默认行为」，它并不是启用开关。
  :::

### fullPage

- 类型： `boolean`

- 默认值： `true`

- 详情：

  是否为全屏水印。这是主题扩展字段，`@vuepress/plugin-watermark` 本身没有该选项。

  - `true`：水印铺满整个页面
  - `false`：水印仅在内容区域中显示

  单个页面也可以通过在 frontmatter 中设置 `watermark.fullPage: false` 覆盖。

### watermarkOptions

- 类型： `WatermarkOptions`

- 默认值： `undefined`

- 详情： 配置项请参考 [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/)。

#### watermarkOptions.parent

- 类型： `string`

- 默认值： `body`

- 详情：添加水印的父元素选择器。

  默认插入到 body 中，可以指定插入到页面的某个元素中。

## Frontmatter

### watermark

- 类型: `boolean | WatermarkOptions`

- 详情：

  当类型为 `boolean` 时，表示是否启用水印。

  当类型为 `WatermarkOptions` 时，表示当前页面水印配置。

  可以参考 [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/) 。

```md title="frontmatter"
---
watermark:
  width: 200
  height: 200
  content: Your content
  opacity: 0.5
---
```
