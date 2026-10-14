---
url: /en/guide/markdown/attrs/index.md
---
## Overview

Add classes, identifiers, and attributes to your Markdown.

**This feature is enabled by default.**

## Syntax

Use `{ }` after Markdown tokens to add class names, identifiers, or attributes.

```md
markdown content{.classname #id attr1=value attr2="value with spaces"}
```

### `.classname`

Start with `.` to add a class.

**Input:**

```md
__bold__{.bolder}
```

**Output:**

```html
<strong class="bolder">bold</strong>
```

### `#id`

Start with `#` to add an ID.

**Input:**

```md
## Heading{#header-1}
```

**Output:**

```html
<h2 id="header-1">Heading</h2>
```

:::tip This is commonly used for customizing anchor links for headings.
:::

### `attr=value`

**Input:**

```md
[link](https://example.com){target=_blank}
[link](https://example.com){rel="noopener noreferrer"}
```

**Output:**

```html
<a href="https://example.com" target="_blank">link</a>
<a href="https://example.com" rel="noopener noreferrer">link</a>
```

### Combined Usage

**Input:**

```md
[link](https://example.com){.link #linkId target=_blank rel="noopener noreferrer"}
```

**Output:**

```html
<a href="https://example.com" class="link" id="linkId" target="_blank" rel="noopener noreferrer">link</a>
```

### On Block-Level Tokens

Add attributes on the next line after block-level tokens.

For example, using with an unordered list:

**Input:**

```md
- list item **bold**
{.red}
```

**Output:**

```html
<ul class="red">
  <li class="red">list item <strong>bold</strong></li>
</ul>
```

For example, using with a table:

**Input:**

```md
| header1 | header2 |
| ------- | ------- |
| column1 | column2 |

{.special}  <!-- Note: an empty line is required before this -->
```

**Output:**

```html
<table class="special">
  <thead>
    <tr>
      <th>header1</th>
      <th>header2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>column1</td>
      <td>column2</td>
    </tr>
  </tbody>
</table>
```

Table cells can also use attributes, commonly for cell merging:

**Input:**

```md
| A                       | B   | C   | D                |
| ----------------------- | --- | --- | ---------------- |
| 1                       | 11  | 111 | 1111 {rowspan=3} |
| 2 {colspan=2 rowspan=2} | 22  | 222 | 2222             |
| 3                       | 33  | 333 | 3333             |
```

**Output:**

```html
<table border="1">
  <thead>
    <tr>
      <th>A</th>
      <th>B</th>
      <th>C</th>
      <th>D</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>11</td>
      <td>111</td>
      <td rowspan="3">1111</td>
    </tr>
    <tr>
      <td colspan="2" rowspan="2">2</td>
      <td>22</td>
    </tr>
    <tr>
      <td>3</td>
    </tr>
  </tbody>
</table>
```

**Result:**

| A                       | B   | C   | D                |
| ----------------------- | --- | --- | ---------------- |
| 1                       | 11  | 111 | 1111 {rowspan=3} |
| 2 {colspan=2 rowspan=2} | 22  | 222 | 2222             |
| 3                       | 33  | 333 | 3333             |
