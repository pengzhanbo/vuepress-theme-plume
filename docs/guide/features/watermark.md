---
title: 文章水印
icon: material-symbols-light:branding-watermark-outline
createTime: 2024/04/10 20:14:57
permalink: /guide/features/watermark/
---

## 概述

文章水印由 [@vuepress/plugin-watermark](https://ecosystem.vuejs.press/zh/plugins/features/watermark.html) 提供支持。

主题支持在文章中添加水印。支持 全屏水印 和 内容水印，同时还支持 图片水印 和 文字水印 。

## 启用水印

主题默认不启用水印功能。你需要在主题配置中开启。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // watermark: true,
    watermark: {
      // enabled: false,  // boolean 类型控制是否全局启用
      enabled: page => true, // function 类型 过滤哪些页面启用水印
      delay: 500, // 添加水印的延时。以毫秒为单位。

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
    }
  })
})
```

### 全局启用

当 `plugins.watermark` 配置为 `true` 时， 主题全局开启水印。

```ts
export default defineUserConfig({
  theme: plumeTheme({
    watermark: true,
  })
})
```

### 部分页面启用

主题提供了两种方式控制部分页面启用水印。

#### watermark.enabled

```ts
export default defineUserConfig({
  theme: plumeTheme({
    watermark: {
      // 返回结果为 true 的将启用水印，否则禁用
      enabled: page => page.path.includes('/article/'),
    }
  })
})
```

#### frontmatter.watermark

在 md 文件中添加 `frontmatter.watermark` 为 `true` ：

```md
---
watermark: true
---
```

还可以个性化配置当前页面的水印：

```md
---
watermark:
  content: My Custom Content
  globalAlpha: 0.2
  rotate: 45
---
```

## 图片水印

主题支持使用 图片 作为水印。

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    watermark: {
      watermarkOptions: {
        contentType: 'image',
        image: '/images/watermark.png',
        width: 200,
        height: 200,
        imageWidth: 100,
        imageHeight: 100,
      }
    }
  })
})
```

也可以在 md 文件中添加配置，为当前页面设置水印：

```md
---
watermark:
  contentType: image
  image: /images/watermark.png
  width: 200
  height: 200
  imageWidth: 100
  imageHeight: 100
---
```

### 示例

[图片水印](/article/i4cuuonn/)

## 文字水印

主题支持使用 文字 作为水印。

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    watermark: {
      watermarkOptions: {
        content: '自定义文字',
        fontColor: '#fff', // 文字颜色
      }
    }
  })
})
```

也可以在 md 文件中添加配置，为当前页面设置水印：

```md
---
watermark:
  content: 自定义文字
  fontColor: #fff
---
```

## Frontmatter

主题支持在 md 文件中添加 `frontmatter.watermark` 为单个页面设置水印。

```md
---
watermark:
  content: My Custom Content
---
```

支持的配置项请参考：[watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/)

同时，还额外支持 `fullPage` 控制是否全屏显示。

```md
---
watermark:
  fullPage: false
---
```

## 示例

- [内容水印](/article/2z59hh8g/)
- [全屏水印](/article/97s6ha1e/)
