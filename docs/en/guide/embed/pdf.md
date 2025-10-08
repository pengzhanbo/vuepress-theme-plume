---
title: PDF Reader
icon: teenyicons:pdf-outline
createTime: 2025/10/08 13:30:53
permalink: /en/guide/embed/pdf/
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

To open a specific page, add a page number after `pdf`:

```md
@[pdf 2](url)
```

Additional options can be added to `@[pdf ]` for more flexible control:

```md
@[pdf 2 no-toolbar width="100%" height="400px" ratio="16:9" zoom="100"](url)
```

- `no-toolbar` - Hide the toolbar
- `width` - Width, defaults to 100%
- `height` - Height, defaults to `auto`
- `ratio` - Aspect ratio, defaults to `16:9`, only effective when height is not specified
- `zoom` - Zoom level, percentage

## Examples

### Default

Input:

```md
@[pdf](https://plume.pengzhanbo.cn/files/sample.pdf)
```

Output:

@[pdf](/files/sample.pdf)

### Set Page Number to 2

Input:

```md
@[pdf 2](https://plume.pengzhanbo.cn/files/sample.pdf)
```

Output:

@[pdf 2 zoom="95"](/files/sample.pdf)

### Hide Toolbar

Input:

```md
@[pdf no-toolbar](https://plume.pengzhanbo.cn/files/sample.pdf)
```

Output:

@[pdf no-toolbar](/files/sample.pdf)

### 90% Zoom Level

Input:

```md
@[pdf zoom="90"](https://plume.pengzhanbo.cn/files/sample.pdf)
```

Output:

@[pdf zoom="90"](/files/sample.pdf)

### 21:29 Aspect Ratio

Input:

```md
@[pdf zoom="95" ratio="21:29"](https://plume.pengzhanbo.cn/files/sample.pdf)
```

Output:

@[pdf zoom="95" ratio="21:29"](/files/sample.pdf)
