---
url: /en/config/sidebar/index.md
---
## Overview

The sidebar is a core navigation area located on the left side of the page in the theme,
serving the important function of guiding users to jump between different pages.

In the VuePress ecosystem, the default theme `@vuepress/theme-default` manages the sidebar through
the `sidebar` configuration option. While retaining this classic configuration method,
this theme also provides a more flexible collection-level sidebar configuration solution.

## Collection-Level Sidebar Configuration

Collections are the core concept for organizing series of documents in the theme.
When a collection type is set to `doc`, you can define a dedicated sidebar navigation within `collection.sidebar`.

The following example demonstrates how to create a collection of type `doc` under the `docs` directory and configure its sidebar:

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { defineCollection, plumeTheme } from 'vuepress-theme-plume'

// Define document collection configuration // [!code hl:10]
const demo = defineCollection({
  type: 'doc',
  dir: 'demo', // Document directory
  title: 'Demo', // Collection name
  sidebar: [ // Sidebar configuration // [!code ++:4]
    { text: 'one item', link: 'one' },
    { text: 'two item', link: 'two' },
  ]
})

export default defineUserConfig({
  theme: plumeTheme({
    collections: [demo], // Register collection // [!code hl]
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineCollection, defineThemeConfig } from 'vuepress-theme-plume'

// Define collection using independent config file // [!code hl:10]
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

The `defineCollection` utility function provided by the theme simplifies the collection configuration
process. For complete collection configuration options, please refer to the [Collections Configuration Documentation](./collections.md).

## Global Sidebar Configuration

If you prefer to manage the sidebar using the traditional global configuration approach,
you can directly use the `sidebar` option in the theme configuration.
This method is suitable for scenarios that do not require navigation grouping by collections.

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // Global sidebar configuration // [!code hl:7]
    sidebar: {
      '/config/': [ // Matches /config/ path
        { text: 'Sidebar Configuration', link: 'sidebar-1' },
        { text: 'Sidebar Configuration', link: 'sidebar-2' },
      ]
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // Define global sidebar in independent config file // [!code hl:7]
  sidebar: {
    '/config/': [
      { text: 'Sidebar Configuration', link: 'sidebar-1' },
      { text: 'Sidebar Configuration', link: 'sidebar-2' },
    ]
  }
})
```

:::

Both configuration methods have their advantages: collection-level configuration is suitable for
modular document structures, while global configuration is convenient for unified navigation management in simple projects.

For complete sidebar configuration options and usage tips, please refer to the [Sidebar Configuration Guide](../guide/quick-start/sidebar.md).
