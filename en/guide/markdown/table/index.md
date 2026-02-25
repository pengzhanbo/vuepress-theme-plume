---
url: /en/guide/markdown/table/index.md
---
## Overview

The default table functionality in Markdown is relatively basic.
However, in practical usage scenarios, it is often necessary to add additional information to tables,
such as a table title, or extra features like the ability to copy table content.

Without breaking the table syntax, the theme provides a `::: table` container to conveniently extend table capabilities.

::: tip The table enhancement container is under continuous development.
If you have suggestions for other features, please provide feedback via an [Issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues).
:::

## Configuration

This feature is disabled by default. You need to enable it in your `theme` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      // table: true, // Enable default features
      table: {
        // Default table alignment: 'left' | 'center' | 'right'
        align: 'left',
        // Whether the table width is the max-content width
        // Inline elements will not wrap automatically; a scrollbar is displayed when the content exceeds the container width.
        maxContent: false,
        // The table width defaults to occupying the entire row.
        fullWidth: false,
        /**
         * Copy as HTML/Markdown
         * `true` is equivalent to `'all'`, enabling both HTML and Markdown copying.
         */
        copy: true, // true | 'all' | 'html' | 'md'
      }
    },
  })
})
```

## Syntax

Simply wrap the table within a `:::table` block.

```md
:::table title="Title" align="center" max-content copy="all"
| xx | xx | xx |
| -- | -- | -- |
| xx | xx | xx |
:::
```

### Props

:::: field-group

::: field name="title" type="string" optional
Table title, displayed below the table.
:::

::: field name="align" type="'left' | 'center' | 'right'" optional default="'left'"
Table alignment.
:::

::: field name="copy" type="boolean | 'all' | 'html' | 'md'" optional default="true"
Displays a copy button in the top-right corner of the table for copying as HTML or Markdown.

* `true` is equivalent to `'all'`.
* `false` hides the copy button.
* `'all'` enables both `'html'` and `'md'` copying.
* `'html'` enables copying as HTML.
* `'md'` enables copying as Markdown.
  :::

::: field name="maxContent" type="boolean" optional default="false"
Inline elements will not wrap automatically; a scrollbar is displayed when the content exceeds the container width.
:::

::: field name="fullWidth" type="boolean" optional default="false"
The table width defaults to occupying the entire row.
:::

::: field name="hl-rows" type="string" optional
Configures row highlighting within the table.

The value uses the format `type:row1,row2`. Multiple type-row pairs can be combined using `;`.

Examples:

* `hl-rows="warning:1"`: Sets the first row to the warning color.
* `hl-rows="danger:1,2"`: Sets the first and second rows to the danger color.
* `hl-rows="warning:1,2;danger:3,4"`: Sets the first and second rows to the warning color, and the third and fourth rows to the danger color.

Built-in `type` support: `tip`, `note`, `info`, `success`, `warning`, `danger`, `caution`, `important`.

`row` counting starts from 1.
:::

::: field name="hl-cols" type="string" optional
Configures column highlighting within the table.

The value uses the format `type:col1,col2`. Multiple type-column pairs can be combined using `;`.

Examples:

* `hl-cols="warning:1"`: Sets the first column to the warning color.
* `hl-cols="danger:1,2"`: Sets the first and second columns to the danger color.
* `hl-cols="warning:1,2;danger:3,4"`: Sets the first and second columns to the warning color,
  and the third and fourth columns to the danger color.

Built-in `type` support: `tip`, `note`, `info`, `success`, `warning`, `danger`, `caution`, `important`.

`col` counting starts from 1.
:::

::: field name="hl-cells" type="string" optional
Configures cell highlighting within the table.

The value uses the format `type:(row,col)`. Multiple type-cell pairs can be combined using `;`.

Examples:

* `hl-cells="warning:(1,1)"`: Sets the cell at row 1, column 1 to the warning color.
* `hl-cells="danger:(1,1)(2,2)"`: Sets the cells at (1,1) and (2,2) to the danger color.
* `hl-cells="warning:(1,1)(2,2);danger:(3,3)(4,4)"`: Sets the cells at (1,1) and (2,2) to the warning color,
  and the cells at (3,3) and (4,4) to the danger color.

Built-in `type` support: `tip`, `note`, `info`, `success`, `warning`, `danger`, `caution`, `important`.

`row` counting starts from 1, `col` counting starts from 1.
:::
::::

## Examples

### Table Title

**Input:**

```md
::: table title="This is the Table Title"
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |
:::
```

**Output:**

::: table title="This is the Table Title"

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |

:::

### Table Alignment

**Input:**

```md
::: table title="This is the Table Title" align="center"
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |
:::
```

**Output:**

::: table title="This is the Table Title" align="center"

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |

:::

### Table Max Content Width

**Input:**

```md
:::table title="This is the Table Title" max-content

