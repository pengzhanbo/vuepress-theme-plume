---
url: /config/sidebar/index.md
---
## 概述

侧边栏是主题中位于页面最左侧的核心导航区域，承担着引导用户在不同页面间跳转的重要功能。

在 VuePress 生态中，默认主题 `@vuepress/theme-default` 通过 `sidebar` 配置项管理侧边栏。本主题在保留这一经典配置方式的基础上，还提供了更为灵活的集合（Collections）级侧边栏配置方案。

## 集合级侧边栏配置

集合（Collections）是主题中组织系列文档的核心概念。当集合类型设置为 `doc` 时，您可以在 `collection.sidebar` 中定义专属的侧边栏导航。

以下示例展示了如何在 `docs` 目录下创建类型为 `doc` 的集合，并配置其侧边栏：

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { defineCollection, plumeTheme } from 'vuepress-theme-plume'

// 定义文档集合配置 // [!code hl:10]
const demo = defineCollection({
  type: 'doc',
  dir: 'demo', // 文档目录
  title: 'Demo', // 集合名称
  sidebar: [ // 侧边栏配置 // [!code ++:4]
    { text: 'one item', link: 'one' },
    { text: 'two item', link: 'two' },
  ]
})

export default defineUserConfig({
  theme: plumeTheme({
    collections: [demo], // 注册集合 // [!code hl]
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineCollection, defineThemeConfig } from 'vuepress-theme-plume'

// 使用独立配置文件定义集合 // [!code hl:10]
const demo = defineCollection({
  type: 'doc',
  dir: 'demo',
  title: 'Demo',
  sidebar: [
    { text: 'one item', link: 'one' },
    { text: 'two item', link: 'two' },
  ]
})

export default defineThemeConfig({
  collections: [demo], // [!code hl]
})
```

:::

主题提供的 `defineCollection` 工具函数简化了集合配置过程。如需了解完整的集合配置选项，请参阅[集合配置文档](./collections.md)。

## 全局侧边栏配置

如果您希望采用传统的全局配置方式管理侧边栏，可以直接在主题配置中使用 `sidebar` 选项。这种方式适合不需要按集合分组导航的场景。

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 全局侧边栏配置 // [!code hl:7]
    sidebar: {
      '/config/': [ // 匹配/config/路径
        { text: '侧边栏配置', link: 'sidebar-1' },
        { text: '侧边栏配置', link: 'sidebar-2' },
      ]
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // 在独立配置文件中定义全局侧边栏 // [!code hl:7]
  sidebar: {
    '/config/': [
      { text: '侧边栏配置', link: 'sidebar-1' },
      { text: '侧边栏配置', link: 'sidebar-2' },
    ]
  }
})
```

:::

两种配置方式各有优势：集合级配置适合模块化文档结构，全局配置则便于统一管理简单项目的导航。

如需了解侧边栏的完整配置选项和使用技巧，请参阅[侧边栏配置指南](../guide/quick-start/sidebar.md)。
