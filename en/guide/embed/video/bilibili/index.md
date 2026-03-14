---
url: /en/guide/embed/video/bilibili/index.md
---
## Overview

The theme provides the capability to embed Bilibili videos.

This feature is powered by [vuepress-plugin-md-power](../../config/plugins/markdownPower.md).

## Configuration

This feature is disabled by default. You need to enable it in the theme configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      bilibili: true, // [!code ++]
    },
  })
})
```

## Syntax

Simple syntax:

```md
@[bilibili](bvid)
```

For videos with multiple parts, add `p1`, `p2`, `p3` etc. after `bilibili`:

```md
@[bilibili p1](aid cid)
```

More options:

```md
@[bilibili p1 autoplay time="0" width="100%" height="400px" ratio="16:9"](bvid aid cid)
```

**Parameter Description:**

* bvid: Video BV ID
* aid: Video AID
* cid: Video CID
* autoplay: Whether to enable autoplay
* time: Video playback start time in seconds, or in `mm:ss` or `hh:mm:ss` format
* width: Video width
* height: Video height
* ratio: Video aspect ratio, defaults to `16:9`

For videos with multiple parts, `bvid` can be omitted, but `aid` and `cid` must be provided.

## Examples

### Widescreen Video

Input:

```md
@[bilibili](BV1EZ42187Hg)
```

Output:

@[bilibili](BV1EZ42187Hg)

### Vertical Video

Input:

```md
@[bilibili width="320px" ratio="9:16"](BV1zr42187eg)
```

Output:

@[bilibili width="320px" ratio="9:16"](BV1zr42187eg)