| ID | Description                                                                 | Status       |
|----|-----------------------------------------------------------------------------|--------------|
| 1  | This is an extremely long description that should trigger text wrapping in most table implementations. | In Progress  |
| 2  | Short text                                                                  | ✅ Completed |
:::
```

**Output:**

:::table title="This is the Table Title" max-content

| ID | Description                                                                 | Status       |
|----|-----------------------------------------------------------------------------|--------------|
| 1  | This is an extremely long description that should trigger text wrapping in most table implementations. | In Progress  |
| 2  | Short text                                                                  | ✅ Completed |

:::

**Input:**

```md
::: table full-width
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |
:::
```

**Output:**

::: table full-width

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |

:::

### Table Row Highlighting

**Input:**

```md
::: table title="This is the Table Title" hl-rows="tip:1;warning:2;important:3,4"
| row1 | row1 | row1 |
| ---- | ---- | ---- |
| row2 | row2 | row2 |
| row3 | row3 | row3 |
| row4 | row4 | row4 |
:::
```

**Output:**

::: table title="This is the Table Title" hl-rows="tip:1;warning:2;important:3,4"

| row1 | row1 | row1 |
| ---- | ---- | ---- |
| row2 | row2 | row2 |
| row3 | row3 | row3 |
| row4 | row4 | row4 |

:::

### Table Column Highlighting

**Input:**

```md
::: table title="This is the Table Title" hl-cols="success:1;warning:2;danger:3,4"
| col1 | col2 | col3 | col4 |
| ---- | ---- | ---- | ---- |
| col1 | col2 | col3 | col4 |
| col1 | col2 | col3 | col4 |
| col1 | col2 | col3 | col4 |
:::
```

**Output:**

::: table title="This is the Table Title" hl-cols="success:1;warning:2;danger:3,4"

| col1 | col2 | col3 | col4 |
| ---- | ---- | ---- | ---- |
| col1 | col2 | col3 | col4 |
| col1 | col2 | col3 | col4 |
| col1 | col2 | col3 | col4 |

:::

### Table Cell Highlighting

#### Method One

**Input:**

```md
::: table title="This is the Table Title" hl-cells="danger:(1,1)(2,2);success:(3,3)(4,4);warning:(1,4)(2,3);important:(3,2)(4,1)"
| (1,1) | (1,2) | (1,3) | (1,4) |
| ----- | ----- | ----- | ----- |
| (2,1) | (2,2) | (2,3) | (2,4) |
| (3,1) | (3,2) | (3,3) | (3,4) |
| (4,1) | (4,2) | (4,3) | (4,4) |
:::
```

**Output:**

::: table title="This is the Table Title" hl-cells="danger:(1,1)(2,2);success:(3,3)(4,4);warning:(1,4)(2,3);important:(3,2)(4,1)"

| (1,1) | (1,2) | (1,3) | (1,4) |
| ----- | ----- | ----- | ----- |
| (2,1) | (2,2) | (2,3) | (2,4) |
| (3,1) | (3,2) | (3,3) | (3,4) |
| (4,1) | (4,2) | (4,3) | (4,4) |

:::

#### Method Two

Using the [Attribute Support](./attrs.md) syntax

**Input:**

```md
::: table title="This is the Table Title"
| (1,1) {.danger}    | (1,2)              | (1,3)            | (1,4)  {.warning} |
| ------------------ | ------------------ | ---------------- | ----------------- |
| (2,1)              | (2,2) {.danger}    | (2,3) {.warning} | (2,4)             |
| (3,1)              | (3,2) {.important} | (3,3) {.danger}  | (3,4)             |
| (4,1) {.important} | (4,2)              | (4,3)            | (4,4) {.danger}   |
:::
```

**Output:**

::: table title="This is the Table Title"

| (1,1) {.danger}    | (1,2)              | (1,3)            | (1,4)  {.warning} |
| ------------------ | ------------------ | ---------------- | ----------------- |
| (2,1)              | (2,2) {.danger}    | (2,3) {.warning} | (2,4)             |
| (3,1)              | (3,2) {.important} | (3,3) {.danger}  | (3,4)             |
| (4,1) {.important} | (4,2)              | (4,3)            | (4,4) {.danger}   |

:::

## Custom Highlight Types

In [Custom CSS Styles](../custom/style.md), custom highlight types can be defined using the following format:

```css
.vp-table table th.type,
.vp-table table td.type {
  color: #000;
  background-color: #fff;
}
```

For example, to add a `blue` highlight type:

```css
.vp-table table th.blue,
.vp-table table td.blue {
  color: #4a7cb9;
  background-color: #a3c6e5;
}
```

This custom type can then be used in tables:

```md
::: table hl-rows="blue:1" hl-cols="blue:1" hl-cells="blue:(3,3)"
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
:::
```

::: table hl-rows="blue:1" hl-cols="blue:1" hl-cells="blue:(3,3)"

| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

:::

## Table Cell Merging

Table cell merging is implemented through the attribute syntax supported by [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs).
Therefore, it does not need to be used within the `:::table` container; you can use it in any table.

Inside a table cell, add `rowspan=rows` or `colspan=cols` (or a combination) using
the attribute syntax `{}` at the end of the cell content to achieve table cell merging.

**Input:**

```md
| A                       | B   | C   | D                |
| ----------------------- | --- | --- | ---------------- |
| 1                       | 11  | 111 | 1111 {rowspan=3} |
| 2 {colspan=2 rowspan=2} | 22  | 222 | 2222             |
| 3                       | 33  | 333 | 3333             |
```

**Output:**

| A                       | B   | C   | D                |
| ----------------------- | --- | --- | ---------------- |
| 1                       | 11  | 111 | 1111 {rowspan=3} |
| 2 {colspan=2 rowspan=2} | 22  | 222 | 2222             |
| 3                       | 33  | 333 | 3333             |
