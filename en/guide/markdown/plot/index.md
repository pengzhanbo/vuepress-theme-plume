---
url: /en/guide/markdown/plot/index.md
---
## Overview

Sometimes, you may not want to display text content completely unreservedly, preferring to maintain some secrecy.
This could be to pique readers' curiosity or simply to add a bit of reading difficulty, making the article more interesting.

To satisfy this playful intention, the theme provides a fun little feature called **"plot" text**. It looks like this:

:::demo-wrapper
Did you know that !!Lu Xun!! once said: "!!I never said this!!!" It was an enlightening revelation that deeply
inspired me, filling me with unparalleled strength! So, !!I turned over in bed!!!
:::

Readers cannot directly read the complete content - parts of it are "covered up" and require hovering the
mouse over the content to see what's hidden.

## Configuration

This feature is disabled by default. You need to enable it in the `theme` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      plot: true, // [!code ++]
    }
  })
})
```

`markdownPower.plot` accepts either `boolean | PlotOptions` type, which controls the default behavior of this feature.

```ts
interface PlotOptions {
  /**
   * Trigger method
   *
   * @default 'hover'
   */
  trigger?: 'hover' | 'click'

  /**
   * Mask layer effect
   *
   * @default 'mask'
   */
  effect?: 'mask' | 'blur'
}
```

## Syntax

```md
!!hidden content!!
```

You can also control behavior through attribute syntax:

```md
!!hidden content!!{.click}
!!hidden content!!{.hover}

!!hidden content!!{.mask}
!!hidden content!!{.blur}

!!hidden content!!{.blur .click}
```

* `.click` - Trigger on click
* `.hover` - Trigger on mouse hover
* `.mask` - Mask layer effect
* `.blur` - Text blur effect

::: info You can also use the [`<Plot />`](../components/plot.md) component as an alternative.
:::

## Frontmatter

Use the `plot` option in Frontmatter to control the default behavior of this feature on the current page:

```
---
plot:
  trigger: hover
  effect: blur
---
```

## Examples

**Input**:

```md
Did you know that !!Lu Xun!! once said: "!!I never said this!!!" It was an enlightening revelation that deeply inspired me, filling me with unparalleled strength! So, !!I turned over in bed!!!!
```

**Output**:

:::demo-wrapper
Did you know that !!Lu Xun!! once said: "!!I never said this!!!" It was an enlightening revelation that
deeply inspired me, filling me with unparalleled strength! So, !!I turned over in bed!!!!
:::

**Input**:

```md
Mask effect + hover: !!Hover to see me!!{.mask .hover}
Mask effect + click: !!Click to see me!!{.mask .click}
Blur effect + hover: !!Hover to see me!!{.blur .hover}
Blur effect + click: !!Click to see me!!{.blur .click}
```

**Output**:

:::demo-wrapper
Mask effect + hover: !!Hover to see me!!{.mask .hover}

Mask effect + click: !!Click to see me!!{.mask .click}

Blur effect + hover: !!Hover to see me!!{.blur .hover}

Blur effect + click: !!Click to see me!!{.blur .click}
:::
