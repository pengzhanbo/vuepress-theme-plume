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

Parameter Description:

:::: field-group
::: field id
@type `string`
@required
Video ID
:::
::: field autoplay
@type `boolean`
@default `false`
Whether to enable autoplay
:::
::: field loop
@type `boolean`
@default `false`
Whether to enable loop playback
:::
::: field start
@type `number | string`
@default undefined
Video playback start time in seconds, or in `mm:ss` or `hh:mm:ss` format
:::
::: field end
@type `number | string`
@default undefined
Video playback end time in seconds, or in `mm:ss` or `hh:mm:ss` format
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

## Examples

### Widescreen Video

Input:

```md
@[youtube](0JJPfz5dg20)
```

Output:

@[youtube](0JJPfz5dg20)
