---
title: ArtPlayer Video
icon: icon-park-outline:video
createTime: 2025/10/08 16:13:54
permalink: /en/guide/embed/video/artplayer/
---

## Overview

The theme provides the capability to embed custom source videos.

This feature is powered by [vuepress-plugin-md-power](../../config/plugins/markdown-power.md).

## Installation

This feature relies on the `artplayer` player implementation. The theme does not include this dependency
by default. When enabling the `artPlayer` feature, manual installation is required.

::: npm-to

```sh
npm i artplayer
```

:::

The artPlayer player natively supports video formats including `'mp4'`, `'mp3'`, `'webm'`, and `'ogg'`.

It also supports extending compatibility for additional formats.

If your video format is `'mpd'` or `'dash'`, you need to manually install `dashjs`:

::: npm-to

```sh
npm i dashjs
```

:::

If your video format is `'m3u8'` or `'hls'`, you need to manually install `hls.js`:

::: npm-to

```sh
npm i hls.js
```

:::

If your video format is `'ts'` or `'flv'`, you need to manually install `mpegts.js`:

::: npm-to

```sh
npm i mpegts.js
```

:::

## Configuration

This feature is disabled by default. You need to enable it in the theme configuration.

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

## Markdown Syntax

```md
@[artPlayer](src)
```

With configuration options:

```md
@[artPlayer muted autoplay loop width="100%" height="400px" ratio="16:9"](src)
```

**Parameter Description:**

- `src`: `string`, video source URL
- `width`: `string`, video width, defaults to `100%`
- `height`: `string`, video height, auto by default
- `ratio`: `string`, video aspect ratio, defaults to `16:9`
- `type`: `string`, video format, parsed from the video URL by default
- `autoplay`: `boolean`, whether to enable autoplay, defaults to `false`
- `muted`: `boolean`, whether to mute, defaults to follow `autoplay` (`true` when autoplay is enabled)
- `volume`: `number`, volume level, range from `0 - 1`, defaults to `0.75`
- `poster`: `string`, video poster image URL
- `auto-mini`: `boolean`, automatically enters mini-player mode when the player scrolls out of the browser viewport, defaults to `false`

## Global Component

The theme provides a global component `<ArtPlayer />` to support more flexible and comprehensive usage.

### Props

:::: field-group
::: field src
@type `string`
@required
Video source URL
:::
::: field type
@type `string`
@default undefined
Video format. Inferred from the extension of `src` when not set
:::
::: field width
@type `string`
@default `100%`
Width
:::
::: field height
@type `string`
@default undefined
Height. Treated as auto when not specified
:::
::: field ratio
@type `string`
@default `16:9`
Aspect ratio
:::
::::

For more `Props`, please refer to the
[artPlayer documentation](https://artplayer.org/document/start/option.html). The theme supports all available options.

## Examples

::: tip Note
The video resources in the examples are sourced from [artplayer.org](https://artplayer.org).
:::

**Input:**

```md
@[artPlayer](https://artplayer.org/assets/sample/video.mp4)
```

**Output:**

@[artPlayer](https://artplayer.org/assets/sample/video.mp4)

**Input:**

```md
<ArtPlayer
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  fullscreen
/>
```

**Output:**

<ArtPlayer
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  fullscreen
/>

## Explanation

The markdown syntax `@[artPlayer](src)` is internally converted to the `<ArtPlayer />` component, which is equivalent to:

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
