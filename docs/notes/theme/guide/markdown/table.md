---
title: table 增强
icon: mdi:table-plus
createTime: 2025/07/25 16:57:42
permalink: /guide/markdown/table/
badge: 新
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

- `true` 等同于 `all`
- `false` 不显示复制按钮
- `all` 同时启用 `html` 和 `md`
- `html` 启用复制为 html
- `md` 启用复制为 markdown
:::

::: field name="maxContent" type="boolean" optional default="false"
行内元素不再自动换行，超出容器宽度时表格显示滚动条
:::
::::

## 示例

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
