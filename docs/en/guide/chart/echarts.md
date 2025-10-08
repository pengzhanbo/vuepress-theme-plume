---
title: ECharts
createTime: 2025/10/08 19:34:03
icon: raphael:piechart
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

Refer to the [ECharts documentation](https://echarts.apache.org/handbook/zh/get-started/) for configuration details.

## Advanced

You can import and use `defineEchartsConfig` in the
[client configuration file](https://vuejs.press/zh/guide/configuration.html##使用脚本) to customize ECharts:

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

<!-- @include: ../../../snippet/echarts-1.snippet.md{2-100} -->

### Bar Chart

**Input:**

:::: details View Code
<!-- @include: ../../../snippet/echarts-2.snippet.md -->
::::

**Output:**

<!-- @include: ../../../snippet/echarts-2.snippet.md{2-75} -->

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

<!-- @include: ../../../snippet/echarts-6.snippet.md{2-308} -->

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

<!-- @include: ../../../snippet/echarts-8.snippet.md{2-179} -->

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
