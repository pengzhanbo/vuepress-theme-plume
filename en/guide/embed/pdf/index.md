---
url: /en/guide/embed/pdf/index.md
---
## Overview

The theme supports embedding PDF files in markdown, enabling direct PDF reading within the page.

This feature is powered by [vuepress-plugin-md-power](../../config/plugins/markdown-power.md).

## Configuration

This feature is disabled by default. You need to enable it in the theme configuration.

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      pdf: true, // [!code ++]
    },
  }),
})
```

## Syntax

The simplest syntax is as follows:

```md
@[pdf](url)
```

### Specifying the Page Number

To open a specific page, use the `page` option to specify the page number. For backward compatibility,
the shorthand form of writing the page number directly after `pdf`, `@[pdf 2](url)`, is also supported.

```md
@[pdf page="2"](url)  <!-- recommended form -->
@[pdf 2](url)
```

### More Options

Additional options can be added to `@[pdf]` for more flexible control:

```md
@[pdf page="2" no-toolbar width="100%" height="600px" zoom="75" ratio="16:9"](url)
```

:::: field-group
::: field page
@type `number`
@default `1`
Page number.
:::
::: field no-toolbar
@type `boolean`
@default `false`
Hide the PDF.js toolbar
:::
::: field zoom
@type `number`
@default `50`
Zoom level (percentage number)
:::
::: field width
@type `string`
@default `100%`
Width
:::
::: field height
@type `string`
@default undefined
Height. Treated as auto when not specified
:::
::: field ratio
@type `string`
@default `16/9`
Aspect ratio. Only effective when `height` is not specified
:::
::::

:::: details Browser does not support the built-in PDF reader?
The theme uses the `<embed>` tag to render PDF files, but some browsers do not support the built-in PDF reader (usually limited in mobile browsers).

For unsupported browsers, the theme uses [PDF.js](https://mozilla.github.io/pdf.js/) as a fallback,
which is loaded from `https://static.pengzhanbo.cn/pdfjs/` by default.

For offline builds, intranet deployments, or cases with compliance requirements on third-party resources,
you can point `markdown.pdf.pdfjsUrl` to a self-hosted address:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      pdf: { pdfjsUrl: '/pdfjs/' },
    },
  }),
})
```

::::

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
