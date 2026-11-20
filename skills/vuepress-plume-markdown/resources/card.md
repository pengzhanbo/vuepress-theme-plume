# Card / Card Grid

Available by default. `::: card` for a single card, `:::: card-grid` to lay several out.

```md
:::: card-grid
::: card title="特性 A" icon="mdi:star"
描述 A
:::

::: card title="特性 B" icon="mdi:check"
描述 B
:::
::::
```

| Prop | Type | Default |
| --- | --- | --- |
| `title` | `string` | `''` |
| `icon` | `string \| { svg: string }` | `''` (iconify name, SVG URL or inline SVG — not a plain image URL) |

- Body is full markdown; leave a blank line before it when the content starts with a heading or list.
- Grid columns are automatic; use the `<CardGrid>` component when you need explicit `cols`:

```md
<CardGrid :cols="{ sm: 1, lg: 3 }">
  <Card title="一">内容</Card>
</CardGrid>
```

- `::: card-masonry` lays images out by height: `::: card-masonry cols="3" gap="16"`.
- Component props: see `resources/components.md`.
