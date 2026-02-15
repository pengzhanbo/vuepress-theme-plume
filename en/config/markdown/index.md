---
url: /en/config/markdown/index.md
---
## Overview

Markdown configuration is used to control the behavior of Markdown.
This configuration aggregates various feature configurations provided by the theme for Markdown enhancements.

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // [!code ++:3]
    markdown: {
      // Configure markdown here
    },
  }),
})
```

::: warning
Do not confuse this with VuePress's [markdown](https://v2.vuepress.vuejs.org/reference/config.html#markdown) configuration.

These two are independent. Do not configure the theme's markdown settings
within [VuePress > markdown](https://v2.vuepress.vuejs.org/reference/config.html#markdown), and vice versa.
:::

**Default Configuration:**

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // [!code focus:11]
    markdown: {
      hint: true,
      alert: true,
      fileTree: true,
      plot: true,
      icons: true,
      math: { type: 'katex' },
      include: {
        // ...option
      },
    },
  }),
})
```

## Configuration Options

::: tip
The `hint` and `alert` features are implemented by
the [@vuepress/plugin-markdown-hint](https://ecosystem.vuejs.press/plugins/markdown/markdown-hint.html) plugin.
:::

### hint

* **Type:** `boolean`
* **Default:** `true`
* **Details:** Whether to enable hint containers.

### alert

* **Type:** `boolean`
* **Default:** `true`
* **Details:** Whether to enable GitHub-style alert syntax.

***

::: tip
The `image` configuration is implemented by the
[@vuepress/plugin-markdown-image](https://ecosystem.vuejs.press/plugins/markdown/markdown-image.html) plugin.
:::

### image

* **Type:** `boolean | MarkdownImagePluginOptions`
* **Default:** `false`
* **Details:** Whether to enable image enhancement syntax.

***

::: tip
The `math` configuration is implemented by the
[@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/plugins/markdown/markdown-math.html) plugin.
:::

### math

* **Type:** `boolean | MarkdownMathPluginOptions`
* **Default:** `{ type: 'katex' }`
* **Details:** Whether to enable math support.

***

### include

::: tip
The `include` configuration is implemented by the
[@vuepress/plugin-markdown-include](https://ecosystem.vuejs.press/plugins/markdown/markdown-include.html) plugin.
:::

* **Type:** `boolean | MarkdownIncludePluginOptions`
* **Default:** `true`
* **Details:** Whether to enable Markdown file inclusion.

***

::: tip The following configuration fields are implemented by the [vuepress-plugin-md-power](./plugins/markdown-power.md) plugin.
:::

### annotation

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable content annotations.

### abbr

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable abbreviation syntax.

### mark

* **Type:** `MarkOptions`
* **Default:** `'eager'`
* **Details:** Sets when the `==mark==` animation runs.

### codeTabs

* **Type:** `boolean | CodeTabsOptions`
* **Default:** `true`
* **Details:** Whether to enable code block grouping.

### tabs

* **Type:** `boolean | TabsOptions`
* **Default:** `true`
* **Details:** Whether to enable grouping.

### npmTo

* **Type:** `boolean | NpmToOptions`
* **Default:** `false`
* **Details:** Whether to enable the `npm-to` container.

### icon

* **Type:** `IconOptions`
* **Default:** `{ provider: 'iconify' }`
* **Details:** Icon configuration.

  [View **icon** usage instructions](../../theme/guide/features/icon.md){.read-more}

### plot

* **Type:** `boolean | PlotOptions`
* **Default:** `true`
* **Details:** Whether to enable hidden text syntax.

### fileTree

* **Type:** `boolean | FileTreeOptions`
* **Default:** `true`
* **Details:** Whether to enable file tree container syntax.

### field

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable field containers.

### table

* **Type:** `boolean | TableContainerOptions`
* **Default:** `false`
* **Details:** Whether to enable enhanced table containers.

### timeline

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable timeline container syntax.

### collapse

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable collapsible panel container syntax.

### chat

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable chat record containers.

### demo

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Demo containers.

### pdf

* **Type:** `boolean | PdfOptions`
* **Default:** `false`
* **Details:** Whether to enable PDF embedding syntax.

### bilibili

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Bilibili video embedding syntax.

### youtube

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable YouTube video embedding syntax.

### artPlayer

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable ArtPlayer video embedding syntax.

### audioReader

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Audio Reader audio embedding syntax.

### codepen

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable CodePen embedding syntax.

### codeSandbox

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable CodeSandbox embedding syntax.

### jsfiddle

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable JS Fiddle embedding syntax.

### repl

* **Type:** `boolean | ReplOptions`
* **Default:** `false`
* **Details:** Whether to enable Repl container syntax.

### caniuse

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Can I Use embedding syntax.

### imageSize

* **Type:** `boolean | 'local' | 'all'`
* **Default:** `false`
* **Details:** Whether to enable automatic filling of image width and height attributes.

***

::: tip
The following configuration fields are implemented by the
[@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/) plugin.
:::

### chartjs

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Chart.js chart embedding syntax.

### echarts

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable ECharts chart embedding syntax.

### mermaid

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Mermaid diagram embedding syntax.

### markmap

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Markmap diagram embedding syntax.

### plantuml

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable PlantUML diagram embedding syntax.

### flowchart

* **Type:** `boolean`
* **Default:** `false`
* **Details:** Whether to enable Flowchart diagram embedding syntax.
