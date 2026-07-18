---
title: Plot Text
icon: lets-icons:hide-eye
createTime: 2025/10/08 23:02:39
permalink: /en/guide/components/plot/
---

## Overview

Use the `<VPPlot>` component to display [plot text](../markdown/plot.md) with more flexible control over behavior.

This component is disabled by default and needs to be enabled in the theme configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      plot: true,
    },
  })
})
```

## Props

:::: field-group

::: field trigger
@type `'hover' | 'click'`
@default `'hover'`
@optional

Trigger on mouse hover or click
:::

::: field effect
@type `'blur' | 'mask'`
@default `'mask'`
@optional
Mask layer effect or text blur effect
:::

::::

## Examples

**Input:**

```md :no-line-numbers
- Hover - <VPPlot>Visible on hover</VPPlot>
- Click - <VPPlot trigger="click">Visible on click</VPPlot>
```

**Output:**

- Hover - <VPPlot>Visible on hover</VPPlot>
- Click - <VPPlot trigger="click">Visible on click</VPPlot>
