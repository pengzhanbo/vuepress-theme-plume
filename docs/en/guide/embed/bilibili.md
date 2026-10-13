---
title: Bilibili Video
icon: ri:bilibili-fill
createTime: 2025/10/08 12:26:47
permalink: /en/guide/embed/video/bilibili/
---

## Overview

The theme provides the capability to embed Bilibili videos.

This feature is powered by [vuepress-plugin-md-power](../../config/plugins/markdown-power.md).

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

Parameter Description:

:::: field-group
::: field bvid
@type `string`
Video BV ID, starting with `BV`
:::
::: field aid
@type `string`
Video AID. It can be omitted when used together with `cid`
:::
::: field cid
@type `string`
Video CID
:::
::: field p1
@type `string`
Part marker, just write it as-is (e.g. `@[bilibili p1](…)`); `p1` / `p2` / … are supported
:::
::: field autoplay
@type `boolean`
@default `false`
Whether to enable autoplay
:::
::: field time
@type `number | string`
@default undefined
Video playback start time in seconds, or in `mm:ss` or `hh:mm:ss` format
:::
::: field width
@type `string`
@default `100%`
Video width
:::
::: field height
@type `string`
@default undefined
Video height. When not specified, it is handled as automatic height
:::
::: field ratio
@type `string`
@default `16:9`
Video aspect ratio
:::
::::

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
