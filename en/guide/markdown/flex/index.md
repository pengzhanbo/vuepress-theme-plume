---
url: /en/guide/markdown/flex/index.md
---
## Overview

The Flex container `::: flex` provides a convenient way to apply Flexbox layout to block-level content in markdown.

## Syntax

```md
::: flex [center|between|around] [start|center|end] [gap="20"] [column]

<!-- Block content 1 -->

<!-- Block content 2 -->

:::
```

## Props

:::: field-group
::: field center / between / around
@type `boolean`
Alignment along the main axis; just write one of them
:::
::: field start / center / end
@type `boolean`
Alignment along the cross axis; just write one of them
:::
::: field gap
@type `number | string`
@default `16`
Spacing
:::
::: field column
@type `boolean`
Sets the main axis direction to vertical
:::
::: field wrap
@type `boolean`
Allows child elements to wrap (`flex-wrap: wrap`)
:::
::::

## Examples

### Centered Table Alignment

**Input:**

```md
::: flex center

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| 1        | 2        | 3        |
| 4        | 5        | 6        |

:::
```

**Output:**

::: flex center

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| 1        | 2        | 3        |
| 4        | 5        | 6        |

:::

### Two Tables with Left-Right Alignment

**Input:**

```md
::: flex between center

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| 1        | 2        | 3        |
| 4        | 5        | 6        |

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| 1        | 2        | 3        |
| 4        | 5        | 6        |

:::
```

**Output:**

::: flex between center

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| 1        | 2        | 3        |
| 4        | 5        | 6        |

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| 1        | 2        | 3        |
| 4        | 5        | 6        |

:::

### Evenly Spaced Tables

**Input:**

```md
::: flex around center

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| 1        | 2        | 3        |
| 4        | 5        | 6        |

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| 1        | 2        | 3        |
| 4        | 5        | 6        |

:::
```

**Output:**

::: flex around center

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| 1        | 2        | 3        |
| 4        | 5        | 6        |

| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| 1        | 2        | 3        |
| 4        | 5        | 6        |

:::
