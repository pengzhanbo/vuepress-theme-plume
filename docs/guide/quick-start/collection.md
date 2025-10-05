---
title: 集合
icon: fluent:list-bar-tree-16-regular
createTime: 2025/09/28 14:14:53
permalink: /guide/collection/
---

## 概述

==Collections（集合）== 是主题中用于组织和管理文档的核心概念。
每个集合指向源目录下的特定文件夹，将其中的所有 Markdown 文件作为一个逻辑单元进行管理。

通过灵活的集合配置，您可以轻松构建多种内容体系：

- **博客** - 个人随笔与技术分享
- **专栏** - 专题系列文章
- **使用手册** - 产品使用文档
- **笔记** - 学习笔记与知识整理
- **产品文档** - 完整的项目文档
- **知识库** - 团队知识管理体系
- 更多...

## 创建集合

一个普通的 VuePress 静态站点的文件结构大致如下：

:::file-tree

- my-site
  - docs \# 源目录
    - .vuepress/
    - …
    - README.md \# 首页
  - package.json

:::

当你想要添加一个用于 **博客** 的集合：

:::: steps

- **创建 blog 目录**

  :::file-tree
  - docs
    - blog
      - post-1.md
      - post-2.md
      - …
    - …
  :::

- **在主题配置中添加类型为 `post` 的集合**

  将 `dir` 配置项指向 `blog` 目录

  ::: code-tabs#config：

  @tab .vuepress/config.ts

  ```ts twoslash
  import { defineUserConfig } from 'vuepress'
  import { plumeTheme } from 'vuepress-theme-plume'

  export default defineUserConfig({
    theme: plumeTheme({
      collections: [
        // [!code word:type]
        { type: 'post', dir: 'blog', title: '博客' } // [!code word:dir]
      ]
    })
  })
  ```

  @tab .vuepress/plume.config.ts

  ```ts twoslash
  import { defineThemeConfig } from 'vuepress-theme-plume'

  export default defineThemeConfig({
    collections: [
      // [!code word:type]
      { type: 'post', dir: 'blog', title: '博客' } // [!code word:dir]
    ]
  })
  ```

  :::

  `blog` 目录下的 markdown 文章，在 post 集合中读取为文章列表，并生成列表页、分类页、标签页等页面。

- **完成**
::::

### dir 配置项

集合配置中的 `dir` 指向源目录下的某个文件夹，该文件夹下的所有 markdown 文件都将归属于该集合。

### type 配置项

集合配置中的 `type` 指定了集合的类型。

集合的类型决定了该集合下的文档将会提供哪些功能，当前主题支持的类型如下：

- `post`：表示碎片化文章的集合，文章之间不存在关联关系或弱关联关系。
- `doc`: 表示结构化文章的集合，文章之间存在结构化的强关联关系，作为一个整体。

### title 配置项

集合配置中的 `title` 指定了集合的名称。

在主题中，`title` 用于页面的面包屑导航中。

## 集合类型

::: card-grid

<LinkCard title="post 集合" href="./collection-post.md" icon="mdi:post-outline" />
<LinkCard title="doc 集合" href="./collection-doc.md" icon="streamline-ultimate:sidebar-line-left" />
:::

## 集合配置

<LinkCard title="集合配置" href="../../config/collections.md" />
