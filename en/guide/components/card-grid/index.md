---
url: /en/guide/components/card-grid/index.md
---
## Overview

The `<CardGrid>` component is used when multiple cards need to be arranged. Cards are automatically arranged when sufficient space is available.

## Props

:::: field-group
::: field name="cols" type="number | { sm: number, md: number, lg: number }" default="2"

Number of columns for card arrangement.

The component automatically adjusts the number of columns based on screen width by default.
Two columns are displayed when space permits, while a single column is shown on smaller screens.

The `cols` prop configures the number of columns. When a `number` is provided,
all screen sizes display `number` columns. When `{ sm: number, md: number, lg: number }` is provided,
the number of columns adjusts automatically based on screen width.

* `sm` : `< 768px`
* `md` : `>= 768px < 960px`
* `lg` : `>= 960px`

It is recommended that the provided `number` does not exceed `3`.

:::
::::

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
