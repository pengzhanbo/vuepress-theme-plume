---
url: /guide/collection/doc/index.md
---
## 概述

**doc 集合**专为管理结构化文档而设计，适用于文章间存在强关联关系、需要整体呈现的场景。典型应用包括：

* API 技术文档
* 产品使用教程
* 专题开发指南
* 知识体系笔记

该集合通过**智能侧边导航栏**实现文档间的快速跳转与内容组织。

::: info 主题支持配置多个独立的 doc 集合
:::

## 创建 doc 集合

通过三个步骤快速创建文档集合：

:::: steps

* **创建文档目录**

  ::: file-tree

  * docs
    * ++ guide
      * ++ intro.md
      * ++ install.md
      * ++ …
        :::

* **配置集合参数**

  ::: code-tabs#config

  @tab .vuepress/config.ts

  ```ts twoslash
  import { defineUserConfig } from 'vuepress'
  import { plumeTheme } from 'vuepress-theme-plume'

  export default defineUserConfig({
    theme: plumeTheme({
      collections: [ // [!code focus:3]
        { type: 'doc', dir: 'guide', title: '指南' }
      ]
    })
  })
  ```

  @tab .vuepress/plume.config.ts

  ```ts twoslash
  import { defineThemeConfig } from 'vuepress-theme-plume'

  export default defineThemeConfig({
    collections: [ // [!code focus:3]
      { type: 'doc', dir: 'guide', title: '指南' }
    ]
  })
  ```

  :::

* **完成配置**
  ::::

### 多语言支持

为不同语言版本配置独立的文档集合：

::: file-tree

* docs
  * guide
    * intro.md
    * install.md
    * …
  * en
    * guide
      * intro.md
      * install.md
      * …
        :::

::: code-tabs#config

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': { // [!code focus:5]
        collections: [
          { type: 'doc', dir: 'guide', title: '指南' }
        ]
      },
      '/en/': { // [!code focus:5]
        collections: [
          { type: 'doc', dir: 'guide', title: 'Guide' }
        ]
      }
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  locales: {
    '/': { // [!code focus:5]
      collections: [
        { type: 'doc', dir: 'guide', title: '指南' }
      ]
    },
    '/en/': { // [!code focus:5]
      collections: [
        { type: 'doc', dir: 'guide', title: 'Guide' }
      ]
    }
  }
})
```

:::

## 目录结构配置

`dir` 参数定义文档源文件位置，支持相对和绝对路径：

```ts
dir: 'guide' // 指向 docs/guide
dir: '/guide/' // 等效写法
dir: './guide/' // 等效写法
dir: '/team/guide/' // 指向 docs/team/guide
```

::: info 多语言环境下路径相对于对应的语言目录
:::

## 自动 Frontmatter 生成

::: info 仅在执行 `vuepress dev` 或 `vuepress build` 后生效
:::

支持自动生成文档元数据，可自定义处理逻辑：

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'doc',
        dir: 'guide',
        title: '指南',
        // [!code hl:10]
        autoFrontmatter: {
          title: true, // 自动生成标题
          createTime: true, // 自动生成创建时间
          permalink: true, // 自动生成永久链接
          transform: (data, context, locale) => { // 自定义转换
            data.foo ??= 'foo'
            return data
          }
        }
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'doc',
      dir: 'guide',
      title: '指南',
      // [!code hl:10]
      autoFrontmatter: {
        title: true, // 自动生成标题
        createTime: true, // 自动生成创建时间
        permalink: true, // 自动生成永久链接
        transform: (data, context, locale) => { // 自定义转换
          data.foo ??= 'foo'
          return data
        }
      }
    }
  ]
})
```

:::

生成效果：

```md title="docs/guide/install.md"
---
title: install
createTime: 2025/03/24 20:15:12
permalink: /guide/a1b2c3d4/
---
```

## 文章元数据

在集合中通过 `meta` 选项，可以设置文章元数据的显示方式：

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'doc',
        dir: 'guide',
        title: '指南',
        // [!code hl:11]
        meta: {
          tags: true, // 是否显示标签
          /**
           * 是否显示创建时间，或设置时间格式
           * - 'short': 显示为 `2022-01-01`，默认
           * - 'long': 显示为 `2022-01-01 00:00:00`
           */
          createTime: true, // boolean | 'short' | 'long'
          readingTime: true, // 是否显示阅读时间估算
          wordCount: true, // 是否显示字数统计
        }
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'doc',
      dir: 'guide',
      title: '指南',
      // [!code hl:11]
      meta: {
        tags: true, // 是否显示标签
        /**
         * 是否显示创建时间，或设置时间格式
         * - 'short': 显示为 `2022-01-01`，默认
         * - 'long': 显示为 `2022-01-01 00:00:00`
         */
        createTime: true, // boolean | 'short' | 'long'
        readingTime: true, // 是否显示阅读时间估算
        wordCount: true, // 是否显示字数统计
      }
    }
  ]
})
```

:::

在 markdown 中，通过 frontmatter 配置文章元数据：

```md
---
title: 文章标题
createTime: 2024/01/01 00:00:00
tags:
  - tag1
  - tag2
---
```

`title` 和 `createTime` 在文件创建时自动生成，支持手动修改。

### 可用属性

| 属性       | 类型                | 默认值   | 说明                       |
| ---------- | ------------------- | -------- | -------------------------- |
| title      | `string`            | 文件名   | 文章标题                   |
| createTime | `string`            | 当前时间 | 创建时间                   |
| tags       | `string[]`          | `[]`     | 文章标签                   |

同时支持[通用 frontmatter 配置](../../config/frontmatter/basic.md)中的所有字段。

## 侧边栏配置

提供灵活的侧边栏导航配置选项：

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'doc',
        dir: 'guide',
        title: '指南',
        // [!code hl:5]
        sidebar: [ // 手动配置导航项
          'intro',
          'install',
        ],
        sidebarScrollbar: true, // 显示侧边栏滚动条
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'doc',
      dir: 'guide',
      title: '指南',
      // [!code hl:5]
      sidebar: [ // 手动配置导航项
        'intro',
        'install',
      ],
      sidebarScrollbar: true, // 显示侧边栏滚动条
    }
  ]
})
```

:::

### 自动生成侧边栏

设置 `sidebar: 'auto'` 自动基于目录结构生成导航：

::: code-tabs#config

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'doc',
        dir: 'guide',
        title: '指南',
        // [!code hl]
        sidebar: 'auto', // 自动生成导航结构
        sidebarCollapsed: undefined, // 折叠状态：true-折叠 false-展开
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'doc',
      dir: 'guide',
      title: '指南',
      // [!code hl]
      sidebar: 'auto', // 自动生成导航结构
      sidebarCollapsed: undefined, // 折叠状态：true-折叠 false-展开
    }
  ]
})
```

:::

### 手动配置侧边栏

[查看**侧边栏**详细配置说明](./sidebar.md){.read-more}

## 集合首页定制

目录下的 `README.md` 自动作为集合首页，支持转换为功能丰富的门户布局：

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
