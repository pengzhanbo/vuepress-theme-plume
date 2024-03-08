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

- 类型： `boolean \| number`
- 默认值： `false`

是否在文章列表中，置顶当前文章。

如果为 `number` ，则数字越大，文章置顶的位置越靠前。

### article

- 类型： `boolean`
- 默认值： `true`

是否在文章列表中，显示当前文章。

### tags

- 类型： `string[]`
- 默认值： `[]`

文章标签。
