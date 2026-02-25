---
url: /guide/markdown/table/index.md
---
## 概述

markdown 默认的表格功能相对比较简单，但在实际使用场景中，常常需要在表格中添加一些额外的信息，比如表格的标题；
或者额外的功能，如复制表格的内容等。

在不破坏表格语法的前提下，主题提供了 `::: table` 容器，可以方便的对表格进行扩展。

::: tip 表格增强容器在持续开发中，如果有其他的功能建议请在 [Issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues) 中反馈。
:::

## 配置

该功能默认不启用，您需要在 `theme` 配置中启用它。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      // table: true, // 启用默认功能
      table: {
        // 表格默认对齐方式 'left' | 'center' | 'right'
        align: 'left',
        // 表格宽度是否为最大内容宽度
        // 行内元素不再自动换行，超出容器宽度时表格显示滚动条
        maxContent: false,
        // 表格宽度默认占据整行
        fullWidth: false,
        /**
         * 复制为 html/markdown
         * true 相当于 `all`，相当于同时启用 html 和 markdown
         */
        copy: true, // true | 'all' | 'html' | 'md'
      }
    },
  })
})
```

## 语法

直接将 表格 包裹在 `:::table` 中即可。

```md
:::table title="标题" align="center" max-content copy="all"
| xx | xx | xx |
| -- | -- | -- |
| xx | xx | xx |
:::
```

### Props

:::: field-group

::: field name="title" type="string" optional
表格标题，显示在表格的下方
:::

::: field name="align" type="'left' | 'center' | 'right'" optional default="'left'"
表格对齐方式
:::

::: field name="copy" type="boolean | 'all' | 'html' | 'md'" optional default="true"
在表格的右上角显示复制按钮，可以复制为 html / markdown

* `true` 等同于 `all`
* `false` 不显示复制按钮
* `all` 同时启用 `html` 和 `md`
* `html` 启用复制为 html
* `md` 启用复制为 markdown
  :::

::: field name="maxContent" type="boolean" optional default="false"
行内元素不再自动换行，超出容器宽度时表格显示滚动条
:::

::: field name="fullWidth" type="boolean" optional default="false"
表格宽度默认占据整行
:::

::: field name="hl-rows" type="string" optional
配置表格中的行高亮。

值使用 `type:row1,row2` 的格式，可以使用 `;` 组合多个 type row。

示例：

* `hl-rows="warning:1"`: 将第一行设置为 warning 颜色
* `hl-rows="danger:1,2"`: 将第一行和第二行设置为 danger 颜色
* `hl-rows="warning:1,2;danger:3,4"`: 将第一行和第二行设置为 warning 颜色，第三行和第四行设置为 danger 颜色

`type` 内置支持：`tip/note/info/success/warning/danger/caution/important`。

`row` 从 1 开始计数。
:::

::: field name="hl-cols" type="string" optional
配置表格中的列高亮。

值使用 `type:col1,col2` 的格式，可以使用 `;` 组合多个 type col。

示例：

* `hl-cols="warning:1"`: 将第一列设置为 warning 颜色
* `hl-cols="danger:1,2"`: 将第一列和第二列设置为 danger 颜色
* `hl-cols="warning:1,2;danger:3,4"`: 将第一列和第二列设置为 warning 颜色，第三列和第四列设置为 danger 颜色

`type` 内置支持：`tip/note/info/success/warning/danger/caution/important`。

`col` 从 1 开始计数。
:::

::: field name="hl-cells" type="string" optional
配置表格中的单元格高亮。

值使用 `type:(row,col)` 的格式，可以使用 `;` 组合多个 type cell。

示例：

* `hl-cells="warning:(1,1)"`: 将第一行第一列设置为 warning 颜色
* `hl-cells="danger:(1,1)(2,2)"`: 将第一行第一列，第二行第二列设置为 danger 颜色
* `hl-cells="warning:(1,1)(2,2);danger:(3,3)(4,4)"`: 将第一行第一列，第二行第二列设置为 warning 颜色，第三行第三列，第四行第四列设置为 danger 颜色

`type` 内置支持：`tip/note/info/success/warning/danger/caution/important`。

`row` 从 1 开始计数，`col` 从 1 开始计数。

:::
::::

## 示例

### 表格标题

**输入：**

```md
::: table title="这是表格标题"
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |
:::
```

**输出：**

::: table title="这是表格标题"

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |

:::

### 表格对齐

**输入：**

```md
::: table title="这是表格标题" align="center"
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |
:::
```

**输出：**

::: table title="这是表格标题" align="center"

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |

:::

### 表格内容宽度

**输入：**

```md
:::table title="这是表格标题" max-content

