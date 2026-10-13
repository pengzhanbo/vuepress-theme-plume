---
title: Markdown Power
createTime: 2025/10/09 06:56:33
permalink: /en/config/plugins/markdown-power/
---

## Overview

Provides Markdown enhancement features for the theme.

Related plugin: [vuepress-plugin-md-power](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-md-power)

## Configuration

Default configuration:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      fileTree: true, // :::file-tree File tree container
      plot: true, // !!plot!! Hidden text
      icon: {}, // ::collect:name:: Inline iconify
      // The following features are not enabled by default; you need to enable them manually
      // npmTo: true, // :::npm-to
      // demo: true, // :::demo
      // pdf: true, // @[pdf](url) Embed PDF files
      // bilibili: true, // @[bilibili](bvid) Embed bilibili videos
      // acfun: true, // @[acfun](id) Embed AcFun videos
      // youtube: true, // @[youtube](id) Embed YouTube videos
      // codepen: true, // @[codepen](user/slash) Embed CodePen
      // codeSandbox: true, // @[codesandbox](id) Embed CodeSandbox
      // jsfiddle: true, // @[jsfiddle](id) Embed JSFiddle
      // caniuse: true, // @[caniuse](feature) Embed Can I Use
      // repl: true, // :::go-repl :::kotlin-repl :::rust-repl :::python-repl
      // imageSize: true, // Add width/height attributes to images during build
      // replit: true, // Deprecated, use repl
    },
  }),
})
```

For configuration entry priority information, please refer to [Plugin Configuration Entry](./README.md#configuration-entry-priority).

## Features

### Embed PDF

This feature is not enabled by default; you need to manually set `pdf` to `true`.

__Syntax:__

```md
@[pdf](url)
```

Please refer to the [Complete Usage Documentation](../../guide/embed/v-pdf.md)

### Iconify Icons

The theme enables icon support by default (equivalent to `icon: {}`), so no extra configuration is required.

Thanks to [iconify](https://iconify.design/), you can use __200k+__ icons from Iconify in Markdown.

__Syntax:__

```md
::collect:name::
```

Please refer to the [Complete Usage Documentation](../../guide/markdown/v-icons.md)

The type of `icon` is `IconOptions` (an object), and it **does not accept `boolean`**. `icon: true` will not be recognized;
use `icon: {}` or `icon: { provider: 'iconify' }` instead.
The former `icons` field is deprecated, and its behavior is equivalent to `icon: {}`.

You can also pass an object for more detailed configuration:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      icon: {
        // Icon provider, defaults to 'iconify'
        provider: 'iconify', // 'iconify' | 'iconfont' | 'fontawesome'
        // Icon size, defaults to '1em'
        size: '1em',
        // Icon color, defaults to 'currentColor'
        color: 'currentColor',
        // Icon prefix
        // iconify: defaults to '', supports collection names such as 'mdi', 'ri', etc.
        // iconfont: defaults to 'iconfont icon-'
        // fontawesome: defaults to 'fas'
        prefix: '',
        // iconify only: preload icons, used to preset local assets when using <VPIcon> directly in components
        preload: ['mdi:home', 'ri:github-fill'],
        // iconfont/fontawesome only: icon asset link
        // assets: '//at.alicdn.com/t/font_xxx.css',
      },
    },
  }),
})
```

### Bilibili Video

This feature is not enabled by default; you need to manually set `bilibili` to `true`.

__Syntax:__

```md
@[bilibili](bvid)
```

Please refer to the [Complete Usage Documentation](../../guide/embed/bilibili.md)

### AcFun Video

This feature is not enabled by default; you need to manually set `acfun` to `true`.

__Syntax:__

```md
@[acfun](id)
```

Please refer to the [Complete Usage Documentation](../../guide/embed/acfun.md)

### YouTube Video

This feature is not enabled by default; you need to manually set `youtube` to `true`.

__Syntax:__

```md
@[youtube](id)
```

Please refer to the [Complete Usage Documentation](../../guide/embed/youtube.md)

### CodePen Demo

This feature is not enabled by default; you need to manually set `codepen` to `true`.

__Syntax:__

```md
@[codepen](user/slash)
```

Please refer to the [Complete Usage Documentation](../../guide/repl/v-codepen.md)

### CodeSandbox Demo

This feature is not enabled by default; you need to manually set `codeSandbox` to `true`.

__Syntax:__

```md
@[codesandbox](id)
```

Please refer to the [Complete Usage Documentation](../../guide/repl/v-code-sandbox.md)

### JSFiddle Demo

This feature is not enabled by default; you need to manually set `jsfiddle` to `true`.

__Syntax:__

```md
@[jsfiddle](id)
```

Please refer to the [Complete Usage Documentation](../../guide/repl/v-js-fiddle.md)

### Can I Use Browser Support

This feature is not enabled by default; you need to manually set `caniuse` to `true`.

__Syntax:__

```md
@[caniuse](feature)
```

Please refer to the [Complete Usage Documentation](../../guide/markdown/v-caniuse.md)

### Repl Code Demo Container

This feature is not enabled by default; you need to manually set `repl` to `true`.

Supports online execution of Rust, Golang, Kotlin, and Python code, as well as online editing.

You can also enable only some of the languages, in which case use the top-level `markdown` entry (recommended):

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      repl: {
        rust: true,
        go: true,
        kotlin: true,
        python: true,
      },
    },
  }),
})
```

__Syntax:__

````md
::: rust-repl
```rust
// rust code
```
:::

::: go-repl
```go
// go code
```
:::

::: kotlin-repl
```kotlin
// kotlin code
```
:::

::: python-repl
```python
# python code
```
:::
````

Please refer to the complete usage documentation:

- [Code Demo > Rust](../../guide/repl/rust.md)
- [Code Demo > Golang](../../guide/repl/golang.md)
- [Code Demo > Kotlin](../../guide/repl/kotlin.md)
- [Code Demo > Python](../../guide/repl/python.md)

### Plot Hidden Text

The theme enables this feature by default (equivalent to `plot: true`). Set `plot` to `false` to disable it entirely.

__Syntax:__

```md
!!content!!
```

Please refer to the [Complete Usage Documentation](../../guide/markdown/v-plot.md)

### File Tree

The theme enables this feature by default (equivalent to `fileTree: true`). Set `fileTree` to `false` to disable it entirely.

__Syntax:__

```md
::: file-tree

- folder1
  - file1.md
  - file2.ts
  - folder2
    - file3.md
- folder3

:::
```

Please refer to the [Complete Usage Documentation](../../guide/markdown/v-file-tree.md)

### Image Dimensions

This feature adds `width` and `height` attributes to image references in markdown files.
It reads the original dimensions of the images to set default image sizes and aspect ratios.
This resolves layout flickering issues that occur between when an image starts loading and when it completes.

This feature is not enabled by default; you need to manually configure `imageSize`:

- If `imageSize` is `true`, the plugin only processes local images, equivalent to the `local` option;
- If `imageSize` is `'local'`, the plugin only processes local images;
- If `imageSize` is `'all'`, the plugin processes both local and remote images.

::: important
__This feature only takes effect during production builds.__

Use the `'all'` option with caution, as it will request remote image resources during production builds,
which can significantly increase build time.
Although the theme optimizes this by loading only __a few KB__ of data from each image to analyze dimensions, it will still impact build performance.
:::
