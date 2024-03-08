---
title: 通用配置
author: pengzhanbo
createTime: 2024/03/02 20:01:09
permalink: /config/frontmatter/basic/
---

## 概述

通用 Frontmatter 配置，适用于 所有的文章。

示例：

```md
---
title: 标题
author: 作者
createTime: 2024/03/02 20:01:09
permalink: /config/frontmatter/basic/
---
```

## 配置

### title

文章标题。

主题会在文件创建时，自动填充 当前文件名作为 文章标题。

### author

文章作者。

主题会在文件创建时，自动填充 `avatar.name || packageJson.author` 作为 文章作者。

### createTime

文章创建时间。

主题会在文件创建时，自动填充 当前时间作为 文章创建时间。

### permalink

文章永久链接。

主题会在文件创建时:

- 博客类型的文章，自动填充 `/article/` + `nanoid 生成的 6 位随机字符串` 作为 文章永久链接
- notes 目录下的文章，会根据 notes 的配置，自动填充  文章永久链接

### externalLink

- 类型： `boolean`
- 默认值： `true`

当前文章内的 外部链接是否显示 外部链接图标， 即 “ <ExternalLinkIcon /> ” 图标

### backToTop

- 类型： `boolean`
- 默认值： `true`

当前文章是否 显示 回到顶部 的按钮。

### comments

- 类型： `boolean`
- 默认值： `true`

当前文章是否 可评论。 仅在启用了评论功能的情况下生效。

### prev

- 类型： `string | { text: string, link: string, icon?: string }`
- 默认值： `''`

自定义当前文章的上一篇文章。

- 博客类型的文章，主题根据时间排序，自动填充上一篇文章的标题和链接。
- notes 类型的文章，主题根据 note sidebar 配置，自动填充上一篇文章的标题和链接。

### next

- 类型： `string | { text: string, link: string, icon?: string }`
- 默认值： `''`

自定义当前文章的下一篇文章。

- 博客类型的文章，主题根据时间排序，自动填充下一篇文章的标题和链接。
- notes 类型的文章，主题根据 note sidebar 配置，自动填充下一篇文章的标题和链接。

### lastUpdated

- 类型： `boolean`
- 默认值： `true`

当前文章是否 显示 最后更新时间。 最后更新时间 根据 git 提交时间自动填充。

### contributors

- 类型： `boolean`
- 默认值： `true`

当前文章是否 显示 贡献者。 贡献者 根据 git 提交者自动填充。

### editLink

- 类型： `boolean`
- 默认值： `true`

当前文章是否 显示 文章编辑 按钮。
