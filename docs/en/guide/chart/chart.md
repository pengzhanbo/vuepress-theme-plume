---
title: chart.js
createTime: 2025/10/08 19:33:49
icon: solar:chart-bold
permalink: /en/guide/chart/chartjs/
---

[chart.js]: https://www.chartjs.org/docs/latest/

## Overview

The theme supports embedding [chart.js] charts within articles.

This feature is powered by [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/).

## Configuration

This feature is disabled by default in the theme.

You need to install the [chart.js] library in your project.

::: npm-to

```sh
npm install chart.js
```

:::

Then, enable the feature in the `.vuepress/config.ts` configuration file:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      chartjs: true, // [!code ++]
    },
  })
})
```

## Syntax

````md
::: chartjs Title
```json
{
  // Chart configuration goes here
}
```
:::
````

Refer to the [chart.js] documentation for chart configuration details.

## Examples

::: note
Examples are forked from [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/plugins/markdown/markdown-chart/chartjs.html),
licensed under [MIT](https://github.com/vuepress/ecosystem/blob/main/LICENSE).
:::

### Bar Chart

**Input:**

<!-- @include: ../../../snippet/chart-1.snippet.md -->

**Output:**

<!-- @include: ../../../snippet/chart-1.snippet.md{2-41} -->

### Bubble Chart

**Input:**

<!-- @include: ../../../snippet/chart-2.snippet.md -->

**Output:**

<!-- @include: ../../../snippet/chart-2.snippet.md{2-20} -->

### Line Chart

**Input:**

<!-- @include: ../../../snippet/chart-3.snippet.md -->

**Output:**

<!-- @include: ../../../snippet/chart-3.snippet.md{2-20} -->

### Polar Area Chart

**Input:**

<!-- @include: ../../../snippet/chart-4.snippet.md -->

**Output:**

<!-- @include: ../../../snippet/chart-4.snippet.md{2-24} -->

### Radar Chart

**Input:**

<!-- @include: ../../../snippet/chart-5.snippet.md -->

**Output:**

<!-- @include: ../../../snippet/chart-5.snippet.md{2-42} -->

### Scatter Chart

**Input:**

<!-- @include: ../../../snippet/chart-6.snippet.md -->

**Output:**

<!-- @include: ../../../snippet/chart-6.snippet.md{2-30} -->
