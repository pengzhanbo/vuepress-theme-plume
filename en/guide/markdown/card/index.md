---
url: /en/guide/markdown/card/index.md
---
## Overview

Content that needs to be highlighted can be placed within a card container `::: card`.

When multiple cards need to be displayed side-by-side when space permits, use the `card-grid` container to wrap multiple cards.

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
::: field name="title" type="string" optional default="''"
Card title
:::

::: field name="icon" type="string" optional
Card icon. Supports image URLs and [iconify](https://icon-sets.iconify.design/) icon names.
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
If you prefer using cards via components, you can check out the [Card Component](/guide/features/component/#card).
:::
