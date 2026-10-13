---
title: 友情链接页
icon: carbon:friendship
createTime: 2024/03/03 22:44:28
permalink: /guide/friend-links/
---

## 友情链接

友情链接功能允许您在博客中展示其他站点或博主的链接，便于读者发现更多优质内容。支持通过 frontmatter 配置友链页面的展示样式和链接列表。

友情链接页不会自动生成，但你可以根据需要，创建它。

在你的 `{sourceDir}/` 目录下，创建任意 `*.md` 文件，比如 `friends.md` 文件。
然后在这个文件中，通过 `frontmatter` 配置它。

```md title="friends.md"
---
pageLayout: friends
title: 友情链接
description: 友情链接描述文本
permalink: /friends/
contentPosition: after
cols: 2
list:
  -
    name: pengzhanbo
    link: https://github.com/pengzhanbo
    avatar: https://github.com/pengzhanbo.png
    desc: 即使慢，驰而不息，纵会落后，纵会失败，但必须能够到达他所向的目标。
  -
    name: pengzhanbo
    link: https://github.com/pengzhanbo
    avatar: https://github.com/pengzhanbo.png
    desc: 即使慢，驰而不息，纵会落后，纵会失败，但必须能够到达他所向的目标。
---

自定义内容 <!-- markdown 内容 会插入到 友情链接页中 -->
```

主题会根据配置信息生成友情链接页。

::: warning `friends: true` 已废弃
旧写法 `friends: true` 已废弃，请使用 `pageLayout: friends` 代替。
:::

你需要自行将友情链接页的入口链接配置到 `navbar` 的合适的位置中。

### 配置

查看 [文档](../../config/frontmatter/friend.md) 更多配置信息。

::: tip 完整字段说明
`list` 支持的字段包括 `name`、`link`、`avatar`、`desc`、`location`、`organization`、`socials`、
`backgroundColor`、`color`、`nameColor`；此外还支持 `groups` 分组，以及 `cols`、`contentPosition`
等布局选项，详见 [友情链接 frontmatter 配置](../../config/frontmatter/friend.md)。
:::
