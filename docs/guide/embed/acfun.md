---
title: AcFun 视频
icon: lets-icons:video-fill
createTime: 2025/06/28 10:57:45
permalink: /guide/embed/video/acfun/
---

## 概述

主题提供了嵌入 AcFun 视频的功能。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdown-power.md) 提供支持。

## 配置

该功能默认不启用。你需要在主题配置中开启。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      acfun: true, // [!code ++]
    },
  })
})
```

## 语法

简单的语法：

```md
@[acfun](id)
```

更多选项：

```md
@[acfun width="100%" height="400px" ratio="16:9"](id)
```

选项说明：

:::: field-group
::: field id
@type `string`
@required
视频 ID
:::
::: field width
@type `string`
@default `100%`
视频宽度
:::
::: field height
@type `string`
@default undefined
视频高度。未指定时按自动高度处理
:::
::: field ratio
@type `string`
@default `16:10`
视频比例。
:::
::::

## 示例

### 宽频视频

输入：

```md
@[acfun](ac47431669)
```

输出：

@[acfun](ac47431669)
