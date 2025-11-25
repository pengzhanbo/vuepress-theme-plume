---
url: /en/guide/embed/video/youtube/index.md
---
## Overview

The theme provides the capability to embed YouTube videos.

This feature is powered by [vuepress-plugin-md-power](../../config/plugins/markdown-power.md).

## Configuration

This feature is disabled by default. You need to enable it in the theme configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      youtube: true, // [!code ++]
    },
  })
})
```

## Syntax

Simple syntax:

```md
@[youtube](id)
```

More options:

```md
@[youtube autoplay loop start="0" end="0" width="100%" height="400px" ratio="16:9"](id)
```

**Parameter Description:**

* id: Video ID
* autoplay: Whether to enable autoplay
* loop: Whether to enable loop playback
* start: Video playback start time in seconds, or in `mm:ss` or `hh:mm:ss` format
* end: Video playback end time in seconds, or in `mm:ss` or `hh:mm:ss` format
* width: Video width
* height: Video height
* ratio: Video aspect ratio, defaults to `16:9`

## Examples

### Widescreen Video

Input:

```md
@[youtube](0JJPfz5dg20)
```

Output:

@[youtube](0JJPfz5dg20)
