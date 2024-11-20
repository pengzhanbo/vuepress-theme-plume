---
title: 通用配置
author: pengzhanbo
createTime: 2024/03/02 20:01:09
permalink: /config/frontmatter/basic/
badge: 徽章 badge
---

## 概述

通用 Frontmatter 配置，适用于 所有的文章。

示例：

```md
---
title: 标题
createTime: 2024/03/02 20:01:09
permalink: /config/frontmatter/basic/
---
```

## 配置

### pageLayout

- 类型： `false | 'home' | 'doc' | 'custom' | 'page' | 'friends' | string`
- 默认值： `doc`
- 详情：

  页面布局方式。

  - `'home'`: 主页布局
  - `'doc'`: 文章页布局，包括左侧侧边栏、文章内容、右侧侧边栏、导航栏、评论等
  - `'page'`: 仅包含导航栏 和 MD 文件内容，可以使用此布局方式自定义页面内容
  - `'friends'`: 友链页布局
  - `'custom'`: 仅包含 MD 文件内容，可以使用此布局方式完全自定义页面内容
  - `false`: 等同于 `custom`
  - `string`: 可以传入一个全局组件组件名，该组件将被应用为布局组件

### pageClass

- 类型： `string`
- 默认值： `''`
- 详情：

  自定义页面额外的 类名。

### title

- 类型： `string`
- 默认值： `''`
- 详情：

  文章标题。

  主题会在文件创建时，自动填充 当前文件名作为 文章标题。

### badge

- 类型： `string | { text: string, type?: 'info' | 'tip' | 'warning' | 'danger' }`

在文章标题右侧显示 徽章。

### createTime

- 类型： `string`
- 默认值： `''`
- 详情：

  文章创建时间。

  主题会在文件创建时，自动填充 当前时间作为 文章创建时间。

### permalink

- 类型： `string`
- 默认值： `''`
- 详情：

  文章永久链接。

  主题会在文件创建时:

  - 博客类型的文章，自动填充 `/article/` + `nanoid 生成的 8 位随机字符串` 作为 文章永久链接
  - notes 目录下的文章，会根据 notes 的配置，自动填充  文章永久链接

### externalLinkIcon

- 类型： `boolean`
- 默认值： `true`
- 详情：

  当前文章内的 外部链接是否显示 外部链接图标。

### backToTop

- 类型： `boolean`
- 默认值： `true`
- 详情：

  当前文章是否 显示 回到顶部 的按钮。

### comments

- 类型： `boolean`
- 默认值： `true`
- 详情：

  当前文章是否 可评论。 仅在启用了评论功能的情况下生效。

### aside

- 类型： `boolean | 'left'`
- 默认值： `true`
- 详情：

  当前文章是否 显示 右侧边栏。

  当设置为 `'left'` 时，右侧边栏将显示在左侧。

### navbar

- 类型： `boolean`
- 默认值： `true`
- 详情：

  当前文章是否 显示 导航栏。

### outline

- 类型： `false | number | [number, number] | 'deep'`
- 默认值： `[2, 3]`
- 详情：

  要显示的标题级别。

  单个数字表示只显示该级别的标题。

  如果传递的是一个元组，第一个数字是最小级别，第二个数字是最大级别。

  `'deep'` 与 `[2, 6]` 相同，将显示从 `<h2>` 到 `<h6>` 的所有标题。

### prev

- 类型： `string | { text: string, link: string, icon?: string }`
- 默认值： `''`
- 详情：

  自定义当前文章的上一篇文章。

  - 博客类型的文章，主题根据时间排序，自动填充上一篇文章的标题和链接。
  - notes 类型的文章，主题根据 note sidebar 配置，自动填充上一篇文章的标题和链接。

### next

- 类型： `string | { text: string, link: string, icon?: string }`
- 默认值： `''`
- 详情：

  自定义当前文章的下一篇文章。

  - 博客类型的文章，主题根据时间排序，自动填充下一篇文章的标题和链接。
  - notes 类型的文章，主题根据 note sidebar 配置，自动填充下一篇文章的标题和链接。

### readingTime

- 类型： `boolean`
- 默认值： `true`
- 详情：

  当前文章是否 显示 阅读时长。

### lastUpdated

- 类型： `boolean`
- 默认值： `true`
- 详情：

  当前文章是否 显示 最后更新时间。 最后更新时间 根据 git 提交时间自动填充。

### contributors

- 类型： `boolean`
- 默认值： `true | string | string[]`
- 详情：

  当前文章是否 显示 贡献者。 贡献者 根据 git 提交者自动填充。

  如果您的文章来源于第三方， git 提交不能完整列出所有的作者，您可以在此处补充贡献者。

  额外信息补充请查看 [contributors](../../guide/功能/文章贡献者.md#info)

### changelog

- 类型： `boolean`
- 默认值： `false`
- 详情：

  当前页面是否显示页面变更历史。

### copyright

- 类型： `boolean | CopyrightLicense | CopyrightFrontmatter`
- 默认值： `false`
- 详情：

  当前文章是否 显示 版权信息。

  完整信息请查看 [copyright](../../guide/功能/文章版权所有.md)

### editLink

- 类型： `boolean`
- 默认值： `true`
- 详情：

  当前文章是否 显示 文章编辑 按钮。

### watermark

- 类型： `boolean | WatermarkOptions`
- 默认值： `undefined` 主题不启用水印，或不启用全局水印时，默认值为 `false`，启用全局水印则为 `true`。
- 详情：
  配置当前文章 水印。

  当类型为 boolean 时，表示是否启用水印。

  当类型为 WatermarkOptions 时，表示当前页面水印配置。

  可以参考 [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/) 。
