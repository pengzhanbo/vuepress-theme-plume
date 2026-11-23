---
url: /guide/embed/video/youtube/index.md
---
## 概述

主题提供了嵌入 Youtube 视频的功能。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdown-power.md) 提供支持。

## 配置

该功能默认不启用。你需要在主题配置中开启。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      youtube: true, // [!code ++]
    },
  })
})
```

## 语法

简单的语法：

```md
@[youtube](id)
```

更多选项：

```md
@[youtube autoplay loop start="0" end="0" width="100%" height="400px" ratio="16:9"](id)
```

选项说明：

:::: field-group
::: field id
@type `string`
@required
视频 ID
:::
::: field autoplay
@type `boolean`
@default `false`
是否自动播放
:::
::: field loop
@type `boolean`
@default `false`
是否循环播放
:::
::: field start
@type `number | string`
@default undefined
视频开始播放时间点，单位为秒，也可以使用 `mm:ss` 或 `hh:mm:ss` 格式
:::
::: field end
@type `number | string`
@default undefined
视频结束播放时间点，单位为秒，也可以使用 `mm:ss` 或 `hh:mm:ss` 格式
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
@default `16:9`
视频比例
:::
::::

## 示例

### 宽频视频

输入：

```md
@[youtube](0JJPfz5dg20)
```

输出：

@[youtube](0JJPfz5dg20)
