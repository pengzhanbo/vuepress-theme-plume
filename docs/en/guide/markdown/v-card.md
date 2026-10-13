---
title: Card
icon: solar:card-broken
createTime: 2025/10/08 14:37:40
permalink: /en/guide/markdown/card/
---

## Overview

Content that needs to be highlighted can be placed within a card container `::: card`.

When multiple cards need to be displayed side-by-side when space permits, use the `card-grid` container to wrap multiple cards.

::: tip This page covers the **Markdown container syntax** (`::: card`). If you want to use cards as render functions inside Vue components, see the [Card component](../components/v-card.md).
:::

## Syntax

```md
<!-- Single Card -->
::: card title="Title" icon="twemoji:astonished-face"

This is the card content.
:::

<!-- Multiple Cards -->
:::: card-grid

::: card title="Card Title 1" icon="twemoji:astonished-face"

This is the card content.
:::

::: card title="Card Title 2" icon="twemoji:astonished-face"

This is the card content.
:::

::::
```

## Props

:::: field-group
::: field title
@type `string`
@default `''`
Card title
:::

::: field icon
@type `string | { svg: string }`
@default `''`
Card icon. Supports image URLs and [iconify](https://icon-sets.iconify.design/) icon names.
:::
::::

## Examples

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
If you prefer using cards via components, you can check out the [Card Component](../components/v-card.md).
:::
