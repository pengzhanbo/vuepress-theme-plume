---
url: /guide/embed/video/artplayer/index.md
---
## 概述

主题提供嵌入自定义来源视频的功能。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdown-power.md) 提供支持。

## 安装

该功能依赖于 `artplayer` 播放器实现，主题默认不安装该依赖，在启用 `artPlayer` 功能时，需要
进行手动安装

::: npm-to

```sh
npm i artplayer
```

:::

artPlayer 播放器默认支持 `'mp4'`, `'mp3'`, `'webm'`, `'ogg'` 格式的视频格式。

同时还支持扩展其他格式的支持。

如果您的视频格式为 `'mpd'`, `'dash'`, 还需要再手动安装 `dashjs` ：

::: npm-to

```sh
npm i dashjs
```

:::

如果您的视频格式为 `'m3u8'`, `'hls'`, 还需要再手动安装 `hls.js` ：

::: npm-to

```sh
npm i hls.js
```

:::

如果您的视频格式为 `'ts'`, `'flv'`, 还需要再手动安装 `mpegts.js` ：

::: npm-to

```sh
npm i mpegts.js
```

:::

## 配置

该功能默认不启用。你需要在主题配置中开启。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      artPlayer: true, // [!code ++]
    },
  }),
})
```

## markdown 语法

```md
@[artPlayer](src)
```

添加配置项：

```md
@[artPlayer muted autoplay loop width="100%" height="400px" ratio="16:9"](src)
```

**配置项说明：**

* `src`：`string`，视频链接地址
* `width`：`string`，视频宽度，默认 `100%`
* `height`：`string`，视频高度，默认自动
* `ratio`：`string`，视频比例，默认 `16:9`
* `type`：`string`，视频格式，默认从视频链接的文件地址中解析获取
* `autoplay`：`boolean`，是否自动播放，默认 `false`
* `muted`：`boolean`，是否静音，默认跟随 `autoplay`（`autoplay` 开启时为 `true`）
* `volume`：`number`，音量大小，范围为 `0 - 1`，默认 `0.75`
* `poster`：`string`，视频封面图链接地址
* `auto-mini`：`boolean`，当播放器滚动到浏览器视口以外时，自动进入 `迷你播放` 模式，默认 `false`

## 全局组件

主题提供了全局组件 `<ArtPlayer />` 以支持更灵活丰富的使用方式。

### Props

:::: field-group
::: field src
@type `string`
@required
视频播放地址
:::
::: field type
@type `string`
@default undefined
视频格式。未设置时从 `src` 的扩展名推断
:::
::: field width
@type `string`
@default `100%`
宽度
:::
::: field height
@type `string`
@default undefined
高度。未指定时按自动高度处理
:::
::: field ratio
@type `string`
@default `16:9`
宽高比
:::
::::

更多 `Props` 请参考 [artPlayer 文档](https://artplayer.org/document/start/option.html) 主题支持所有选项。

## 示例

::: tip 说明
示例中的视频资源来自 [artplayer.org](https://artplayer.org) 。
:::

**输入：**

```md
@[artPlayer](https://artplayer.org/assets/sample/video.mp4)
```

**输出：**

@[artPlayer](https://artplayer.org/assets/sample/video.mp4)

**输入：**

```md
<ArtPlayer
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  fullscreen
/>
```

**输出：**

## 说明

markdown 语法 `@[artPlayer](src)` 在主题内部转换为了 `<ArtPlayer />` 组件，它等价于

```md
<ArtPlayer
  src="src"
  fullscreen
  flip
  playback-rate
  aspect-ratio
  setting
  pip
/>
```
