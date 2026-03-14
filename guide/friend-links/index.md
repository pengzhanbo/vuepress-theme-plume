---
url: /guide/friend-links/index.md
---
## 友情链接

友情链接页 不会自动生成，但你可以根据需要，创建它。

在你的 `{sourceDir}/` 目录下，创建 任意 `*.md` 文件，比如 `friends.md` 文件。
然后在这个文件中，通过 `frontmatter` 配置它。

```md title="friends.md"
---
friends: true
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

主题会根据 配置信息 生成友情链接页。

你需要自行将 友情链接页 的入口链接 配置到 `navbar` 的合适的位置中。

### 配置

查看 [文档](../../config/frontmatter/friend.md) 更多配置信息。
