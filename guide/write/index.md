---
url: /guide/write/index.md
---
VuePress 完整支持 [标准 Markdown 语法](../markdown/basic.md)，同时允许通过
[YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f)
格式的 Frontmatter 定义页面元数据（如标题、创建时间等）。

此外，主题还提供了丰富的 [Markdown 扩展语法](../markdown/extensions.md)。您不仅可以在 Markdown 中直接编写 HTML，还能使用 Vue 组件来增强内容表现力。

## Frontmatter 页面配置

通过 Frontmatter 可以自定义每个页面的属性和行为。Frontmatter 位于文件顶部，由 `---` 分隔符包裹。

```md title="post.md"
<!--[!code ++:5]-->
---
title: 文章标题
createTime: 2024/09/08 22:53:34
permalink: /article/9eh4d6ao/
---

页面正文内容位于第二个 `---` 之后。
```

::: details 什么是 Frontmatter？
Frontmatter 是采用 [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) 格式的配置区块，位于 Markdown 文件顶部，通过 `---` 分隔符界定。

推荐阅读 [Frontmatter 详解](../../../../4.教程/frontmatter.md) 了解完整语法规范。
:::

## 自动生成 Frontmatter

主题在开发服务器启动后，会自动为文档源目录中的 Markdown 文件生成必要的 Frontmatter 字段，包括：**标题**、**创建时间** 和 **永久链接**。

这一功能既减轻了内容创作者的重复工作负担，也为主题的后续功能提供了必要的数据支持。

```md
---
title: 标题
createTime: 2024/09/08 22:53:34
permalink: /article/9eh4d6ao/
---
```

### 标题生成规则

主题默认使用文件名作为文章标题。解析时会自动移除[文件命名约定](#文件夹命名约定)中的序号和扩展名，例如 `1.我的文章.md` 将生成标题 `我的文章`。

### 创建时间

主题以文件的创建时间为基准，格式化为 `yyyy/MM/dd HH:mm:ss` 作为文章创建时间。

### 永久链接

**永久链接**是文章发布后的固定访问地址。一旦生成，即使文件路径或名称发生变化，该链接仍保持不变。

预先设置永久链接有助于：

* 提升 **SEO 效果**，避免收录地址频繁变动
* 保持整个站点链接风格的 **一致性**

### 禁用自动生成

如需完全手动控制 Frontmatter，可通过 [主题配置 > autoFrontmatter](../../config/theme.md#autofrontmatter) 禁用自动生成功能。

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 完全禁用所有自动生成
    // autoFrontmatter: false,

    // 按需启用特定功能
    autoFrontmatter: {
      permalink: true, // 生成永久链接
      createTime: true, // 生成创建时间
      title: true, // 生成标题
    },
    collections: [{
      type: 'post',
      dir: 'blog',
      title: '博客',
      // 针对特定 collection 配置
      autoFrontmatter: {
        permalink: true,
        createTime: true,
        title: true
      }
    }]
  })
})
```

## 文件组织约定

::: info 说明
以下示例基于[项目结构](./project-structure.md)中的基准文件结构。
:::

主题提供了灵活的文件组织方式，您可以在 `docs` 目录中按喜好创建任意命名的 Markdown 文件。

### 文件夹命名约定

主题对 `docs` 目录中的文件夹命名采用以下规则：

对于 `post` 类型的 collection：

* 文件夹名称作为文章的 **分类**
* 支持多级目录，子目录作为父分类的子项

需要排序时，采用以下命名模式（适用于所有类型的 collection）：

```ts :no-line-numbers
const dir = /\d+\.[\s\S]+/
// 格式：数字 + . + 分类名称
// 示例：1.前端
```

数字部分将作为 **排序依据**。未带数字的目录按默认规则排序。

**示例结构：**

::: file-tree

* docs
  * blog # post 类型 collection
    * 1.前端
      * 1.html/
      * 2.css/
      * 3.javascript/
    * 2.后端/
    * 运维/
  * typescript # doc 类型 collection
    * 1.基础
      * 1.变量.md
      * 2.类型.md
    * 2.进阶.md
      :::

主题将根据目录结构自动生成分类页面或者侧边栏。

### 文件命名约定

文件命名遵循与[文件夹命名约定](#文件夹命名约定)相同的规则，为笔记功能的[自动生成侧边栏](../../config/notes.md#自动生成侧边栏)提供排序依据。

## 开始写作

现在您可以在 `docs` 目录下创建 Markdown 文件开始写作了。关于 Markdown 扩展功能的完整说明，请参阅[扩展语法文档](../markdown/extensions.md)。

由于主题默认自动生成文章标题，正文内容的标题应从二级标题 `## 二级标题` 开始。如果禁用了 `autoFrontmatter.title`，则使用一级标题 `# 一级标题` 开始。

### 文章标签

通过 `frontmatter.tags` 为文章添加标签：

```md
---
title: 我的文章
tags:
  - 标签1
  - 标签2
---
```
