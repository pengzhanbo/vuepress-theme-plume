---
title: Youtube 视频
icon: mdi:youtube
createTime: 2024/03/28 14:30:33
permalink: /guide/embed/video/youtube/
---

## 概述

主题提供了 嵌入 Youtube 视频 的功能。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdownPower.md) 提供支持。

## 配置

该功能默认不启用。你需要在主题配置中开启。

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        youtube: true,
      },
    }
  })
})
```

:::

## 语法

简单的语法：

```md
@[youtube](id)
```

更多选项：

```md
@[youtube autoplay loop start="0" end="0" width="100%" height="400px" ratio="16:9"](id)
```

**选项说明：**

- id: 视频 ID
- autoplay: 是否自动播放
- loop: 是否循环播放
- start: 视频开始播放时间点，单位为秒， 也可以使用 `mm:ss` 或 `hh:mm:ss` 格式
- end: 视频结束播放时间点，单位为秒， 也可以使用 `mm:ss` 或 `hh:mm:ss` 格式
- width: 视频宽度
- height: 视频高度
- ratio: 视频比例，默认 `16:9`

## 示例

### 宽频视频

输入：

```md
@[youtube](0JJPfz5dg20)
```

输出：

@[youtube](0JJPfz5dg20)
