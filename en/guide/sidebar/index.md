---
url: /en/guide/sidebar/index.md
---
## Overview

Sidebar is a common page navigation method in documentation, enabling quick positioning to document content.

The theme provides two ways to configure the sidebar:

* Configure sidebar through the `sidebar` option in theme configuration
* Configure sidebar in [collections of type `doc`](./collection-doc.md)

## File Structure and Basic Configuration

### Directory Structure Design

A typical project structure might look like:

::: file-tree

* docs
  * typescript     # TypeScript Study Notes
    * basic.md
    * types.md
  * rust           # Rust Programming Notes
    * tuple.md
    * struct.md
  * README.md        # Site Homepage
    :::

### Configuration via `sidebar`

This approach is suitable for simple and compact documentation sites.

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

### Configuration via `collection`&#x20;

`collections` can flexibly organize and manage different categories of documents within a site. This approach is suitable for complex sites.

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
        title: 'TypeScript Notes',
        sidebar: ['basic', 'types'],
      },
      {
        type: 'doc',
        dir: 'rust',
        linkPrefix: '/rust/',
        title: 'Rust Notes',
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
      title: 'TypeScript Notes',
      sidebar: ['basic', 'types'],
    },
    {
      type: 'doc',
      dir: 'rust',
      linkPrefix: '/rust/',
      title: 'Rust Notes',
      sidebar: ['tuple', 'struct'],
    }
  ],
})
```

:::

::: tip Configuration Timing Recommendation
Complete the collection configuration before creating document files.
The theme's [auto-frontmatter](../../config/theme.md#autofrontmatter) feature will automatically
generate permanent links and sidebar structures based on the configuration.
:::

## Advanced Configuration Management

### Modular Configuration Solution

For complex projects, it's recommended to use the type-safe configuration tools provided by the theme:

::: code-tabs

@tab .vuepress/collections.ts

```ts twoslash
import { defineCollection, defineCollections } from 'vuepress-theme-plume'

// Single collection configuration
const typescript = defineCollection({
  type: 'doc',
  dir: 'typescript',
  title: 'TypeScript Notes',
  linkPrefix: '/typescript/',
  sidebar: [
    'guide/intro.md',
    'guide/getting-start.md',
    'config/config-file.md',
  ]
})

// Export all collection configurations
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

### Large Project Configuration Splitting

When dealing with numerous collections, a modular configuration structure can be adopted:

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

Configuration code organization example:

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
  title: 'TypeScript Notes',
  sidebar: [
    'guide/intro.md',
    'guide/getting-start.md',
    'config/config-file.md',
  ]
})
```

:::

## Sidebar Configuration Details

### File Structure Example

Assume the TypeScript Notes contain the following structure:

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

### Auto-generated Sidebar

The simplest configuration uses auto-generation:

```ts
import { defineCollection } from 'vuepress-theme-plume'

export default defineCollection({
  type: 'doc',
  dir: 'typescript',
  sidebar: 'auto' // Auto-generate sidebar // [!code ++]
})
```

The theme automatically configures the sidebar based on the directory structure.

**Sorting Control**: Manage display order through numeric prefixes

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

Numeric prefixes are used only for sorting and are not displayed in the sidebar.

**Auto-collapse**: By default, the sidebar does not auto-collapse. You can enable auto-collapse by configuring `sidebarCollapsed`:

```ts
import { defineCollection } from 'vuepress-theme-plume'

export default defineCollection({
  type: 'doc',
  dir: 'typescript',
  sidebar: 'auto',
  sidebarCollapsed: true, // [!code ++]
})
```

`sidebarCollapsed` has the following optional values:

* `undefined`: Default, no auto-collapse
* `true`: Default all collapsed
* `false`: Default all expanded

### Auto-generated Sub-sidebar

For more flexible sidebar control and reduced configuration complexity, the theme allows configuring only auto-generated sub-sidebars:

```ts
import { defineCollection } from 'vuepress-theme-plume'

