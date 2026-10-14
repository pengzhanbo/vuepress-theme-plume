---
url: /config/frontmatter/basic/index.md
---
## 概述

通用 Frontmatter 配置，适用于所有的文章。

示例：

```md title="frontmatter"
---
title: 标题
createTime: 2024/03/02 20:01:09
permalink: /config/frontmatter/basic/
---
```

## 配置

### pageLayout

* 类型： `false | 'home' | 'posts' | 'doc' | 'custom' | 'page' | 'friends' | string`
* 默认值： `doc`
* 详情：

  页面布局方式。

  * `'home'`: 主页布局
  * `'posts'`: 文章列表页布局
  * `'doc'`: 文章页布局，包括左侧侧边栏、文章内容、右侧侧边栏、导航栏、评论等
  * `'page'`: 仅包含导航栏和 MD 文件内容，可以使用此布局方式自定义页面内容
  * `'friends'`: 友链页布局
  * `'custom'`: 仅包含 MD 文件内容，可以使用此布局方式完全自定义页面内容
  * `false`: 等同于 `custom`

  除以上取值外，还可以传入一个**已注册的全局组件名**，该组件会被应用为布局组件。
  （源码的类型声明中未包含该写法，但运行时支持。）

  另外，`'blog'` 已弃用，请使用 `'posts'` 代替。

### pageClass

* 类型： `string`
* 默认值： `''`
* 详情：

  自定义页面额外的类名。

### title

* 类型： `string`
* 默认值： `''`
* 详情：

  文章标题。

  主题会在文件创建时，自动填充当前文件名作为文章标题。

### badge

* 类型： `string | ThemeBadge`
* 默认值： `undefined`

在文章标题右侧显示徽章。

传入字符串时作为徽章的 `text`；传入对象时可使用：

```ts
interface ThemeBadge {
  /** 徽章文本内容 */
  text?: string
  /** 徽章类型，用于预设样式 */
  type?: string
  /** 徽章文本颜色 */
  color?: string
  /** 徽章背景颜色 */
  bgColor?: string
  /** 徽章边框颜色 */
  borderColor?: string
}
```

### icon

* 类型： `ThemeIcon`（`string | { svg: string }`）
* 默认值： `undefined`
* 详情：

  用作导航栏、侧边栏的图标。

  支持直接使用 iconify 图标名（自动加载），也支持本地、远程 SVG 图标地址，或直接传入 SVG 字符串。

### createTime

* 类型： `string | false`
* 默认值： `''`
* 详情：

  文章创建时间。设置为 `false` 时，不在页面中展示创建时间。

  主题会在文件创建时，自动填充当前时间作为文章创建时间。

### permalink

* 类型： `string`
* 默认值： `''`
* 详情：

  文章永久链接。

  主题会在文件创建时:

  * 博客类型的文章，自动填充 `/article/` + `nanoid 生成的 8 位随机字符串` 作为文章永久链接
  * notes 目录下的文章，会根据 notes 的配置，自动填充  文章永久链接

### externalLinkIcon

* 类型： `boolean`
* 默认值： `true`
* 详情：

  当前文章内的外部链接是否显示外部链接图标。

### backToTop

* 类型： `boolean`
* 默认值： `true`
* 详情：

  当前文章是否显示回到顶部的按钮。

### comments

* 类型： `boolean`
* 默认值： `true`
* 详情：

  当前文章是否可评论。 仅在启用了评论功能的情况下生效。

### sidebar

* 类型： `string | false`
* 默认值： `undefined`
* 详情：

  是否显示左侧侧边栏，也可以强制指定当前页面显示哪个侧边栏。

  * `false`：隐藏左侧侧边栏
  * `string`：按侧边栏的 key（页面路径前缀）指定要显示的侧边栏

### aside

* 类型： `boolean | 'left'`
* 默认值： `true`
* 详情：

  当前文章是否显示右侧边栏。

  当设置为 `'left'` 时，右侧边栏将显示在左侧。

### navbar

