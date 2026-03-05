---
url: /en/config/collections/index.md
---
## Overview

**Collections** are the core concept in the theme for organizing and managing documents.
Each collection points to a specific folder under the source directory, managing all Markdown files within it as a logical unit.

Through flexible collection configuration, you can easily build various content systems:

* **Blog** - Personal essays and technical shares
* **Column** - Thematic series articles
* **User Manual** - Product usage documentation
* **Notes** - Study notes and knowledge organization
* **Product Documentation** - Complete project documentation
* **Knowledge Base** - Team knowledge management system

Collections are primarily divided into two types to accommodate different content organization needs:

* **`post` type**: Suitable for fragmented content with weak inter-article relationships, such as blogs, columns, etc.
* **`doc` type**: Suitable for structured documentation with closely related content,
  such as user manuals, product documentation, knowledge bases, etc.

::: tip Configuration Location
Collection configuration can be done in either `.vuepress/config.ts` or the standalone `plume.config.ts` file.
:::

## Basic Configuration

Assume your project uses the following directory structure:

::: file-tree title="Project Structure"

* docs
  * **blog**
    * post-1.md
    * post-2.md
  * **typescript**
    * basic
      * intro.md
      * variable.md
    * types.md
      :::

The corresponding collection configuration example is as follows:

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // Collection Configuration // [!code focus:7]
    collections: [
      // Register post-type collection for blog functionality
      { type: 'post', dir: 'blog', title: 'Blog' },
      // Register doc-type collection for TypeScript documentation functionality
      { type: 'doc', dir: 'typescript', title: 'TypeScript Notes', sidebar: 'auto' }
    ],
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // Collection configuration in standalone config file // [!code focus:7]
  collections: [
    { type: 'post', dir: 'blog', title: 'Blog' },
    { type: 'doc', dir: 'typescript', title: 'TypeScript Notes', sidebar: 'auto' }
  ],
})
```

:::

## Multi-language Configuration

For multi-language projects, you can configure collections separately for each language within the `locales` field:

::: file-tree title="Multi-language Project Structure"

* docs
  * **blog/**
    * post-1.md
    * post-2.md
  * **typescript/**
    * basic
      * intro.md
      * variable.md
    * types.md
  * en
    * **blog/**
      * post-1.md
      * post-2.md
    * **typescript/**
      * basic
        * intro.md
        * variable.md
      * types.md
        :::

::: code-tabs#configs

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': {
        // Chinese collection configuration // [!code focus:4]
        collections: [
          { type: 'post', dir: 'blog', title: '博客' },
          { type: 'doc', dir: 'typescript', title: 'TypeScript笔记', sidebar: 'auto' }
        ],
      },
      '/en/': {
        // English collection configuration // [!code focus:4]
        collections: [
          { type: 'post', dir: 'blog', title: 'Blog' },
          { type: 'doc', dir: 'typescript', title: 'TypeScript Note', sidebar: 'auto' }
        ],
      }
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  locales: {
    '/': {
      // Chinese collection configuration // [!code focus:4]
      collections: [
        { type: 'post', dir: 'blog', title: '博客' },
        { type: 'doc', dir: 'typescript', title: 'TypeScript笔记', sidebar: 'auto' }
      ],
    },
    '/en/': {
      // English collection configuration // [!code focus:4]
      collections: [
        { type: 'post', dir: 'blog', title: 'Blog' },
        { type: 'doc', dir: 'typescript', title: 'TypeScript Note', sidebar: 'auto' }
      ],
    }
  }
})
```

:::

## Post Collection Details

Post collections are designed specifically for fragmented content like blogs and columns, providing a complete article management system:

### Core Features

* **Article List Page** - Supports article pinning, cover images, excerpt display, personal information, etc.
* **Article Categories Page** - Automatically generates categories based on directory structure
* **Article Tags Page** - Flexible tag management
* **Article Archives Page** - Organizes content by time dimension

### Configuration Example

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    // Blog collection configuration
    {
      type: 'post',
      dir: 'blog',
      title: 'Blog',
      link: '/blog/', // List page link
      linkPrefix: '/article/', // Article link prefix
      postCover: 'top', // Cover image position
      autoFrontmatter: { permalink: true }, // Auto frontmatter
    },
    // Interview column configuration
    {
      type: 'post',
      dir: 'interview',
      title: 'Interview Column',
      link: '/interview/', // List page link
    }
  ]
})
```

## Doc Collection Details

Doc collections are suitable for structured documentation, emphasizing logical relationships between content:

### Core Features

* **Sidebar Navigation** - Provides clear document structure navigation
* **Auto-generated Table of Contents** - Intelligently generates sidebar based on file structure
* **Multi-level Nesting Support** - Supports complex document hierarchy structures

### Configuration Example

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  collections: [
    // TypeScript Notes - Auto-generated sidebar
    {
      type: 'doc',
      dir: 'typescript',
      title: 'TypeScript Notes',
      sidebar: 'auto'
    },
    // Python Notes - Manually configured sidebar
    {
      type: 'doc',
      dir: 'python',
      title: 'Python Notes',
      sidebar: [
        { text: 'Basic Syntax', link: 'basic' },
        {
          text: 'API Documentation',
          items: [
            { text: 'asyncio', link: 'asyncio' }
          ]
        },
        'advanced' // Shorthand form
      ]
    }
  ]
})
```

## Configuration Type Declarations

### Base Collection Configuration

