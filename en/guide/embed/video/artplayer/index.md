---
url: /en/guide/embed/video/artplayer/index.md
---
## Overview

The theme provides the capability to embed custom source videos.

This feature is powered by [vuepress-plugin-md-power](../../config/plugins/markdown-power.md).

## Configuration

This feature is disabled by default. You need to enable it in the theme configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      artPlayer: true, // [!code ++]
    },
  })
})
```

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

## Markdown Syntax

```md
@[artPlayer](src)
```

With configuration options:

```md
@[artPlayer muted autoplay loop width="100%" height="400px" ratio="16:9"](src)
```

* `src`: Video source URL

**Parameter Description:**

* `width`: Video width
* `height`: Video height
* `ratio`: Video aspect ratio, defaults to `16:9`
* `type`: Video format, automatically parsed from the video URL by default
* `autoplay`: Whether to enable autoplay
* `muted`: Whether to mute, defaults to `true` when autoplay is enabled
* `volume`: Volume level, range from `0 - 1`
* `poster`: Video poster image URL
* `auto-mini`: Automatically enters mini-player mode when the player scrolls out of the browser viewport

## Global Component

The theme provides a global component `<ArtPlayer />` to support more flexible and comprehensive usage.

### Props

| Field | Type | Description |
| -- | -- | -- |
| src | `string` | Required, video source URL |
| type | `string` | Optional, video format, parsed from `src` by default |
| width | `string` | Optional, width, defaults to `100%` |
| height | `string` | Optional, height |
| ratio | `string` | Optional, aspect ratio, defaults to `16:9` |

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
