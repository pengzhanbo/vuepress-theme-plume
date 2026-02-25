---
url: /en/guide/markdown/flex/index.md
---
## Overview

The Flex container `::: flex` provides a convenient way to apply Flexbox layout to block-level content in markdown.

## Usage

```md
::: flex [center|between|around] [start|center|end] [gap="20"] [column]

<!-- Block content 1 -->

<!-- Block content 2 -->

:::
```

## Attributes

* On the main axis, use `center` / `between` / `around` to specify alignment;
* On the cross axis, use `start` / `center` / `end` to specify alignment;
* Use `gap="20"` to specify spacing;
* Use `column` to set the main axis direction to vertical.

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
