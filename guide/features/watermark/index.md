---
url: /guide/features/watermark/index.md
---
## 概述

文章水印由 [@vuepress/plugin-watermark](https://ecosystem.vuejs.press/zh/plugins/features/watermark.html) 提供支持。

主题支持在文章中添加水印。支持全屏水印和 内容水印，同时还支持图片水印和 文字水印 。

如需查看配置选项，请参阅 [配置 > 水印](/config/plugins/watermark/)。

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

当顶层 `watermark` 配置为 `true` 时，主题全局开启水印。

等价写法：将其配置在底层入口 `plugins.watermark: true`。两者是不同入口，不会互相覆盖，
顶层入口优先级更高。

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

```md title="frontmatter"
---
watermark: true
---
```

还可以个性化配置当前页面的水印：

```md title="frontmatter"
---
watermark:
  content: My Custom Content
  globalAlpha: 0.2
  rotate: 45
---
```

## 图片水印

主题支持使用图片作为水印。

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

```md title="frontmatter"
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

主题支持使用文字作为水印。

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

```md title="frontmatter"
---
watermark:
  content: 自定义文字
  fontColor: #fff
---
```

## Frontmatter

主题支持在 md 文件中添加 `frontmatter.watermark` 为单个页面设置水印。

```md title="frontmatter"
---
watermark:
  content: My Custom Content
---
```

支持的配置项请参考：[watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/)

同时，还额外支持 `fullPage` 控制是否全屏显示。

```md title="frontmatter"
---
watermark:
  fullPage: false
---
```

## 示例

* [内容水印](/article/2z59hh8g/)
* [全屏水印](/article/97s6ha1e/)

## 限制

::: warning 水印是纯客户端实现
水印由 [@vuepress/plugin-watermark](https://ecosystem.vuejs.press/zh/plugins/features/watermark.html) 在浏览器端渲染，**不写入构建产物**。这意味着：

* 内容仍完整存在于页面 HTML / 源文件中，水印只是视觉遮挡
* 关闭 JavaScript 或直接查看源码即可看到原始内容
* **不可用于任何需要真正保密的场景**

若需要内容保护，请使用[加密功能](./encryption.md)。
:::

::: tip 全屏水印与内容水印的取舍

* **全屏水印**：覆盖整个视口，适合防止截图泄露
* **内容水印**：仅覆盖文章内容区域，不影响导航与侧边栏

两者都可叠加文字或图片水印。
:::
