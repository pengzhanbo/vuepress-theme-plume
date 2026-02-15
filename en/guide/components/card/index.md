---
url: /en/guide/components/card/index.md
---
## Overview

Use the `<Card>` component to display cards within a page.

Alternatively, the markdown [card container](../markdown/card.md) syntax can be used as a substitute for the `<Card>` component.

## Props

:::: field-group

::: field name="title" type="string" default="''" optional
Card title.
:::

::: field name="icon" type="string | { svg: string }" default="''" optional
Icon displayed to the left of the title. Supports all icons from iconify, or an image URL can be used.
:::

::::

## Slots

| Name    | Description          |
| ------- | -------------------- |
| default | Card content.        |
| title   | Custom title content.|

## Examples

**Input:**

```md :no-line-numbers
<Card title="Card Title" icon="twemoji:astonished-face">
  This is the card content.
</Card>

<Card>
  <template #title>
    <p style="color: red">Card Title</p>
  </template>
  This is the card content.
</Card>
```

**Output:**

:::info
Markdown syntax can also be used inside slots. However,
please note that an empty line is required between the markdown syntax and the tags. Otherwise, it will be interpreted as plain text.
:::
