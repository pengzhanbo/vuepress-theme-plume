---
url: /en/config/plugins/markdown-power/index.md
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
      icons: true, // ::collect:name:: Inline iconify icons
      // The following features are not enabled by default; you need to enable them manually
      // npmTo: true, // :::npm-to
      // demo: true, // :::demo
      // pdf: true, // @[pdf](url) Embed PDF files
      // bilibili: true, // @[bilibili](bvid) Embed bilibili videos
      // acfun: true, // @[acfun](id) Embed AcFun videos
      // youtube: true, // @[youtube](id) Embed YouTube videos
      // codepen: true, // @[codepen](user/slash) Embed CodePen
      // replit: true, // @[replit](user/repl-name) Embed Replit
      // codeSandbox: true, // @[codesandbox](id) Embed CodeSandbox
      // jsfiddle: true, // @[jsfiddle](id) Embed JSFiddle
      // caniuse: true, // @[caniuse](feature) Embed Can I Use
      // repl: true, // :::go-repl :::kotlin-repl :::rust-repl
      // imageSize: true, // Add width/height attributes to images during build
    },
    // Can also be configured in `plugins.markdownPower`, but not recommended
    plugins: {
      markdownPower: {}
    }
  }),
})
```

## Features

### Embed PDF

This feature is not enabled by default; you need to manually set `pdf` to `true`.

**Syntax:**

```md
@[pdf](url)
```

Please refer to the [Complete Usage Documentation](../../guide/embed/pdf.md)

### Iconify Icons

This feature is not enabled by default; you need to manually set `icons` to `true`.

Thanks to [iconify](https://iconify.design/), you can use **200k+** icons from Iconify in Markdown.

**Syntax:**

```md
::collect:name::
```

Please refer to the [Complete Usage Documentation](../../guide/markdown/icons.md)

### Bilibili Video

This feature is not enabled by default; you need to manually set `bilibili` to `true`.

**Syntax:**

```md
@[bilibili](bvid)
```

Please refer to the [Complete Usage Documentation](../../guide/embed/bilibili.md)

### AcFun Video

This feature is not enabled by default; you need to manually set `acfun` to `true`.

**Syntax:**

```md
@[acfun](id)
```

Please refer to the [Complete Usage Documentation](../../guide/embed/video/acfun.md)

### YouTube Video

This feature is not enabled by default; you need to manually set `youtube` to `true`.

**Syntax:**

```md
@[youtube](id)
```

Please refer to the [Complete Usage Documentation](../../guide/embed/youtube.md)

### CodePen Demo

This feature is not enabled by default; you need to manually set `codepen` to `true`.

**Syntax:**

```md
@[codepen](user/slash)
```

Please refer to the [Complete Usage Documentation](../../guide/repl/codepen.md)

### CodeSandbox Demo

This feature is not enabled by default; you need to manually set `codeSandbox` to `true`.

**Syntax:**

```md
@[codesandbox](id)
```

Please refer to the [Complete Usage Documentation](../../guide/repl/codeSandbox.md)

### JSFiddle Demo

This feature is not enabled by default; you need to manually set `jsfiddle` to `true`.

**Syntax:**

```md
@[jsfiddle](id)
```

Please refer to the [Complete Usage Documentation](../../guide/repl/jsFiddle.md)

### Can I Use Browser Support

This feature is not enabled by default; you need to manually set `caniuse` to `true`.

**Syntax:**

```md
@[caniuse](feature)
```

Please refer to the [Complete Usage Documentation](../../guide/markdown/caniuse.md)

### Repl Code Demo Container

This feature is not enabled by default; you need to manually set `repl` to `true`.

Supports online execution of Rust, Golang, and Kotlin code, as well as online editing.

Alternatively, you can enable specific features, as shown below:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        repl: {
          rust: true,
          go: true,
          kotlin: true,
        },
      },
    }
  })
})
```

**Syntax:**

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
// python code
```
:::
````

Please refer to the complete usage documentation:

* [Code Demo > Rust](../../guide/repl/rust.md)
* [Code Demo > Golang](../../guide/repl/golang.md)
* [Code Demo > Kotlin](../../guide/repl/kotlin.md)
* [Code Demo > Python](../../guide/repl/python.md)

### Plot Hidden Text

This feature is not enabled by default; you need to manually set `plot` to `true`.

**Syntax:**

```md
!!content!!
```

Please refer to the [Complete Usage Documentation](../../guide/markdown/plot.md)

### File Tree

This feature is not enabled by default; you need to manually set `fileTree` to `true`.

**Syntax:**

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

Please refer to the [Complete Usage Documentation](../../guide/markdown/file-tree.md)

### Image Dimensions

This feature adds `width` and `height` attributes to image references in markdown files.
It reads the original dimensions of the images to set default image sizes and aspect ratios.
This resolves layout flickering issues that occur between when an image starts loading and when it completes.

This feature is not enabled by default; you need to manually configure `imageSize`:

* If `imageSize` is `true`, the plugin only processes local images, equivalent to the `local` option;
* If `imageSize` is `'local'`, the plugin only processes local images;
* If `imageSize` is `'all'`, the plugin processes both local and remote images.

::: important
**This feature only takes effect during production builds.**

Use the `'all'` option with caution, as it will request remote image resources during production builds,
which can significantly increase build time.
Although the theme optimizes this by loading only **a few KB** of data from each image to analyze dimensions, it will still impact build performance.
:::
