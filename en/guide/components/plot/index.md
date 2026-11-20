---
url: /en/guide/components/plot/index.md
---
## Overview

Use the `<VPPlot>` component to display [plot text](../markdown/v-plot.md) with more flexible control over behavior.

This component is **available by default**.

To change the site-wide defaults, pass an object via `markdown.plot`:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      plot: {
        trigger: 'click',
      },
    },
  }),
})
```

## Props

:::: field-group

::: field trigger
@type `'hover' | 'click'`
@default `'hover'`
Trigger on mouse hover or click
:::

::: field effect
@type `'blur' | 'mask'`
@default `'mask'`
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

* Hover - Visible on hover
* Click - Visible on click
