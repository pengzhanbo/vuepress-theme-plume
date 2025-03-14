---
title: 卡片
createTime: 2024/09/30 14:37:40
icon: solar:card-broken
permalink: /guide/markdown/card/
---

## 概述

对于想要突出显示的内容，可以将其放在 卡片容器 `::: card` 中。

当需要在空间足够时并排显示多个卡片，可以使用 `card-grid` 容器，包裹 多个卡片。

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

卡片 支持 可选的 `title` 和 `icon`。 其中， icon 支持传入 图片链接，也可以传入 iconify 图标名。

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
如果你更喜欢通过组件的方式使用 卡片，你可以查看 [卡片组件](/guide/features/component/#card) 。
:::
