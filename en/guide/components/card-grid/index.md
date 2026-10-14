---
url: /en/guide/components/card-grid/index.md
---
## Overview

The `<CardGrid>` component is used when multiple cards need to be arranged. Cards are automatically arranged when sufficient space is available.

## Props

:::: field-group
::: field cols
@type `string | number | { sm?: number, md?: number, lg?: number }`
@default `{ sm: 1, md: 2, lg: 2 }`
Number of columns for card arrangement.

The component automatically adjusts the number of columns based on screen width by default.
Two columns are displayed when space permits, while a single column is shown on smaller screens.

The `cols` prop configures the number of columns. When a `number` (or a `string` convertible
via `Number()`) is provided, all screen sizes display that many columns.
When `{ sm: number, md: number, lg: number }` is provided, the number of columns adjusts
automatically based on screen width; omitted keys fall back to the defaults.

* `sm` : `< 768px`
* `md` : `>= 768px < 960px`
* `lg` : `>= 960px`

It is recommended that the provided `number` does not exceed `3`.
:::
::::

## Slots

### `default`

The card grid receives its child cards through the `default` slot. Children are distributed evenly
across the number of columns given by `cols`:

```vue
<CardGrid :cols="3">
  <Card title="Card 1" />
  <Card title="Card 2" />
  <Card title="Card 3" />
</CardGrid>
```

::: tip
The column count is decided by `cols` — **no manual wrapping or column splitting is needed**. Extra
items wrap automatically, and the count is recomputed on responsive changes.
:::

In Markdown, the [card container](../markdown/v-card.md) syntax `:::: card-grid` can be used instead.

## Examples

**Input:**

```md :no-line-numbers
<CardGrid>
  <Card title="Card Title" icon="twemoji:astonished-face">
    This is the card content.
  </Card>
  <Card title="Card Title" icon="twemoji:astonished-face">
    This is the card content.
  </Card>
</CardGrid>

<CardGrid>
  <LinkCard title="Card Title" href="/" />
  <LinkCard icon="twemoji:astonished-face" title="Card Title" href="/" />
</CardGrid>
```

**Output:**
