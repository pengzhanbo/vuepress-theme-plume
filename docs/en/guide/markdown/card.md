---
title: Card
createTime: 2025/03/24 19:46:13
icon: solar:card-broken
permalink: /en/guide/markdown/card/
---

## Overview

To highlight content, place it in a card container `::: card`.

To display multiple cards side by side when space allows, use the `card-grid` container around multiple cards.

## Syntax

```md
<!-- Single card -->
::: card title="Title" icon="twemoji:astonished-face"

This is the card content.
:::

<!-- Multiple cards -->
:::: card-grid

::: card title="Card Title 1" icon="twemoji:astonished-face"

This is the card content.
:::

::: card title="Card Title 2" icon="twemoji:astonished-face"

This is the card content.
:::

::::
```

Cards support optional `title` and `icon`. The icon can be an image URL or an Iconify icon name.

## Example

**Input:**

```md
::: card title="Card Title" icon="twemoji:astonished-face"

This is the card content.
:::
```

**Output:**

::: card title="Card Title" icon="twemoji:astonished-face"

This is the card content.
:::

**Input:**

```md
:::: card-grid
::: card title="Card Title 1" icon="twemoji:astonished-face"

This is the card content.
:::

::: card title="Card Title 2" icon="twemoji:astonished-face"

This is the card content.
:::
::::
```

**Output:**

:::: card-grid
::: card title="Card Title 1" icon="twemoji:astonished-face"

This is the card content.
:::

::: card title="Card Title 2" icon="twemoji:astonished-face"

This is the card content.
:::
::::

::: info
If you prefer to use cards via components, you can check out the [Card Component](/en/guide/features/component/#card).
:::
