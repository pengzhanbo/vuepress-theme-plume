---
title: AcFun Video
icon: lets-icons:video-fill
createTime: 2025/10/08 10:57:45
permalink: /en/guide/embed/video/acfun/
badge: New
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

**Parameter Description:**

- id: Video ID
- width: Video width
- height: Video height
- ratio: Video aspect ratio, defaults to `16:9`

## Examples

### Widescreen Video

Input:

```md
@[acfun](ac47431669)
```

Output:

@[acfun](ac47431669)
