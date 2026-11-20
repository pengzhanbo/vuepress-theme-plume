# Table (enhanced)

Wrap a table in `:::table` to add a caption, copy button, alignment and cell/row/column highlighting.

## Enable

```ts
markdown: {
  table: true, // or
  table: { align: 'left', maxContent: false, fullWidth: false, copy: true },
}
```

## Props

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `title` | `string` | `''` | caption, rendered **below** the table |
| `align` | `'left' \| 'center' \| 'right'` | `left` | table alignment |
| `copy` | `boolean \| 'all' \| 'html' \| 'md'` | `true` | copy button (`true` ≡ `all`) |
| `max-content` | `boolean` | `false` | no wrapping; scroll horizontally instead |
| `full-width` | `boolean` | `false` | table fills the row |
| `hl-rows` | `string` | `''` | `type:row1,row2;type:row3` |
| `hl-cols` | `string` | `''` | `type:col1,col2` |
| `hl-cells` | `string` | `''` | `type:(row,col)(row,col)` |

`type` ∈ `tip / note / info / success / warning / danger / caution / important`. Rows and columns are **1-based**.

## Syntax

```md
:::table title="标题" align="center" max-content copy="all" hl-rows="warning:1"
| xx | xx | xx |
| --- | --- | --- |
| xx | xx | xx |
:::
```

Nested containers inside a table container (or when the table contains `:::`), use 4 colons:

````md
::::table title="API"
| Method | Endpoint |
| --- | --- |
| GET | /api/users |
::::
````

## Cell merge

Merging works without the container (attribute syntax on a cell):

```md
| 1 | 2 {colspan=2} | 3 |
| --- | --- | --- |
| 4 {rowspan=3} | 5 | 6 |
```

## Examples

```md
:::table title="对比" hl-cols="warning:2"
| 方案 | 体积 | 说明 |
| --- | --- | --- |
| A | 12kb | 轻量 |
| B | 48kb | 功能全 |
:::
```

```md
:::table hl-cells="danger:(2,2);success:(3,3)"
| | x | y |
| --- | --- | --- |
| a | 1 | 2 |
| b | 3 | 4 |
:::
```
