# Card

Create highlighted content cards using `::: card`. Wrap multiple cards in `:::: card-grid` for layout.

## Syntax

```md
::: card title="Title" icon="icon-name"
Content
:::
```

## Props

- `title`: String, card title.
- `icon`: String, iconify name or image URL.

## Example

```md
:::: card-grid
::: card title="Feature A" icon="mdi:star"
Description of feature A.
:::

::: card title="Feature B" icon="mdi:check"
Description of feature B.
:::
::::
```
