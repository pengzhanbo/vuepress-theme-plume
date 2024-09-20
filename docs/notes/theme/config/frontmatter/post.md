---
title: 博客文章
author: pengzhanbo
createTime: 2024/03/03 11:01:03
permalink: /config/frontmatter/article/
---

## 概述

适用于 博客类型的文章。

示例：

```md
---
title: 文章标题
tags:
  - tag1
  - tag2
---
```

## 配置

### sticky

- 类型： `boolean | number`
- 默认值： `false`

是否在文章列表中，置顶当前文章。

如果为 `number` ，则数字越大，文章置顶的位置越靠前。

### article <Badge type="warning" text="弃用" />

- 类型： `boolean`
- 默认值： `true`

是否在文章列表中，显示当前文章。

由于该字段 表达的语义不明，已弃用，改为使用 `draft`

### draft

- 类型： `boolean`
- 默认值： `false`

标记文章是否为草稿。被标记为草稿的文章，不会出现在 博客文章列表页中。

### tags

- 类型： `string[]`
- 默认值： `[]`

文章标签。

### cover

- 类型： `string \| BlogPostCover`
- 默认值： `''`

文章封面图。 封面图仅显示在 文章列表页。

当传入为 `string` 时，表示 封面图链接地址。仅支持 绝对路径 以及 远程图片地址。

当传入为 `BlogPostCover` 时，表示 封面图配置。

```ts
interface BlogPostCover {
  /**
   * 封面图链接地址，只能使用 绝对路径 以及 远程图片地址
   */
  url: string
  /**
   * 博客文章封面图的位置
   */
  layout?: 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
  /**
   * 博客文章封面图的比例
   *
   * @default '4:3'
   */
  ratio?: number | `${number}:${number}`

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
