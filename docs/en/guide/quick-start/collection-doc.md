---
title: Doc Collection
icon: streamline-ultimate:sidebar-line-left
createTime: 2025/10/08 17:11:48
permalink: /en/guide/collection/doc/
---

## Overview

**Doc collections** are specifically designed for managing structured documentation,
suitable for scenarios where articles have strong relationships and need to be presented as a cohesive whole. Typical applications include:

- API technical documentation
- Product usage tutorials
- Thematic development guides
- Knowledge system notes

This collection enables quick navigation and content organization between documents through an **intelligent sidebar navigation system**.

::: info The theme supports configuring multiple independent doc collections
:::

## Creating a Doc Collection

Quickly create a documentation collection in three steps:

:::: steps

- **Create a documentation directory**

  ::: file-tree
  - docs
    - ++ guide
      - ++ intro.md
      - ++ install.md
      - ++ …
  :::

- **Configure collection parameters**

  ::: code-tabs#config

  @tab .vuepress/config.ts

  ```ts twoslash
  import { defineUserConfig } from 'vuepress'
  import { plumeTheme } from 'vuepress-theme-plume'

  export default defineUserConfig({
    theme: plumeTheme({
      collections: [ // [!code focus:3]
        { type: 'doc', dir: 'guide', title: 'Guide' }
      ]
    })
  })
  ```

  @tab .vuepress/plume.config.ts

  ```ts twoslash
  import { defineThemeConfig } from 'vuepress-theme-plume'

  export default defineThemeConfig({
    collections: [ // [!code focus:3]
      { type: 'doc', dir: 'guide', title: 'Guide' }
    ]
  })
  ```

  :::

- **Configuration Complete**
::::

### Multi-language Support

Configure independent documentation collections for different language versions:

::: file-tree

- docs
  - guide
    - intro.md
    - install.md
    - …
  - en
    - guide
      - intro.md
      - install.md
      - …
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
          { type: 'doc', dir: 'guide', title: 'Guide' }
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
        { type: 'doc', dir: 'guide', title: 'Guide' }
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

## Directory Structure Configuration

The `dir` parameter defines the source file location for documents, supporting both relative and absolute paths:

```ts
dir: 'guide' // Points to docs/guide
dir: '/guide/' // Equivalent syntax
dir: './guide/' // Equivalent syntax
dir: '/team/guide/' // Points to docs/team/guide
```

::: info In multi-language environments, paths are relative to the corresponding language directory
:::

## Auto Frontmatter Generation

::: info Only takes effect after executing `vuepress dev` or `vuepress build`
:::

Supports automatic generation of document metadata with customizable processing logic:

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
        title: 'Guide',
        // [!code hl:10]
        autoFrontmatter: {
          title: true, // Auto-generate title
          createTime: true, // Auto-generate creation time
          permalink: true, // Auto-generate permanent link
          transform: (data, context, locale) => { // Custom transformation
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

``` ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'doc',
      dir: 'guide',
      title: 'Guide',
      // [!code hl:10]
      autoFrontmatter: {
        title: true, // Auto-generate title
        createTime: true, // Auto-generate creation time
        permalink: true, // Auto-generate permanent link
        transform: (data, context, locale) => { // Custom transformation
          data.foo ??= 'foo'
          return data
        }
      }
    }
  ]
})
```

:::

Generation result:

```md title="docs/guide/install.md"
---
title: install
createTime: 2025/03/24 20:15:12
permalink: /guide/a1b2c3d4/
---
```

## Sidebar Configuration

Provides flexible sidebar navigation configuration options:

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
        title: 'Guide',
        // [!code hl:5]
        sidebar: [ // Manually configure navigation items
          'intro',
          'install',
        ],
        sidebarScrollbar: true, // Display sidebar scrollbar
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

``` ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'doc',
      dir: 'guide',
      title: 'Guide',
      // [!code hl:5]
      sidebar: [ // Manually configure navigation items
        'intro',
        'install',
      ],
      sidebarScrollbar: true, // Display sidebar scrollbar
    }
  ]
})
```

:::

### Auto-generated Sidebar

Set `sidebar: 'auto'` to automatically generate navigation based on directory structure:

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
        title: 'Guide',
        // [!code hl]
        sidebar: 'auto', // Auto-generate navigation structure
        sidebarCollapsed: undefined, // Collapse state: true-collapsed false-expanded
      }
    ]
  })
})
```

@tab .vuepress/plume.config.ts

``` ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    {
      type: 'doc',
      dir: 'guide',
      title: 'Guide',
      // [!code hl]
      sidebar: 'auto', // Auto-generate navigation structure
      sidebarCollapsed: undefined, // Collapse state: true-collapsed false-expanded
    }
  ]
})
```

:::

### Manual Sidebar Configuration

[View detailed **Sidebar** configuration instructions](./sidebar.md){.read-more}

## Collection Homepage Customization

The `README.md` file in the directory automatically serves as the collection homepage, supporting transformation into a feature-rich portal layout:

```md title="typescript/README.md"
---
pageLayout: home
config:
  - type: hero
    title: TypeScript Complete Guide
    description: TypeScript learning path from basics to advanced
  - type: features
    features:
      - title: Type System
        details: Deep understanding of TypeScript's type system
        icon: mdi:code-braces
      - title: Advanced Features
        details: Master generics, decorators, and other advanced features
        icon: mdi:rocket-launch
---
```
