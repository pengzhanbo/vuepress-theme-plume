---
title: 水印
createTime: 2024/06/17 15:37:18
permalink: /config/watermark/
---

## 概述

主题内置的 水印插件，为 全站，或者 单个页面 添加水印。

关联插件：[@vuepress/plugin-watermark](https://ecosystem.vuejs.press/zh/plugins/features/watermark.html)

## 使用

```ts title=".vuepress/config.ts" twoslash
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
    // 也可以通过 plugins.watermark 配置，但不推荐
    plugins: {
      watermark: {}
    }
  })
})
```

## 配置项

### enabled

- 类型： `boolean | ((page: Page) => boolean)`

- 默认值： `false`

- 详情：

  指定哪些页面需要添加水印。

  拥有 `true` 值的页面将会被添加水印。

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

```md
---
watermark:
  width: 200
  height: 200
  content: Your content
  opacity: 0.5
---
```
