---
url: /en/guide/embed/video/acfun/index.md
---
## Overview

The theme provides the capability to embed AcFun videos.

This feature is powered by [vuepress-plugin-md-power](../../config/plugins/markdown-power.md).

## Configuration

This feature is disabled by default. You need to enable it in the theme configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      acfun: true, // [!code ++]
    },
  })
})
```

## Syntax

Simple syntax:

```md
@[acfun](id)
```

More options:

```md
@[acfun width="100%" height="400px" ratio="16:9"](id)
```

Parameter Description:

:::: field-group
::: field id
@type `string`
@required
Video ID
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
@default `16:10`
Video aspect ratio.
:::
::::

## Examples

### Widescreen Video

Input:

```md
@[acfun](ac47431669)
```

Output:

@[acfun](ac47431669)
