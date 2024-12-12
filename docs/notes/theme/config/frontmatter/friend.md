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
pageLayout: friends
title: 友情链接
list:
  -
    name: pengzhanbo
    link: https://github.com/pengzhanbo
    avatar: https://github.com/pengzhanbo.png
    location: 广州，中国
    organization: VuePress
    desc: 即使慢，驰而不息，纵会落后，纵会失败，但必须能够到达他所向的目标。
    socials:
      -
        icon: github
        link: https://github.com/pengzhanbo
      -
        icon: twitter
        link: https://twitter.com/pengzhanbo
---
```

## 配置

### friends <Badge type="warning" text="弃用" />

- 类型： `boolean`
- 默认值： `false`
- 详情：

  当前页面是否为友情链接页。

### pageLayout

- 类型：`'friends'`
- 详情：

  声明当前页面为 友情链接页。

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
  /**
   * 地理位置
   */
  location?: string
  /**
   * 组织、公司
   */
  organization?: string

  /**
   * 社交链接
   */
  socials?: SocialLink[]

  /**
   * 背景色
   */
  backgroundColor?: string | { light: string, dark: string }
  /**
   * 字体颜色
   */
  color?: string | { light: string, dark: string }
  /**
   * 名字颜色
   */
  nameColor?: string | { light: string, dark: string }
}
```

社交链接配置请查看 [配置/主题配置/社交链接](../../config/主题配置.md#social)。

### groups

- 类型： `FriendsGroup[]`
- 默认值: `[]`

友情链接分组

```ts
interface FriendsGroup {
  /**
   * 分组名
   */
  title?: string
  /**
   * 分组描述
   */
  desc?: string
  /**
   * 友情链接列表
   */
  list?: FriendsItem[]
}
```
