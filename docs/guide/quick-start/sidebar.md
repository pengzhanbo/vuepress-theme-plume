---
title: 侧边栏
icon: ph:sidebar-duotone
createTime: 2025/09/29 15:45:34
permalink: /guide/sidebar/
tags:
  - 指南
  - 快速开始

---

## 概述

主题内置了强大的**知识笔记**功能，专门用于组织和聚合相关主题的系列文档。笔记系统作为站点的子文档体系，能够有效管理结构化内容。

**核心特性**：

- 独立的内容分类：`notes/` 目录下的文档不会出现在博客文章列表
- 结构化导航：支持自动生成侧边栏导航
- 灵活的配置：提供多种配置方式适应不同规模项目

## 文件结构与基础配置

### 目录结构设计

典型的笔记项目结构如下：

::: file-tree

- docs
  - notes
    - typescript     # TypeScript 学习笔记
      - basic.md
      - types.md
    - rust           # Rust 编程笔记
      - tuple.md
      - struct.md
  - blog-post.md     # 普通博客文章
  - README.md        # 站点首页
:::

### 基础配置

在 VuePress 配置文件中设置笔记系统：

```js title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    notes: {
      dir: '/notes/', // 笔记根目录（默认值）
      link: '/', // 默认链接前缀（默认值）
      notes: [
        {
          dir: 'typescript', // 相对于 notes.dir 的路径
          link: '/typescript/', // 笔记访问路径前缀
          sidebar: 'auto' // 自动生成侧边栏
        },
        {
          dir: 'rust',
          link: '/rust/',
          sidebar: [ // 手动配置侧边栏
            { text: '简介', items: ['foo'] }
          ]
        }
      ]
    }
  })
})
```

