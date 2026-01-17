---
url: /en/guide/components/plot/index.md
---
## Overview

Use the `<Plot>` component to display [plot text](../markdown/plot.md) with more flexible control over behavior.

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

::: field name="trigger" type="'hover' | 'click'" default="'hover'" optional
Trigger on mouse hover or click
:::

::: field name="effect" type="'blur' | 'mask'" default="'mask'" optional
Mask layer effect or text blur effect
:::

::::

## Examples

**Input:**

```md :no-line-numbers
- Hover - <Plot>Visible on hover</Plot>
- Click - <Plot trigger="click">Visible on click</Plot>
```

**Output:**

* Hover - Visible on hover
* Click - Visible on click
