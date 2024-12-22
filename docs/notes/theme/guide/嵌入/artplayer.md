---
title: ArtPlayer 视频
icon: icon-park-outline:video
createTime: 2024/12/21 16:13:54
permalink: /guide/embed/video/artplayer/
---

## 概述

主题提供嵌入 自定义来源视频 的功能。

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
        artPlayer: true,
      },
    }
  })
})
```

:::

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

## markdown 语法

```md
@[artPlayer](src)
```

添加配置项：

```md
@[artPlayer muted autoplay loop width="100%" height="400px" ratio="16:9"](src)
```

- `src`: 视频链接地址

**配置项说明：**

- `width`： 视频宽度
- `height`： 视频高度
- `ratio`： 视频比例，默认 `16:9`
- `type`: 视频格式，默认从视频链接的文件地址中解析获取
- `autoplay`： 是否自动播放
- `muted`: 是否静音，autoplay 时，默认为 `true`
- `volume`： 音量大小，范围为 `0 - 1`
- `poster`：视频封面图链接地址
- `auto-mini`: 当播放器滚动到浏览器视口以外时，自动进入 `迷你播放` 模式

## 全局组件

主题提供了全局组件 `<ArtPlayer />` 以支持更灵活丰富的使用方式。

### Props

|字段 |类型 |描述 |
| -- | -- | -- |
| src | `string` | 必填，视频播放地址 |
| type | `string` | 选填，视频格式，默认从 `src` 中截取 |
| width | `string` | 选填， 宽度， 默认 `100%` |
| height | `string` | 选填，高度 |
| ratio | `string` | 选填，宽高比，默认 `16:9` |

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

<ArtPlayer
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  fullscreen
/>

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