::: tip 配置时机建议
在创建文档文件前完成笔记配置。主题的 [auto-frontmatter](../../config/theme.md#autofrontmatter) 功能会根据配置自动生成永久链接和侧边栏结构。
:::

## 进阶配置管理

### 模块化配置方案

对于复杂项目，推荐使用主题提供的类型安全配置工具：

::: code-tabs

@tab .vuepress/notes.ts

```ts twoslash
import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

// 单笔记配置
const typescript = defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    '/guide/intro.md',
    '/guide/getting-start.md',
    '/config/config-file.md',
  ]
})

// 笔记集合配置
export default defineNotesConfig({
  dir: '/notes/',
  link: '/',
  notes: [typescript] // [!code ++]
})
```

@tab .vuepress/config.ts

```ts twoslash
// @filename: ./notes.ts
export default {}

// ---cut---
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import notes from './notes' // [!code ++]

export default defineUserConfig({
  theme: plumeTheme({
    notes // [!code ++]
  }),
})
```

:::

### 大型项目配置拆分

当笔记数量较多时，可采用模块化配置结构：

::: file-tree

- docs
  - .vuepress
    - notes
      - typescript.ts
      - rust.ts
      - index.ts
      - …
  - notes
    - typescript/
    - rust/
:::

配置代码组织示例：

::: code-tabs
@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import notes from './notes/index.ts' // [!code ++]

export default defineUserConfig({
  theme: plumeTheme({
    notes // [!code ++]
  }),
})
```

@tab .vuepress/notes/index.ts

```ts
import { defineNotesConfig } from 'vuepress-theme-plume'
import rust from './rust' // [!code ++]
import typescript from './typescript' // [!code ++]

export default defineNotesConfig({
  dir: '/notes/',
  link: '/',
  notes: [ // [!code ++:4]
    typescript,
    rust,
  ]
})
```

@tab .vuepress/notes/typescript.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

export default defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    '/guide/intro.md',
    '/guide/getting-start.md',
    '/config/config-file.md',
  ]
})
```

:::

## 侧边栏配置详解

### 文件结构示例

假设 TypeScript 笔记包含以下结构：

::: file-tree

- typescript
  - guide
    - intro.md
    - getting-start.md
  - config
    - config-file.md
    - configuration.md
  - reference
    - basic.md
    - syntax.md
    - modules.md
  - built-in
    - types
      - Required.md
      - Omit.md
  - README.md
:::

### 自动生成侧边栏

最简单的配置方式使用自动生成：

```ts
sidebar: 'auto'
```

**排序控制**：通过数字前缀管理显示顺序

::: file-tree

- typescript
  - 1.guide
    - 1.intro.md
    - 2.getting-start.md
  - 2.config
    - 1.config-file.md
    - 2.configuration.md
  - …
:::

数字前缀仅用于排序，不会在侧边栏中显示。

### 自定义侧边栏配置

#### 基础配置类型

```ts
interface SidebarItem {
  text?: string // 显示文本
  link?: string // 链接地址
  icon?: ThemeIcon // 图标配置
  badge?: string | ThemeBadge // 徽章
  prefix?: string // 链接前缀
  items?: 'auto' | (string | SidebarItem)[] // 子项
  collapsed?: boolean // 折叠状态
}
```

#### 配置示例

**基础链接配置**：

```ts
sidebar: [
  '/guide/intro.md',
  '/guide/getting-start.md',
  '/config/config-file.md',
]
```

**完整对象配置**：

```ts
sidebar: [
  { text: '介绍', link: '/guide/intro' },
  { text: '快速上手', link: '/guide/getting-start' },
]
```

**嵌套分组配置**：

```ts
sidebar: [
  {
    text: '指南',
    prefix: '/guide',
    items: [
      { text: '介绍', link: 'intro' },
      'getting-start', // 简写形式
    ],
  },
  {
    text: '配置',
    prefix: '/config',
    items: 'auto', // 自动生成该分组下的侧边栏
  },
]
```

### Prefix 路径处理规则

`prefix` 用于简化相同前缀的链接配置：

```ts
const sidebarItem: SidebarItem = {
  prefix: '/guide',
  items: [
    'intro', // → /guide/intro
    '/config/config-file', // → /config/config-file (绝对路径)
    { link: 'blog' }, // → /guide/blog
    { link: '/config' } // → /config (绝对路径)
  ]
}
```

**路径判断规则**：

- 以 `/` 开头：绝对路径，不拼接 prefix
- 其他情况：相对路径，与 prefix 拼接

**多级嵌套示例**：

```ts
const sidebarItem: SidebarItem = {
  prefix: '/guide',
  items: [
    'intro', // → /guide/intro
    {
      prefix: '/config', // 绝对路径
      items: ['config-file'] // → /config/config-file
    },
    {
      prefix: 'blog', // 相对路径
      items: ['intro'] // → /guide/blog/intro
    }
  ]
}
```

::: warning 层级深度限制
避免超过 3 层嵌套的侧边栏配置，过深的层级会影响用户体验和界面美观。
:::

## 视觉增强功能

### 图标配置

支持多种图标源，通过 `markdown.icon.provide` 配置：

```ts
sidebar: [
  {
    text: '指南',
    prefix: '/guide',
    icon: 'ep:guide', // Iconify 图标
    items: [
      { text: '介绍', link: 'intro', icon: 'ph:info-light' },
    ],
  },
]
```

**本地图标配置**：

```ts
const sidebarItem: SidebarItem = {
  text: '指南',
  icon: '/images/guide.png', // 本地图片
  items: [
    {
      text: '介绍',
      icon: 'https://example.com/icon.png' // 远程图片
    },
  ]
}
```

::: important 本地资源路径
本地图片路径应从 `/` 开始，对应 `.vuepress/public/` 目录：

::: file-tree

- docs
  - .vuepress
    - public
      - images
        - guide.png
        - info.png
:::

### 徽章功能 <Badge text="v1.0.0-rc.143 +" />

通过徽章提供额外信息提示：

```ts
sidebar: [
  {
    text: '指南',
    badge: { text: '新', type: 'danger' }, // 对象形式
    items: [
      { text: '介绍', badge: '推荐' }, // 字符串简写
    ],
  },
]
```

**Frontmatter 配置**：

```md
---
title: 介绍
badge:
  text: 新功能
  type: danger
---
```

### 分组分隔符

在复杂侧边栏中添加视觉分隔：

```ts
sidebar: [
  {
    text: '指南',
    items: [
      '项目 1',
      '项目 2',
      { text: '高级功能', link: '---' }, // 分隔符
      '项目 3',
      '项目 4',
    ],
  },
]
```

**分隔符特征**：`link` 字段包含至少三个连续的 `-`

## 笔记首页定制

笔记目录下的 `README.md` 自动作为笔记首页。默认使用文档布局，可通过配置转换为功能丰富的门户页面：

```md title="typescript/README.md"
---
pageLayout: home
config:
  - type: hero
    title: TypeScript 完全指南
    description: 从基础到进阶的 TypeScript 学习路径
  - type: features
    features:
      - title: 类型系统
        details: 深入理解 TypeScript 类型系统
        icon: mdi:code-braces
      - title: 高级特性
        details: 掌握泛型、装饰器等高级功能
        icon: mdi:rocket-launch
---
```

通过合理的配置，笔记系统能够成为您知识管理的强大工具，提供清晰的内容结构和优秀的阅读体验。