```ts
/* Collection configuration array */
type ThemeCollections = ThemeCollectionItem[]

/* Single collection item */
type ThemeCollectionItem = ThemePostCollection | ThemeDocCollection

/* Collection common configuration */
interface ThemeBaseCollection {
  /**
   * Collection type
   * - `post`: Article list (blog, column)
   * - `doc`: Structured documentation (notes, knowledge base)
   */
  type: 'post' | 'doc'
  /**
   * Document directory (relative to source directory)
   */
  dir: string
  /**
   * Article link prefix
   */
  linkPrefix?: string
  /**
   * Collection title (used for breadcrumb navigation)
   */
  title: string
  /**
   * Tag color theme
   * @default 'colored'
   */
  tagsTheme?: 'colored' | 'gray' | 'brand'
  /**
   * Auto-generate frontmatter
   */
  autoFrontmatter?: AutoFrontmatterOptions | false
}
```

### Post Collection Specific Configuration

```ts title="Post Collection Configuration"
interface ThemePostCollection extends ThemeBaseCollection {
  type: 'post'
  /**
   * Include file patterns (glob pattern)
   * @default ['**\/*.md']
   */
  include?: string[]
  /**
   * Exclude file patterns (glob pattern)
   * @default []
   */
  exclude?: string[]
  /**
   * Pagination configuration
   */
  pagination?: false | number | {
    /**
     * Number of articles per page
     * @default 15
     */
    perPage?: number
  }
  /**
   * Article list page link
   * @default '/{dir}/'
   */
  link?: string
  /**
   * Whether to enable article list page
   * @default true
   */
  postList?: boolean
  /**
   * Whether to enable tags page
   * @default true
   */
  tags?: boolean
  /**
   * Tags page link
   * @default '/{link}/tags/'
   */
  tagsLink?: string
  /**
   * Tags page text
   */
  tagsText?: string
  /**
   * Whether to enable archives page
   * @default true
   */
  archives?: boolean
  /**
   * Archives page link
   * @default '/{link}/archives/'
   */
  archivesLink?: string
  /**
   * Archives page text
   */
  archivesText?: string
  /**
   * Whether to enable categories feature
   * @default true
   */
  categories?: boolean
  /**
   * Categories page link
   * @default '/{link}/categories/'
   */
  categoriesLink?: string
  /**
   * Categories page text
   */
  categoriesText?: string
  /**
   * Categories expand depth
   * @default 'deep'
   */
  categoriesExpand?: number | 'deep'
  /**
   * Categories list transformation function
   */
  categoriesTransform?: (categories: PostsCategoryItem[]) => PostsCategoryItem[]
  /**
   * Article cover image configuration
   * @default 'right'
   */
  postCover?: PostsCoverLayout | PostsCoverStyle
  /**
   * Profile configuration
   */
  profile?: ProfileOptions | false
  /**
   * Social account configuration
   */
  social?: SocialLink[] | false
}
/* Article category item */
interface PostsCategoryItem {
  id: string
  sort: number
  name: string
}
/* Cover image layout */
type PostsCoverLayout = 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
/* Cover image style */
interface PostsCoverStyle {
  layout?: PostsCoverLayout
  ratio?: number | `${number}:${number}` | `${number}/${number}`
  width?: number
  compact?: boolean
}
/* Social link icon */
type SocialLinkIcon = SocialLinkIconUnion | { svg: string, name?: string }
/* Social link */
interface SocialLink {
  icon: SocialLinkIcon
  link: string
  ariaLabel?: string
}

/**
 * Profile
 */
export interface ProfileOptions {
  /**
   * Avatar image URL
   */
  avatar?: string
  /**
   * Name
   */
  name?: string
  /**
   * Description / Bio / Motto / Signature
   */
  description?: string
  /**
   * Whether to display as circular avatar
   */
  circle?: boolean
  /**
   * Location
   */
  location?: string
  /**
   * Organization, Company
   */
  organization?: string
  /**
   * Layout position, left or right
   * @default 'right'
   */
  layout?: 'left' | 'right'
}
```

### Doc Collection Specific Configuration

```ts title="Doc Collection Configuration"
interface ThemeDocCollection extends ThemeBaseCollection {
  type: 'doc'
  /**
   * Sidebar configuration
   */
  sidebar?: 'auto' | (string | ThemeSidebarItem)[]
  /**
   * Whether to show sidebar scrollbar
   * @default true
   */
  sidebarScrollbar?: boolean
  /**
   * Sidebar default collapsed state
   * @default false
   */
  sidebarCollapsed?: boolean
}

/* Sidebar item configuration */
interface ThemeSidebarItem {
  text?: string
  link?: string
  icon?: ThemeIcon
  badge?: string | ThemeBadge
  items?: 'auto' | (string | ThemeSidebarItem)[]
  collapsed?: boolean
  prefix?: string
  rel?: string
  target?: string
}

/* Icon type */
type ThemeIcon = string | { svg: string }

/* Badge configuration */
export interface ThemeBadge {
  text?: string
  type?: string
  color?: string
  bgColor?: string
  borderColor?: string
}
```

### Auto Sidebar Generation

When the Doc collection's `sidebar` is set to `'auto'`, the system automatically generates sidebar
navigation based on the directory structure. The sorting rules follow the [Folder Naming Conventions](../guide/quick-start/write.md#folder-naming-conventions).

### Sidebar Icon Configuration

The theme supports two methods for configuring sidebar icons:

* **Define directly in sidebar configuration**:

  ```ts
  sidebar: [
    { text: 'Introduction', link: 'intro', icon: 'mdi:tooltip-text-outline' }
  ]
  ```

* **Define in document frontmatter**:

  ```md
  ---
  title: Theme Introduction
  icon: mdi:tooltip-text-outline
  ---
  ```

Both methods have the same effect, and you can choose which to use based on specific scenarios.

For complete sidebar configuration options and usage tips, please refer to the [Sidebar Configuration Guide](../guide/quick-start/sidebar.md).
