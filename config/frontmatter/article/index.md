---
url: /config/frontmatter/article/index.md
---
## 概述

适用于集合类型为 post 的文章。

示例：

```md title="frontmatter"
---
title: 文章标题
tags:
  - tag1
  - tag2
---
```

## 配置

### sticky

* 类型： `boolean | number`
* 默认值： `false`

是否在文章列表中，置顶当前文章。

如果为 `number` ，则数字越大，文章置顶的位置越靠前；`true` 的优先级高于任何数字。
`0`、负数与 `false` 等价，均视为不置顶。

::: tip
置顶文章仅会 **在文章列表的第 1 页置顶**。从第 2 页起，文章按正常的时间顺序展示。
:::

### article

* 类型： `boolean`
* 默认值： `true`

是否在文章列表中显示当前文章。

### draft

* 类型： `boolean`
* 默认值： `false`

标记文章是否为草稿。被标记为草稿的文章，仅在 **开发环境时显示在文章列表中**，生产环境不会显示。

### tags

* 类型： `string[]`
* 默认值： `[]`

文章标签。

### cover

* 类型： `string`
* 默认值： `''`

文章封面图。 封面图仅显示在文章列表页。

仅支持绝对路径以及远程图片地址。

### coverStyle

* 类型： `PostsCoverStyle`
* 默认值： `undefined`

封面图配置。

```ts
type PostsCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'

interface PostsCoverStyle {
  /**
   * 博客文章封面图的位置
   */
  layout?: PostsCoverLayout
  /**
   * 博客文章封面图的比例
   *
   * @default '4:3'
   */
  ratio?: number | `${number}:${number}` | `${number}/${number}`

  /**
   * 封面图的宽度, 仅在 layout 为 'left' 或 'right' 时生效
   *
   * @default 240
   */
  width?: number
  /**
   * 是否使用紧凑模式，紧凑模式下，封面图紧贴容器边缘
   * @default false
   */
  compact?: boolean
}
```

### excerpt

* 类型： `boolean | string`
* 默认值： `undefined`

是否展示文章摘要。传入 `string` 时为自定义摘要，此时 `<!-- more -->` 注释无效。

::: tip 文章 frontmatter 的其它字段

* `createTime`：创建时间，见 [基础 frontmatter](./basic.md#createtime)
* `password` / `passwordHint`：文章加密，见 [加密](../../guide/features/encryption.md)
* `copyright`：版权信息，见 [版权](../../guide/features/copyright.md)
  :::
