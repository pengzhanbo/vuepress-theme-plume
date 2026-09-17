---
url: /en/guide/embed/pdf/index.md
---
## Overview

The theme supports embedding PDF files in markdown, enabling direct PDF reading within the page.

This feature is powered by [vuepress-plugin-md-power](../../config/plugins/markdown-power.md).

## Configuration

This feature is disabled by default. You need to enable it in the theme configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      pdf: true, // [!code ++]
    },
  })
})
```

## Syntax

The simplest syntax is as follows:

```md
@[pdf](url)
```

To open a specific page, use the `page` option. The shorthand `@[pdf 2](url)` is also supported for backward compatibility.

```md
@[pdf page="2"](url)
```

Additional options can be added to `@[pdf ]` for more flexible control:

```md
@[pdf page="2" width="100%" ratio="16:9"](url)
```

* `page` - Page number, defaults to `1`
* `width` - Width, defaults to `100%`
* `height` - Height, defaults to `auto`
* `ratio` - Aspect ratio, defaults to `1:0.9`, only effective when `height` is not specified

## Examples

### Default

Input:

```md
@[pdf](https://plume.pengzhanbo.cn/files/sample-1.pdf)
```

Output:

@[pdf](/files/sample-1.pdf)

### Set Page Number to 2

Input:

```md
@[pdf page="2"](https://plume.pengzhanbo.cn/files/sample-1.pdf)
```

Output:

@[pdf page="2"](/files/sample-1.pdf)

### Fixed Height

Input:

```md
@[pdf height="400px"](https://plume.pengzhanbo.cn/files/sample-1.pdf)
```

Output:

@[pdf height="400px"](/files/sample-1.pdf)

### 21:29 Aspect Ratio

Input:

```md
@[pdf ratio="21:29"](https://plume.pengzhanbo.cn/files/sample-1.pdf)
```

Output:

@[pdf ratio="21:29"](/files/sample-1.pdf)
