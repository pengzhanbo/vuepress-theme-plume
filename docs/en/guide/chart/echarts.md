---
title: ECharts
icon: raphael:piechart
createTime: 2025/10/08 19:34:03
permalink: /en/guide/chart/echarts/
---

## Overview

The theme supports embedding [ECharts](https://echarts.apache.org/zh/index.html) charts within articles.

This feature is powered by [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/).

## Configuration

This feature is disabled by default in the theme.

You need to install the [ECharts](https://echarts.apache.org/zh/index.html) library in your project.

::: npm-to

```sh
npm install echarts
```

:::

Then, enable the feature in the `.vuepress/config.ts` configuration file:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      echarts: true, // [!code ++]
    },
  })
})
```

::: note
The following documentation is forked from [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/echarts.html),
licensed under [MIT](https://github.com/vuepress/ecosystem/blob/main/LICENSE).
:::

## Syntax

### JSON Configuration

If you can easily generate data, you can provide ECharts configuration directly through a JSON code block:

````md
::: echarts Title

```json
{
  // ECharts chart configuration goes here
}
```

:::
````

### JavaScript Configuration

If you need to fetch data through scripts, you can use js and javascript code blocks.

The Echarts instance is exposed through the `echarts` variable, and you should assign the Echarts configuration to the `option` variable.
You can also assign `width` and `height` to set the chart dimensions.

````md
::: echarts Title
```js
const option = {
  // ECharts chart configuration goes here
}
```
:::
````

:::tip
You can use top-level `await` and `fetch` to retrieve data from network requests.
:::

:::: warning Script code blocks are not executed by default

Scripts inside chart code blocks are **not executed by default**: the page only shows a blank area, and the build outputs a single warning line with no other error prompts.

If you really need to execute them, you must enable **both** of the following switches:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      DANGEROUS_ALLOW_SCRIPT_EXECUTION: true,
      DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST: '*',
    },
  }),
})
```

- `DANGEROUS_ALLOW_SCRIPT_EXECUTION`: Allows executing scripts in chart code blocks
- `DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST`: The list of source files allowed to execute scripts; passing `'*'` allows all source files

Once enabled, scripts in chart code blocks will run in visitors' browsers, **which may introduce XSS or remote code execution risks**.
Enable it only when the content source is fully trusted, and prefer a file allowlist over `'*'`.
::::

Refer to the [ECharts documentation](https://echarts.apache.org/handbook/zh/get-started/) for configuration details.

## Advanced

You can import and use `defineEchartsConfig` in the
[client configuration file](https://vuejs.press/guide/configuration.html#client-config-file) to customize ECharts:

```ts
import { defineEchartsConfig } from '@vuepress/plugin-markdown-chart/client'
import { defineClientConfig } from 'vuepress/client'

defineEchartsConfig({
  options: {
    // Global ECharts configuration
  },
  setup: async () => {
    // ECharts setup
    // Example: await import("echarts-wordcloud")
  },
})

export default defineClientConfig({
  // ...
})
```

## Examples

### Line Chart

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-1.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-1.snippet.md{2-94} -->

### Bar Chart

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-2.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-2.snippet.md{2-78} -->

### Pie Chart

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-3.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-3.snippet.md{2-74} -->

### Scatter Chart

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-4.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-4.snippet.md{2-39} -->

### Polar Chart

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-5.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-5.snippet.md{2-40} -->

### Candlestick Chart

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-6.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-6.snippet.md{2-307} -->

### Radar Chart

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-7.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-7.snippet.md{2-36} -->

### Heatmap

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-8.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-8.snippet.md{2-165} -->

### Tree Chart

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-9.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-9.snippet.md{2-33} -->

### Multiple Charts

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-10.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-10.snippet.md{2-69} -->
