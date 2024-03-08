---
title: 友情链接页
author: pengzhanbo
createTime: 2024/03/03 18:00:52
permalink: /config/frontmatter/friends/
---

## 概述

适用于友情链接页。

示例：

```md
---
friends: true
title: 友情链接
list:
  -
    name: pengzhanbo
    link: https://github.com/pengzhanbo
    avatar: https://github.com/pengzhanbo.png
    desc: 即使慢，驰而不息，纵会落后，纵会失败，但必须能够到达他所向的目标。
---
```

## 配置

### friends

- 类型： `boolean`
- 默认值： `false`

当前页面是否为友情链接页。

### title

- 类型： `string`
- 默认值： `友情链接`

友情链接页的标题

### description

- 类型： `string`

友情链接页的描述

### list

- 类型： `FriendsItem[]`
- 默认值: `[]`

友情链接列表

```ts
interface FriendsItem {
  /**
   * 友情链接名
   */
  name: string
  /**
   * 友情链接
   */
  link: string
  /**
   * 友情链接头像
   */
  avatar?: string
  /**
   * 友情链接描述
   */
  desc?: string
}
```
