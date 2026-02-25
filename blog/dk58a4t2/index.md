---
url: /blog/dk58a4t2/index.md
---
:::important ‼️ 本次更新为破坏性更新！博客与笔记功能已整体迁移至全新的“集合”架构。‼️
:::

## 设计动机：为什么引入“集合”？

[跳转至迁移指南 👇👇👇](#迁移指南){.read-more}

### 背景与问题分析

主题最初仅支持**博客**功能，将 `docs` 源目录下的所有 Markdown 文件识别为博客文章。随着版本迭代，我们新增了**笔记/知识库**功能，默认将 `notes` 目录作为笔记根目录，并将其内容从博客列表中排除。

这种分阶段实现导致了**架构上的不平衡**：博客成为“一等公民”，而笔记功能则显得边缘化。这给用户带来了以下困扰：

* **路径冗余**：笔记文件必须存放在 `notes/` 目录下，增加了不必要的目录层级
* **链接复杂**：未开启 `autoFrontmatter` 时，URL 会强制包含 `/notes/` 前缀
* **概念混淆**：用户常困惑于“笔记”与“文档”的功能区别
* **配置繁琐**：需要额外调整 `notes.dir` 配置才能实现标准文档站结构

这些设计缺陷源于历史迭代的遗留问题，我们对此深表歉意。

### 解决方案：统一的内容抽象

经过对主流静态站点生成器（如 Hugo、VitePress）和全栈框架（如 Nuxt）的调研，我们从 `@nuxt/content` 的 `collection` 概念中获得灵感。

我们决定引入**集合**作为统一的内容组织单元。无论是博客、笔记、文档还是知识库，本质上都是 Markdown 文件的特定集合，只是在呈现方式上有所差异。

:::important 核心洞察：通过“集合”抽象，统一各类内容的组织形式，同时保留各自的展示特性。
:::

基于内容特征，我们定义了两种集合类型：

* **`post` 类型**：适用于碎片化、关联性弱的内容（如博客、专栏），提供文章列表作为导航入口
* **`doc` 类型**：适用于结构化、关联性强的内容（如文档、手册），提供侧边栏进行快速导航

这一设计既解决了历史架构问题，又为未来扩展更多内容类型奠定了基础。

## 迁移指南

### 核心概念

* **集合**：通过 `collection.dir` 指定目录，该目录下所有 Markdown 文件均归属该集合
* **集合类型**：
  * `post`：碎片化内容，支持文章列表导航
  * `doc`：结构化内容，支持侧边栏导航

### 配置迁移

替换原有的 `blog` 和 `notes` 配置：

```ts twoslash
// @noErrors
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // [!code --:9]
    // 移除旧的 blog 和 notes 配置
    blog: { /* 博客配置 */ },
    notes: {
      link: '/',
      dir: '/notes/',
      notes: [
        { dir: 'typescript', link: '/typescript/', sidebar: 'auto' }
      ]
    },
    // [!code ++:17]
    // 使用 collections 配置
    collections: [
      {
        type: 'post', // 替代原博客功能
        dir: 'blog', // 指向 docs/blog 目录
        title: '博客' // 集合显示名称
        // 原博客配置继续保留
        // ...
      },
      {
        type: 'doc', // 替代原笔记功能
        dir: 'typescript', // 指向 docs/typescript 目录
        title: 'TypeScript笔记',
        linkPrefix: '/typescript/', // 页面链接前缀、侧边栏判断依据
        sidebar: 'auto', // 自动生成侧边栏
      },
    ]
  })
})
```

### 目录结构调整

按照以下步骤迁移文件：

**操作步骤：**

1. 将 `notes` 目录下的子目录直接移至 `docs` 根目录
2. 创建 `blog` 目录，将原博客文章移入其中
3. 移除空的 `notes` 目录

:::: flex

::: file-tree title="迁移前结构"

* docs
  * \-- notes
    * typescript
      * basic.md
      * advanced.md
  * blog-cate-1
    * post-1.md
  * blog-cate-2
    * post-2.md
  * blog-post.md
  * README.md
    :::

:::file-tree title="迁移后结构"

* docs
  * typescript
    * basic.md
    * advanced.md
  * ++ blog
    * blog-cate-1
      * post-1.md
    * blog-cate-2
      * post-2.md
    * blog-post.md
  * README.md

:::

::::

### 帮助函数

* `defineCollection`：用于定义单个 collection 配置的帮助函数
* `defineCollections`：用于定义多个 collection 配置的帮助函数

```ts twoslash
import { defineCollection, defineCollections } from 'vuepress-theme-plume'

export const blog = defineCollection({
  type: 'post',
  dir: 'blog',
  title: '博客'
})

export const typescript = defineCollection({
  type: 'doc',
  dir: 'typescript',
  title: 'TypeScript笔记',
  sidebar: 'auto'
})

export const collections = defineCollections([
  blog,
  typescript
])
```

## 详细文档

[集合文档](../../guide/quick-start/collection.md){.read-more}

[post 集合](../../guide/quick-start/collection-post.md){.read-more}

[doc 集合](../../guide/quick-start/collection-doc.md){.read-more}
