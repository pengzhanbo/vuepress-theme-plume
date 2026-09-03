---
url: /guide/markdown/attrs/index.md
---
## 概述

为你的Markdown添加类、标识符和属性。

**此功能默认启用。**

## 语法

在 Markdown 的标记后使用 `{ }` 添加 类名、标识符 或 属性。

```md
markdown 语句{.classname #id attr1=value attr2="带空格的值"}
```

### `.classname`

以 `.` 作为起始，添加一个类型

**输入：**

```md
__加粗__{.bolder}
```

**输出：**

```html
<strong class="bolder">加粗</strong>
```

### `#id`

以 `#` 作为起始，添加一个 ID

**输入：**

```md
## 标题{#header-1}
```

**输出：**

```html
<h2 id="header-1">标题</h2>
```

:::tip 此技巧常用于自定义标题的锚点链接
:::

### `attr=value`

**输入：**

```md
[链接](https://example.com){target=_blank}
[链接](https://example.com){rel="noopener noreferrer"}
```

**输出：**

```html
<a href="https://example.com" target="_blank">链接</a>
<a href="https://example.com" rel="noopener noreferrer">链接</a>
```

### 组合使用

**输入：**

```md
[链接](https://example.com){.link #linkId target=_blank rel="noopener noreferrer"}
```

**输出：**

```html
<a href="https://example.com" class="link" id="linkId" target="_blank" rel="noopener noreferrer">链接</a>
```

### 在块级标记上

在块级标记的下一行添加属性。

比如在 无序列表 上使用

**输入：**

```md
- list item **bold**
{.red}
```

**输出：**

```html
<ul class="red">
  <li class="red">list item <strong>bold</strong></li>
</ul>
```

比如在 表格 上使用

**输入：**

```md
| header1 | header2 |
| ------- | ------- |
| column1 | column2 |

{.special}  <!-- 注意在这之前需要空一行 -->
```

**输出：**

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

表格中的单元格也可以使用，常见于 合并单元格：

**输入：**

```md
| A                       | B   | C   | D                |
| ----------------------- | --- | --- | ---------------- |
| 1                       | 11  | 111 | 1111 {rowspan=3} |
| 2 {colspan=2 rowspan=2} | 22  | 222 | 2222             |
| 3                       | 33  | 333 | 3333             |
```

**输出：**

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

**效果：**

| A                       | B   | C   | D                |
| ----------------------- | --- | --- | ---------------- |
| 1                       | 11  | 111 | 1111 {rowspan=3} |
| 2 {colspan=2 rowspan=2} | 22  | 222 | 2222             |
| 3                       | 33  | 333 | 3333             |
