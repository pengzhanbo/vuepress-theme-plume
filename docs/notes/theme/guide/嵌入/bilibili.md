---
title: Bilibili 视频
icon: ri:bilibili-fill
createTime: 2024/03/28 12:26:47
permalink: /guide/embed/video/bilibili/
---

## 概述

主题提供了 嵌入 Bilibili 视频 的功能。

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
        bilibili: true,
      },
    }
  })
})
```

:::

## 语法

简单的语法：

```md
@[bilibili](bvid)
```

带 分P 的视频，在 `bilibili` 后跟随 `p1`、`p2`、`p3` 等选项

```md
@[bilibili p1](aid cid)
```

更多选项：

```md
@[bilibili p1 autoplay time="0" width="100%" height="400px" ratio="16:9"](bvid aid cid)
```

**选项说明：**

- bvid: 视频 BV ID
- aid: 视频 AID
- cid: 视频 CID
- autoplay: 是否自动播放
- time: 视频开始播放时间点，单位为秒， 也可以使用 `mm:ss` 或 `hh:mm:ss` 格式
- width: 视频宽度
- height: 视频高度
- ratio: 视频比例，默认 `16:9`

对于分P的视频，可以省略传入 `bvid`，但需要传入 `aid` 和 `cid`

## 示例

### 宽频视频

输入：

```md
@[bilibili](BV1EZ42187Hg)
```

输出：

@[bilibili](BV1EZ42187Hg)

### 竖屏视频

输入：

```md
@[bilibili width="320px" ratio="9:16"](BV1zr42187eg)
```

输出：

@[bilibili width="320px" ratio="9:16"](BV1zr42187eg)
