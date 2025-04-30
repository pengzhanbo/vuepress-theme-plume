---
title: 图标
icon: grommet-icons:emoji
createTime: 2024/08/18 22:58:39
permalink: /guide/components/icon/
---

## 概述

支持 iconify 所有图标，通过 icon name 加载图标。

可在 [iconify search](https://icon-sets.iconify.design/) 搜索图标使用。

## Props

:::: field-group

::: field name="name" type="string" default="''" optional
图标名称
:::

::: field name="color" type="string" default="'currentcolor'" optional
图标颜色
:::

::: field name="size" type="string" default="'1em'" optional
图标大小
:::

::::

## 示例

**输入：**

```md :no-line-numbers
- home - <Icon name="material-symbols:home" color="currentColor" size="1em" />
- vscode - <Icon name="skill-icons:vscode-dark" size="2em" />
- twitter - <Icon name="skill-icons:twitter" size="2em" />
```

**输出：**

- home - <Icon name="material-symbols:home" color="currentColor" size="1em" />
- vscode - <Icon name="skill-icons:vscode-dark" size="2em" />
- twitter - <Icon name="skill-icons:twitter" size="2em" />
