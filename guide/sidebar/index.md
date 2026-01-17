---
url: /guide/sidebar/index.md
---
## 概述

侧边栏是文档常见的页面导航方式，可以快速定位到文档内容。

主题提供了两种方式配置侧边栏，包括:

* 通过主题配置的 `sidebar` 选项配置侧边栏
* 在 [类型为 `doc` 的集合](./collection-doc.md) 中配置侧边栏

## 文件结构与基础配置

### 目录结构设计

典型的项目结构可能如下：

::: file-tree

* docs
  * typescript     # TypeScript 学习笔记
    * basic.md
    * types.md
  * rust           # Rust 编程笔记
    * tuple.md
    * struct.md
  * README.md        # 站点首页
    :::

### 通过`sidebar` 配置

这种方式适用于简单小巧的文档站点。

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    sidebar: {
      '/typescript/': [
        'basic',
        'types'
      ],
      '/rust/': [
        'tuple',
        'struct'
      ]
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  sidebar: {
    '/typescript/': [
      'basic',
      'types'
    ],
    '/rust/': [
      'tuple',
      'struct'
    ]
  }
})
```

:::

### 通过 `collection` 配置&#x20;

`collections` （集合）可以灵活的组织和管理站点中的不同类别的文档，这种方式适用于复杂的站点。

::: code-tabs#config

@tab .vuepress/config.ts

```js twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'doc',
        dir: 'typescript',
        linkPrefix: '/typescript/',
        title: 'TypeScript 笔记',
        sidebar: ['basic', 'types'],
      },
      {
        type: 'doc',
        dir: 'rust',
        linkPrefix: '/rust/',
        title: 'Rust 笔记',
        sidebar: ['tuple', 'struct'],
      }
    ],
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'doc',
      dir: 'typescript',
      linkPrefix: '/typescript/',
      title: 'TypeScript 笔记',
      sidebar: ['basic', 'types'],
    },
    {
      type: 'doc',
      dir: 'rust',
      linkPrefix: '/rust/',
      title: 'Rust 笔记',
      sidebar: ['tuple', 'struct'],
    }
  ],
})
```

:::

::: tip 配置时机建议
在创建文档文件前完成笔记配置。主题的 [auto-frontmatter](../../config/theme.md#autofrontmatter) 功能会根据配置自动生成永久链接和侧边栏结构。
:::

## 进阶配置管理

### 模块化配置方案

对于复杂项目，推荐使用主题提供的类型安全配置工具：

::: code-tabs

@tab .vuepress/collections.ts

```ts twoslash
import { defineCollection, defineCollections } from 'vuepress-theme-plume'

// 单个集合配置
const typescript = defineCollection({
  type: 'doc',
  dir: 'typescript',
  title: 'TypeScript 笔记',
  linkPrefix: '/typescript/',
  sidebar: [
    'guide/intro.md',
    'guide/getting-start.md',
    'config/config-file.md',
  ]
})

// 导出所有集合配置
export default defineCollections([
  typescript
])
```

@tab .vuepress/config.ts

```ts twoslash
// @filename: ./collections.ts
export default []

// ---cut---
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import collections from './collections' // [!code ++]

export default defineUserConfig({
  theme: plumeTheme({
    collections // [!code ++]
  }),
})
```

:::

### 大型项目配置拆分

当集合数量较多时，可采用模块化配置结构：

::: file-tree

* docs
  * .vuepress
    * collections
      * typescript.ts
      * rust.ts
      * index.ts
      * …
  * typescript/
  * rust/
    :::

配置代码组织示例：

::: code-tabs
@tab .vuepress/config.ts

```ts twoslash
// @filename: ./collections/index.ts
export default []

// ---cut---
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import collections from './collections/index.ts' // [!code ++]

export default defineUserConfig({
  theme: plumeTheme({
    collections // [!code ++]
  }),
})
```

@tab .vuepress/collections/index.ts

```ts twoslash
// @filename: ./rust.ts
export default {}
// @filename: ./typescript.ts
export default {}

// ---cut---
import { defineCollections } from 'vuepress-theme-plume'
import rust from './rust' // [!code ++]
import typescript from './typescript' // [!code ++]

export default defineCollections([
  rust,
  typescript,
])
```

@tab .vuepress/collections/typescript.ts

```ts
import { defineCollection } from 'vuepress-theme-plume'