| ID | Description                                                                 | Status       |
|----|-----------------------------------------------------------------------------|--------------|
| 1  | This is an extremely long description that should trigger text wrapping in most table implementations. | In Progress  |
| 2  | Short text                                                                  | ✅ Completed |
:::
```

**输出：**

:::table title="这是表格标题" max-content

| ID | Description                                                                 | Status       |
|----|-----------------------------------------------------------------------------|--------------|
| 1  | This is an extremely long description that should trigger text wrapping in most table implementations. | In Progress  |
| 2  | Short text                                                                  | ✅ Completed |

:::

**输入：**

```md
::: table full-width
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |
:::
```

**输出：**

::: table full-width

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Row 2    | Data     | Info     |

:::

### 表格行高亮

**输入：**

```md
::: table title="这是表格标题" hl-rows="tip:1;warning:2;important:3,4"
| row1 | row1 | row1 |
| ---- | ---- | ---- |
| row2 | row2 | row2 |
| row3 | row3 | row3 |
| row4 | row4 | row4 |
:::
```

**输出：**

::: table title="这是表格标题" hl-rows="tip:1;warning:2;important:3,4"

| row1 | row1 | row1 |
| ---- | ---- | ---- |
| row2 | row2 | row2 |
| row3 | row3 | row3 |
| row4 | row4 | row4 |

:::

### 表格列高亮

**输入：**

```md
::: table title="这是表格标题" hl-cols="success:1;warning:2;danger:3,4"
| col1 | col2 | col3 | col4 |
| ---- | ---- | ---- | ---- |
| col1 | col2 | col3 | col4 |
| col1 | col2 | col3 | col4 |
| col1 | col2 | col3 | col4 |
:::
```

**输出：**

::: table title="这是表格标题" hl-cols="success:1;warning:2;danger:3,4"

| col1 | col2 | col3 | col4 |
| ---- | ---- | ---- | ---- |
| col1 | col2 | col3 | col4 |
| col1 | col2 | col3 | col4 |
| col1 | col2 | col3 | col4 |

:::

### 表格单元格高亮

#### 方式一

在表格容器上使用 `hl-cells="type:(row,col)"` 的格式，可以使用 `;` 组合多个 type cell。

**输入：**

```md
::: table title="这是表格标题" hl-cells="danger:(1,1)(2,2);success:(3,3)(4,4);warning:(1,4)(2,3);important:(3,2)(4,1)"
| (1,1) | (1,2) | (1,3) | (1,4) |
| ----- | ----- | ----- | ----- |
| (2,1) | (2,2) | (2,3) | (2,4) |
| (3,1) | (3,2) | (3,3) | (3,4) |
| (4,1) | (4,2) | (4,3) | (4,4) |
:::
```

**输出：**

::: table title="这是表格标题" hl-cells="danger:(1,1)(2,2);success:(3,3)(4,4);warning:(1,4)(2,3);important:(3,2)(4,1)"

| (1,1) | (1,2) | (1,3) | (1,4) |
| ----- | ----- | ----- | ----- |
| (2,1) | (2,2) | (2,3) | (2,4) |
| (3,1) | (3,2) | (3,3) | (3,4) |
| (4,1) | (4,2) | (4,3) | (4,4) |

:::

#### 方式二

使用 [属性支持](./attrs.md) 语法

**输入：**

```md
::: table title="这是表格标题"
| (1,1) {.danger}    | (1,2)              | (1,3)            | (1,4)  {.warning} |
| ------------------ | ------------------ | ---------------- | ----------------- |
| (2,1)              | (2,2) {.danger}    | (2,3) {.warning} | (2,4)             |
| (3,1)              | (3,2) {.important} | (3,3) {.danger}  | (3,4)             |
| (4,1) {.important} | (4,2)              | (4,3)            | (4,4) {.danger}   |
:::
```

**输出：**

::: table title="这是表格标题"

| (1,1) {.danger}    | (1,2)              | (1,3)            | (1,4)  {.warning} |
| ------------------ | ------------------ | ---------------- | ----------------- |
| (2,1)              | (2,2) {.danger}    | (2,3) {.warning} | (2,4)             |
| (3,1)              | (3,2) {.important} | (3,3) {.danger}  | (3,4)             |
| (4,1) {.important} | (4,2)              | (4,3)            | (4,4) {.danger}   |

:::

## 自定义高亮类型

在 [自定义 CSS 样式](../custom/style.md) 中，通过以下格式可以自定义高亮类型：

```css
.vp-table table th.type,
.vp-table table td.type {
  color: #000;
  background-color: #fff;
}
```

比如，添加一个 `blue` 的高亮类型:

```css
.vp-table table th.blue,
.vp-table table td.blue {
  color: #4a7cb9;
  background-color: #a3c6e5;
}
```

然后就可以在表格中使用：

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

## 表格单元格合并

表格单元格合并由 [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs) 属性支持语法提供实现。
因此它不需要在 `:::table` 容器中使用，你可以在何人表格中使用它。

在表格单元格内，末尾部分使用 属性支持语法 `{}` 中，添加 `rowspan=rows` 或者 `{colspan=cols}` ，或组合使用，
即可实现表格单元格合并。

**输入：**

```md
| A                       | B   | C   | D                |
| ----------------------- | --- | --- | ---------------- |
| 1                       | 11  | 111 | 1111 {rowspan=3} |
| 2 {colspan=2 rowspan=2} | 22  | 222 | 2222             |
| 3                       | 33  | 333 | 3333             |
```

**输出：**

| A                       | B   | C   | D                |
| ----------------------- | --- | --- | ---------------- |
| 1                       | 11  | 111 | 1111 {rowspan=3} |
| 2 {colspan=2 rowspan=2} | 22  | 222 | 2222             |
| 3                       | 33  | 333 | 3333             |