export default defineCollection({
  type: 'doc',
  dir: 'typescript',
  sidebar: [
    // Sub-items automatically read the typescript/guide directory
    { text: 'Guide', prefix: 'guide', items: 'auto' },
    // Sub-items automatically read the typescript/config directory
    { text: 'Configuration', prefix: 'config', items: 'auto' },
  ],
})
```

### Custom Sidebar Configuration

#### Basic Configuration Types

```ts
interface SidebarItem {
  text?: string // Display text
  link?: string // Link address
  icon?: ThemeIcon // Icon configuration
  badge?: string | ThemeBadge // Badge
  prefix?: string // Link prefix
  items?: 'auto' | (string | SidebarItem)[] // Next level sidebar
  collapsed?: boolean // Collapse state
}
```

#### Configuration Examples

**Basic Link Configuration**:

Using shorthand form, you can pass markdown file paths or page link addresses.
The theme automatically reads the file's `frontmatter` configuration for sidebar settings.

```ts
sidebar: [
  // For absolute paths:
  // In themeConfig.sidebar, paths are relative to the `key` prefix
  // In collections, paths are relative to `dir`
  '/guide/intro.md', // Markdown file path
  '/guide/getting-start/', // Page link address
  '/config/config-file', // Can omit `.md` extension
]
```

**Complete Object Configuration**:

```ts
sidebar: [
  { text: 'Introduction', link: '/guide/intro' },
  { text: 'Quick Start', link: '/guide/getting-start' },
]
```

**Nested Group Configuration**:

```ts
sidebar: [
  {
    text: 'Guide',
    prefix: '/guide',
    items: [
      { text: 'Introduction', link: 'intro' },
      'getting-start', // Shorthand form
    ],
  },
  {
    text: 'Configuration',
    prefix: '/config',
    items: 'auto', // Auto-generate sidebar for this group
  },
]
```

### Prefix Path Processing Rules

`prefix` is used to simplify link configurations with the same prefix:

```ts
const sidebarItem: SidebarItem = {
  prefix: '/guide',
  items: [
    'intro', // → /guide/intro.md
    '/config/config-file', // → /config/config-file.md (absolute path)
    { link: '/blog/' }, // → /guide/blog/
    { link: '/config/' } // → /config.md (absolute path)
  ]
}
```

**Path Judgment Rules**:

* Starts with `/`: Absolute path, does not concatenate prefix
* Other cases: Relative path, concatenated with prefix

**Multi-level Nesting Example**:

```ts
const sidebarItem: SidebarItem = {
  prefix: '/guide',
  items: [
    'intro', // → /guide/intro.md
    {
      prefix: '/config', // Absolute path, discards parent prefix
      items: ['config-file'] // → /config/config-file.md
    },
    {
      prefix: 'blog', // Relative path, concatenates with parent prefix
      items: ['intro'] // → /guide/blog/intro.md
    }
  ]
}
```

::: warning Depth Limitation
Avoid sidebar configurations with more than 3 levels of nesting, as excessive depth affects user experience and interface aesthetics.
:::

## Visual Enhancement Features

### Icon Configuration

Supports multiple icon sources, configured via `markdown.icon.provide`:

```ts
sidebar: [
  {
    text: 'Guide',
    prefix: '/guide',
    icon: 'ep:guide', // Iconify icon
    items: [
      { text: 'Introduction', link: 'intro', icon: 'ph:info-light' },
    ],
  },
]
```

**Local Icon Configuration**:

```ts
const sidebarItem: SidebarItem = {
  text: 'Guide',
  icon: '/images/guide.png', // Local image
  items: [
    {
      text: 'Introduction',
      icon: 'https://example.com/icon.png' // Remote image
    },
  ]
}
```

::: important Local Resource Paths
Local image paths should start with `/` and correspond to the `.vuepress/public/` directory:

::: file-tree

* docs
  * .vuepress
    * public
      * images
        * guide.png
        * info.png
          :::

### Badge Feature&#x20;

Provide additional information hints through badges:

```ts
sidebar: [
  {
    text: 'Guide',
    badge: { text: 'New', type: 'danger' }, // Object form
    items: [
      { text: 'Introduction', badge: 'Recommended' }, // String shorthand
    ],
  },
]
```

**Frontmatter Configuration**:

```md
---
title: Introduction
badge:
  text: New Feature
  type: danger
---
```

### Group Separators

Add visual separation in complex sidebars:

```ts
sidebar: [
  {
    text: 'Guide',
    items: [
      'Item 1',
      'Item 2',
      { text: 'Advanced Features', link: '---' }, // Separator
      'Item 3',
      'Item 4',
    ],
  },
]
```

**Separator Characteristic**: The `link` field contains at least three consecutive `-` characters
