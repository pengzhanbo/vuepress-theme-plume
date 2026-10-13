---
title: 卡片
icon: solar:card-broken
createTime: 2024/09/30 14:37:40
permalink: /guide/markdown/card/
---

## 概述

对于想要突出显示的内容，可以将其放在卡片容器 `::: card` 中。

当需要在空间足够时并排显示多个卡片，可以使用 `card-grid` 容器，包裹多个卡片。

::: tip 本页讲的是 **Markdown 容器语法**（`::: card`）。若你想在 Vue 组件中以渲染函数方式使用卡片，请见 [卡片组件](../components/v-card.md)。
:::

## 语法

```md
<!-- 单个卡片 -->
::: card title="标题" icon="twemoji:astonished-face"

这里是卡片内容。
:::

<!-- 多个卡片 -->
:::: card-grid

::: card title="卡片标题 1" icon="twemoji:astonished-face"

这里是卡片内容。
:::

::: card title="卡片标题 2" icon="twemoji:astonished-face"

这里是卡片内容。
:::

::::
```

## Props

:::: field-group
::: field title
@type `string`
@default `''`
卡片标题
:::

::: field icon
@type `string | { svg: string }`
@default `''`
卡片图标支持传入图片链接，还可以传入 [iconify](https://icon-sets.iconify.design/) 图标名。
:::
::::

## 示例

**输入：**

```md
::: card title="卡片标题" icon="twemoji:astonished-face"

这里是卡片内容。
:::
```

**输出：**

::: card title="卡片标题" icon="twemoji:astonished-face"

这里是卡片内容。
:::

**输入：**

```md
:::: card-grid
::: card title="卡片标题 1" icon="twemoji:astonished-face"

这里是卡片内容。
:::

::: card title="卡片标题 2" icon="twemoji:astonished-face"

这里是卡片内容。
:::
::::
```

**输出：**

:::: card-grid
::: card title="卡片标题 1" icon="twemoji:astonished-face"

这里是卡片内容。
:::

::: card title="卡片标题 2" icon="twemoji:astonished-face"

这里是卡片内容。
:::
::::

::: info
如果你更喜欢通过组件的方式使用卡片，你可以查看 [卡片组件](../components/v-card.md) 。
:::
