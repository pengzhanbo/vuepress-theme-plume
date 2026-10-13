---
title: Flex 容器
icon: material-symbols-light:flex-no-wrap
createTime: 2025/05/16 17:56:39
permalink: /guide/markdown/flex/
---

## 概述

Flex 弹性容器 `::: flex` 提供一种便捷的方式，在 markdown 中对块级内容应用 Flex 布局。

## 语法

```md
::: flex [center|between|around] [start|center|end] [gap="20"] [column]

<!--块级内容 1 -->

<!--块级内容 2 -->

:::
```

## Props

:::: field-group
::: field center / between / around
@type `boolean`
主轴方向上的对齐方式，裸写其一即可
:::
::: field start / center / end
@type `boolean`
交叉轴方向上的对齐方式，裸写其一即可
:::
::: field gap
@type `number | string`
@default `16`
间距
:::
::: field column
@type `boolean`
指定主轴方向为垂直方向
:::
::: field wrap
@type `boolean`
允许子元素换行（`flex-wrap: wrap`）
:::
::::

## 示例

### 表格居中对齐

**输入：**

```md
::: flex center

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 1    | 2    | 3    |
| 4    | 5    | 6    |

:::
```

**输出：**

::: flex center

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 1    | 2    | 3    |
| 4    | 5    | 6    |

:::

### 两个表格左右对齐

**输入：**

```md
::: flex between center

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 1    | 2    | 3    |
| 4    | 5    | 6    |

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 1    | 2    | 3    |
| 4    | 5    | 6    |

:::
```

**输出：**

::: flex between center

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 1    | 2    | 3    |
| 4    | 5    | 6    |

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 1    | 2    | 3    |
| 4    | 5    | 6    |

:::

### 平均排列两个表格

**输入：**

```md
::: flex around center

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 1    | 2    | 3    |
| 4    | 5    | 6    |

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 1    | 2    | 3    |
| 4    | 5    | 6    |

:::
```

**输出：**

::: flex around center

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 1    | 2    | 3    |
| 4    | 5    | 6    |

| 列 1 | 列 2 | 列 3 |
| ---- | ---- | ---- |
| 1    | 2    | 3    |
| 4    | 5    | 6    |

:::