* 类型： `boolean`
* 默认值： `true`
* 详情：

  当前文章是否显示导航栏。

### outline

* 类型： `false | number | [number, number] | 'deep'`
* 默认值： `[2, 3]`
* 详情：

  要显示的标题级别。

  单个数字表示只显示该级别的标题。

  如果传递的是一个元组，第一个数字是最小级别，第二个数字是最大级别。

  `'deep'` 与 `[2, 6]` 相同，将显示从 `<h2>` 到 `<h6>` 的所有标题。

::: tip 小技巧
在 markdown 内容的标题后面，使用属性语法 `{data-outline="level"}` / `{outline="level"}`，
可以重新设置当前标题的后代标题的显示的最大级别。

**例如**:

```md /{data-outline="5"}/
## 标题 1 {data-outline="5"} <!-- 仅影响当前标题后代标题 -->

### 三级标题
#### 四级标题
##### 五级标题 <!-- 三四五级标题将显示在侧边栏 -->
###### 六级标题 <!-- 此标题不会显示在侧边栏 -->

## 标题 2 <!-- 同级别的标题不受影响 -->

### 三级标题 <!-- 默认仅显示到三级标题 -->
#### 四级标题 <!-- 四级标题不显示 -->
```

需要注意的是, `level` 的值应该大于当前标题的级别，否则不会生效。

:::

### prev

* 类型： `string | { text: string, link: string, icon?: string }`
* 默认值： `''`
* 详情：

  自定义当前文章的上一篇文章。

  * 博客类型的文章，主题根据时间排序，自动填充上一篇文章的标题和链接。
  * notes 类型的文章，主题根据 note sidebar 配置，自动填充上一篇文章的标题和链接。

### next

* 类型： `string | { text: string, link: string, icon?: string }`
* 默认值： `''`
* 详情：

  自定义当前文章的下一篇文章。

  * 博客类型的文章，主题根据时间排序，自动填充下一篇文章的标题和链接。
  * notes 类型的文章，主题根据 note sidebar 配置，自动填充下一篇文章的标题和链接。

### readingTime

* 类型： `boolean`
* 默认值： `true`
* 详情：

  当前文章是否显示阅读时长。

### lastUpdated

* 类型： `boolean`
* 默认值： `true`
* 详情：

  当前文章是否显示最后更新时间。 最后更新时间根据 git 提交时间自动填充。

### contributors

* 类型： `boolean | string[]`
* 默认值： `true`
* 详情：

  当前文章是否显示贡献者。 贡献者根据 git 提交者自动填充。

  如果您的文章来源于第三方， git 提交不能完整列出所有的作者，您可以在此处补充贡献者。

  额外信息补充请查看 [contributors](../../guide/features/contributors.md#info)

### changelog

* 类型： `boolean`
* 默认值： `false`
* 详情：

  当前页面是否显示页面变更历史。

### copyright

* 类型： `boolean | CopyrightLicense | CopyrightFrontmatter`
* 默认值： `false`
* 详情：

  当前文章是否显示版权信息。

  完整信息请查看 [copyright](../../guide/features/copyright.md)

### editLink

* 类型： `boolean`
* 默认值： `true`
* 详情：

  当前文章是否显示文章编辑按钮。

### editLinkPattern

* 类型： `string`
* 默认值： `''`
* 详情：

  当前页面的编辑链接模式，会覆盖主题配置中的 `editLinkPattern`。

  示例： `':repo/edit/:branch/:path'`

### watermark

* 类型： `boolean | WatermarkOptions`
* 默认值： `undefined` 主题不启用水印，或不启用全局水印时，默认值为 `false`，启用全局水印则为 `true`。
* 详情：
  配置当前文章水印。

  当类型为 boolean 时，表示是否启用水印。

  当类型为 WatermarkOptions 时，表示当前页面水印配置。

  可以参考 [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/zh/config/) 。

### footer

* 类型： `boolean`
* 默认值： `true`
* 详情：

  当前文章是否显示页脚信息。