export default defineCollection({
  type: 'doc',
  dir: 'typescript',
  link: '/typescript/',
  title: 'TypeScript 笔记',
  sidebar: [
    'guide/intro.md',
    'guide/getting-start.md',
    'config/config-file.md',
  ]
})
```

:::

## 侧边栏配置详解

### 文件结构示例

假设 TypeScript 笔记 包含以下结构：

::: file-tree

* docs
  * typescript
    * guide
      * intro.md
      * getting-start.md
    * config
      * config-file.md
      * configuration.md
    * reference
      * basic.md
      * syntax.md
      * modules.md
    * built-in
      * types
        * Required.md
        * Omit.md
    * README.md
      :::

### 自动生成侧边栏

最简单的配置方式使用自动生成：

```ts
import { defineCollection } from 'vuepress-theme-plume'

export default defineCollection({
  type: 'doc',
  dir: 'typescript',
  sidebar: 'auto' // 自动生成侧边栏 // [!code ++]
})
```

主题根据目录结构自动配置侧边栏。

**排序控制**：通过数字前缀管理显示顺序

::: file-tree

* typescript
  * 1.guide
    * 1.intro.md
    * 2.getting-start.md
  * 2.config
    * 1.config-file.md
    * 2.configuration.md
  * …
    :::

数字前缀仅用于排序，不会在侧边栏中显示。

**自动折叠**：默认情况下，侧边栏不会自动折叠，可以通过配置 `sidebarCollapsed` 开启自动折叠：

```ts
import { defineCollection } from 'vuepress-theme-plume'

export default defineCollection({
  type: 'doc',
  dir: 'typescript',
  sidebar: 'auto',
  sidebarCollapsed: true, // [!code ++]
})
```

`sidebarCollapsed` 有以下可选值：

* `undefined`: 默认，不自动折叠
* `true`: 默认全部折叠
* `false`: 默认全部展开

### 自动生成次级侧边栏

为了更加灵活的控制侧边栏，减少配置的复杂度，主题允许配置仅自动生成次级侧边栏：

```ts
import { defineCollection } from 'vuepress-theme-plume'

export default defineCollection({
  type: 'doc',
  dir: 'typescript',
  sidebar: [
    // 次级 items 自动读取 typescript/guide 目录
    { text: '指南', prefix: 'guide', items: 'auto' },
    // 次级 items 自动读取 typescript/config 目录
    { text: '配置', prefix: 'config', items: 'auto' },
  ],
})
```

### 自定义侧边栏配置

#### 基础配置类型

```ts
interface SidebarItem {
  text?: string // 显示文本
  link?: string // 链接地址
  icon?: ThemeIcon // 图标配置
  badge?: string | ThemeBadge // 徽章
  prefix?: string // 链接前缀
  items?: 'auto' | (string | SidebarItem)[] // 下一级侧边栏
  collapsed?: boolean // 折叠状态
}
```

#### 配置示例

**基础链接配置**：

采用简写形式，可以传入 md 文件的路径或 页面链接地址，
主题会自动读取文件的 `frontmatter` 配置作为侧边栏配置。

```ts
sidebar: [
  // 绝对路径时，
  // 在 themeConfig.sidebar 中是相对于 `key` 前缀的路径
  // 在 collection 中是相对于 `dir` 的路径
  '/guide/intro.md', // markdown 文件地址
  '/guide/getting-start/', // 页面链接地址
  '/config/config-file', // 可以省略 `.md` 后缀
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
    'intro', // → /guide/intro.md
    '/config/config-file', // → /config/config-file.md (绝对路径)
    { link: '/blog/' }, // → /guide/blog/
    { link: '/config/' } // → /config.md (绝对路径)
  ]
}
```

**路径判断规则**：

* 以 `/` 开头：绝对路径，不拼接 prefix
* 其他情况：相对路径，与 prefix 拼接

**多级嵌套示例**：

```ts
const sidebarItem: SidebarItem = {
  prefix: '/guide',
  items: [
    'intro', // → /guide/intro.md
    {
      prefix: '/config', // 绝对路径，抛弃上级的 prefix
      items: ['config-file'] // → /config/config-file.md
    },
    {
      prefix: 'blog', // 相对路径，拼接上级的 prefix
      items: ['intro'] // → /guide/blog/intro.md
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

* docs
  * .vuepress
    * public
      * images
        * guide.png
        * info.png
          :::

### 徽章功能&#x20;

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
