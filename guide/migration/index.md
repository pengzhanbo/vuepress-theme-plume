---
url: /guide/migration/index.md
---
## 概述

本页说明如何把 **1.0.0-rc.165 之前版本的配置** 升级到当前版本的 `collections` 架构。

主题在构建时会**自动迁移**旧的 `blog` / `notes` 配置，你无需手动改写即可继续运行。
但自动迁移存在「以 `collections` 为准」的优先级规则，且部分场景下迁移结果不符合预期 —— 这些需要你主动处理。

::: tip 只想快速确认没有被迁移？
直接看本文 [哪些情况不会被自动迁移](#哪些情况不会被自动迁移) 一节。
:::

## collections 是什么

主题现在用 `collections` 统一描述「哪部分内容、以何种形式、生成什么页面」：

| 集合类型 | 用途 | 生成内容 |
| --- | --- | --- |
| `post` | 博客类内容 | 列表页、标签页、归档页、分类页 |
| `doc` | 文档类内容 | 侧边栏导航 |

旧版本的 `blog` 对应 `post` 集合，旧的 `notes` 对应一组 `doc` 集合。

## 旧配置如何被迁移

主题默认兼容旧的 `blog/notes` 配置，在构建时完成转换，规则如下：

1. 若**未配置 `collections`**，则把根级的 `blog` 转换为 `post` 集合，把 `notes` 转换为若干 `doc` 集合。
2. `notes` 中配置的目录会被自动追加到 `blog` 集合的 `exclude` 中，避免这些文章被博客列表收录。
3. **若已配置 `collections`，则根级的 `blog` / `notes` 会被忽略。**
4. 多语言场景下，某个语言环境**自身声明了 `collections`** 时，它自己的 `blog` / `notes` 会被忽略；未声明时，会回退使用根级的 `blog` / `notes`。

::: warning
`blog` 与 `notes` 已标注 `@deprecated`。它们仅用于过渡，**下一个大版本会直接移除**。
:::

## 哪些情况不会被自动迁移

以下场景需要你手动调整。

### 1. 同时配置了 `collections` 和 `blog` / `notes`

这是最容易踩坑的情况：**`collections` 存在时，`blog` / `notes` 直接被忽略**。

如果你既想保留已有的 `collections`，又想沿用旧的 `blog`，请把 `blog` 的内容手动合并进 `collections`。

### 2. 某个语言环境要单独配置，但根级没有

旧版 `blog` / `notes` 是全局配置，所有语言共享。若你需要在某个语言环境下使用不同的集合，请在**该语言环境内部**声明 `collections`，而不是依赖根级回退。

### 3. `notes` 中多个目录对应不同侧边栏

旧版 `notes.notes` 是一个数组，每项各自有 `dir` / `link` / `sidebar`。迁移会为每一项生成一个独立的 `doc` 集合，因此结构通常能对应；但如果你依赖了 `notes.sidebarScrollbar`（旧字段），需要注意它已迁移到每个 `doc` 集合上。

## 手动迁移步骤

以一个典型的配置为例：

```ts
export default defineThemeConfig({
  blog: {
    dir: 'blog',
    categories: true,
    tags: true,
    archives: true,
    pagination: {
      perPage: 10,
    },
  },
  notes: {
    dir: 'notes',
    link: '/notes/',
    notes: [
      { dir: 'guide', link: '/guide/' },
      { dir: 'api', link: '/api/' },
    ],
  },
})
```

迁移为：

```ts twoslash
import { defineCollections } from 'vuepress-theme-plume'

// 迁移后
export default defineCollections([
  {
    type: 'post',
    dir: 'blog',
    title: '博客',
    categories: true,
    tags: true,
    archives: true,
    pagination: {
      perPage: 10,
    },
  },
  {
    type: 'doc',
    dir: 'notes/guide',
    title: '指南',
    linkPrefix: '/notes/guide/',
  },
  {
    type: 'doc',
    dir: 'notes/api',
    title: 'API',
    linkPrefix: '/notes/api/',
  },
])
```

::: warning
注意两点差异：

* `title` 是**必填字段**（`ThemeBaseCollection.title`），旧配置若未显式声明集合标题，迁移后需要自行补上。
* `linkPrefix` 决定集合内文章的 URL。迁移时若 `notes` 未显式配置 `link`，`linkPrefix` 会退化为目录名，**URL 可能与迁移前不同**。
  :::

::: tip
若旧配置使用了手写的侧边栏数组（`notes.notes[].sidebar`），它会原样迁移为 `doc` 集合的 `sidebar` 字段，支持 `'auto'` 或 `(string | ThemeSidebarItem)[]`。
:::

## 嵌套集合的 `dir` 匹配规则

当存在**嵌套目录**时，一个文件属于哪个集合，取决于 `dir` 的**最长匹配**：

* 同时声明了 `dir: 'docs'`（`type: 'doc'`）与 `dir: 'docs/blog'`（`type: 'post'`）两个集合时
* `docs/blog/a.md` 属于 **`post`** 集合（`docs/blog` 比 `docs` 更长，匹配更长者）
* `docs/guide/b.md` 属于 `doc` 集合

这一规则由主题自动判定，无需你手动排序。源码位于 `theme/src/node/collections/findCollection.ts`：它把集合按 `dir` 长度**降序排序**，再取第一个目录前缀匹配的集合，因此**更长（更具体）的目录永远优先**。

## 检查迁移结果

迁移完成后，建议逐项确认：

1. **博客列表页**是否正常显示文章，分页与文章数是否与迁移前一致
2. **标签页、归档页、分类页**链接是否可达
3. **文档侧边栏**是否与迁移前一致，特别是 `sidebar: 'struct'` 这类深层结构
4. 各页面的 **URL 是否发生变化** —— `linkPrefix` 写错会导致路径改变，旧链接失效
5. 原 `notes` 目录中的文章是否被正确排除在博客列表之外

## 相关文档

* [集合](./collection.md) —— `collections` 的完整配置说明
* [配置 > 主题配置](../../config/theme.md) —— 各配置字段的默认值与含义
* [配置 > 集合](../../config/collections.md) —— 集合配置的参考
