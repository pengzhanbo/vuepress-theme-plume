---
url: /en/blog/dk58a4t2/index.md
---
:::important
‼️ This update is a BREAKING CHANGE! The blog and notes features have been entirely migrated to a new "Collections" architecture. ‼️
:::

## Design Motivation: Why Introduce "Collections"?

[Jump to Migration Guide 👇👇👇](#migration-guide){.read-more}

### Background & Problem Analysis

The theme initially only supported the **blog** feature, treating all Markdown files under the `docs`
source directory as blog posts. As the version iterated, we added the **notes/knowledge base** feature,
defaulting the `notes` directory as the root for notes and excluding its content from the blog list.

This phased implementation led to an **architectural imbalance**: the blog became a "first-class citizen,"
while the notes feature appeared marginalized. This caused the following issues for users:

* **Path Redundancy**: Note files had to be stored under the `notes/` directory, adding unnecessary directory levels.
* **Complex Links**: When `autoFrontmatter` was not enabled, URLs were forced to include the `/notes/` prefix.
* **Conceptual Confusion**: Users were often confused about the functional difference between "notes" and "docs."
* **Cumbersome Configuration**: Extra adjustments to the `notes.dir` configuration were needed to achieve a standard documentation site structure.

These design flaws were legacy issues from historical iterations, and we sincerely apologize for the inconvenience.

### Solution: Unified Content Abstraction

After researching mainstream static site generators (like Hugo, VitePress) and full-stack frameworks
(like Nuxt), we drew inspiration from the `collection` concept in `@nuxt/content`.

We decided to introduce **Collections** as a unified unit for content organization. Whether it's a blog,
notes, documentation, or a knowledge base, they are essentially specific collections of Markdown files, differing only in their presentation.

:::important
Core Insight: Use the "Collection" abstraction to unify the organization of various content types while preserving their respective display characteristics.
:::

Based on content characteristics, we defined two collection types:

* **`post` type**: Suitable for fragmented, loosely related content (e.g., blogs, columns), providing an article list as a navigation entry.
* **`doc` type**: Suitable for structured, strongly related content (e.g., documentation, manuals), providing a sidebar for quick navigation.

This design solves the historical architectural problems and lays the foundation for extending more content types in the future.

## Migration Guide

### Core Concepts

* **Collection**: Specified via `collection.dir`; all Markdown files under this directory belong to the collection.
* **Collection Type**:
  * `post`: Fragmented content, supports article list navigation.
  * `doc`: Structured content, supports sidebar navigation.

### Configuration Migration

Replace the original `blog` and `notes` configurations:

```ts twoslash
// @noErrors
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // [!code --:9]
    // Remove old blog and notes configuration
    blog: { /* Blog configuration */ },
    notes: {
      link: '/',
      dir: '/notes/',
      notes: [
        { dir: 'typescript', link: '/typescript/', sidebar: 'auto' }
      ]
    },
    // [!code ++:17]
    // Use collections configuration
    collections: [
      {
        type: 'post', // Replaces original blog functionality
        dir: 'blog', // Points to docs/blog directory
        title: 'Blog' // Collection display name
        // Original blog configuration continues here
        // ...
      },
      {
        type: 'doc', // Replaces original notes functionality
        dir: 'typescript', // Points to docs/typescript directory
        title: 'TypeScript Notes',
        linkPrefix: '/typescript/', // Page link prefix, sidebar judgment basis
        sidebar: 'auto', // Auto-generate sidebar
      },
    ]
  })
})
```

### Directory Structure Adjustment

Migrate files according to the following steps:

**Procedure:**

1. Move subdirectories under the `notes` directory directly to the `docs` root directory.
2. Create a `blog` directory and move original blog posts into it.
3. Remove the now-empty `notes` directory.

:::: flex

::: file-tree title="Pre-migration Structure"

* docs
  * \-- notes
    * typescript
      * basic.md
      * advanced.md
  * blog-cate-1
    * post-1.md
  * blog-cate-2
    * post-2.md
  * blog-post.md
  * README.md
    :::

:::file-tree title="Post-migration Structure"

* docs
  * typescript
    * basic.md
    * advanced.md
  * ++ blog
    * blog-cate-1
      * post-1.md
    * blog-cate-2
      * post-2.md
    * blog-post.md
  * README.md

:::

::::

### Helper Functions

* `defineCollection`: Helper function for defining a single collection configuration.
* `defineCollections`: Helper function for defining multiple collection configurations.

```ts twoslash
import { defineCollection, defineCollections } from 'vuepress-theme-plume'

export const blog = defineCollection({
  type: 'post',
  dir: 'blog',
  title: 'Blog'
})

export const typescript = defineCollection({
  type: 'doc',
  dir: 'typescript',
  title: 'TypeScript Notes',
  sidebar: 'auto'
})

export const collections = defineCollections([
  blog,
  typescript
])
```

## Detailed Documentation

[Collections Documentation](../../guide/quick-start/collection.md){.read-more}

[Post Collection](../../guide/quick-start/collection-post.md){.read-more}

[Doc Collection](../../guide/quick-start/collection-doc.md){.read-more}
