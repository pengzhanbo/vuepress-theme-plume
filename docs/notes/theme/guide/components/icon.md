---
title: 图标
author: pengzhanbo
icon: grommet-icons:emoji
createTime: 2024/08/18 22:58:39
permalink: /guide/components/icon/
---

## 概述

支持 iconify 所有图标，通过 icon name 加载图标。

可在 [iconify search](https://icon-sets.iconify.design/) 搜索图标使用。

## Props

| 名称  | 类型   | 默认值           | 说明     |
| ----- | ------ | ---------------- | -------- |
| name  | string | `''`             | 图标名   |
| color | string | `'currentcolor'` | 图标颜色 |
| size  | string | `'1em'`          | 图标大小 |

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
