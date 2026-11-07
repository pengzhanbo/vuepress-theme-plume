---
url: /guide/embed/video/bilibili/index.md
---
## 概述

主题提供了嵌入 Bilibili 视频的功能。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdown-power.md) 提供支持。

## 配置

该功能默认不启用。你需要在主题配置中开启。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      bilibili: true, // [!code ++]
    },
  })
})
```

## 语法

简单的语法：

```md
@[bilibili](bvid)
```

带分P 的视频，在 `bilibili` 后跟随 `p1`、`p2`、`p3` 等选项

```md
@[bilibili p1](aid cid)
```

更多选项：

```md
@[bilibili p1 autoplay time="0" width="100%" height="400px" ratio="16:9"](bvid aid cid)
```

选项说明：

:::: field-group
::: field bvid
@type `string`
视频 BV ID，以 `BV` 开头
:::
::: field aid
@type `string`
视频 AID。与 `cid` 配合使用时可省略 `bvid`
:::
::: field cid
@type `string`
视频 CID
:::
::: field p1
@type `string`
分 P 标记，裸写即可（如 `@[bilibili p1](…)`），支持 `p1` / `p2` / …
:::
::: field autoplay
@type `boolean`
@default `false`
是否自动播放
:::
::: field time
@type `number | string`
@default undefined
视频开始播放时间点，单位为秒，也可以使用 `mm:ss` 或 `hh:mm:ss` 格式
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
