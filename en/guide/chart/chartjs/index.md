---
url: /en/guide/chart/chartjs/index.md
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

**Output:**

### Bubble Chart

**Input:**

**Output:**

### Line Chart

**Input:**

**Output:**

### Polar Area Chart

**Input:**

**Output:**

### Radar Chart

**Input:**

**Output:**

### Scatter Chart

**Input:**

**Output:**
