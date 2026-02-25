---
url: /guide/markdown/card/index.md
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

## Props

:::: field-group
::: field name="title" type="string" optional default="''"
卡片标题
:::

::: field name="icon" type="string" optional
卡片图标 支持传入图片链接，还可以传入 [iconify](https://icon-sets.iconify.design/) 图标名。
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
如果你更喜欢通过组件的方式使用 卡片，你可以查看 [卡片组件](/guide/features/component/#card) 。
:::
