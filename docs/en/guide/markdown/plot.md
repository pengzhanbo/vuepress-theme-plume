---
title: Secret Text
createTime: 2025/03/24 16:56:15
icon: weui:eyes-off-outlined
permalink: /en/guide/markdown/plot/
---

## Overview

Sometimes you may want to partially conceal text content rather than displaying it outright - whether to spark readers' curiosity or simply add an element of playful interactivity.

To fulfill this whimsical need, the theme provides an interesting **'secret text'** feature. Here's how it looks:

:::demo-wrapper
Did you know that !!Lu Xun!! once said: "!!I never said this quote!!!" This revelation struck me with sudden clarity, inspiring me with unparalleled energy! Consequently, !!I rolled over in bed!!!
:::

Readers can't directly view the complete content - concealed portions require mouse hover to reveal.

## Configuration

This feature is disabled by default. Enable it in `theme` configuration:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      plot: true, // [!code ++]
    }
  })
})
```

`markdownPower.plot` accepts `boolean | PlotOptions` type:

```ts
interface PlotOptions {
  /**
   * Enable `!! !!` markdown syntax (non-standard markup, requires plugin)
   * If false, only <Plot /> component can be used
   * @default true
   */
  tag?: boolean

  /**
   * Mask layer color
   */
  mask?: string | { light: string, dark: string }

  /**
   * Text color
   */
  color?: string | { light: string, dark: string }

  /**
   * Trigger method
   *
   * @default 'hover'
   */
  trigger?: 'hover' | 'click'
}
```

## Syntax

```md
!!Content to conceal!!
```

If you prefer not to use non-standard `!! !!` syntax, set `plot.tag` to `false` and use the [`<Plot />`](../components/plot.md) component instead.

## Examples

Input:

```md
Did you know that !!Lu Xun!! once said: "!!I never said this quote!!!" This revelation struck me with sudden clarity, inspiring me with unparalleled energy! Consequently, !!I rolled over in bed!!!
```

Output:

:::demo-wrapper
Did you know that !!Lu Xun!! once said: "!!I never said this quote!!!" This revelation struck me with sudden clarity, inspiring me with unparalleled energy! Consequently, !!I rolled over in bed!!!
:::
