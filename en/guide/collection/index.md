---
url: /en/guide/collection/index.md
---
## Overview

\==Collections== are a core concept in the theme for organizing and managing documents.
Each collection points to a specific folder in the source directory,
treating all Markdown files within it as a logical unit for management.

Through flexible collection configuration, you can easily build various content architectures:

* **Blog** - Personal essays and technical sharing
* **Column** - Thematic series articles
* **User Manual** - Product usage documentation
* **Notes** - Study notes and knowledge organization
* **Product Documentation** - Complete project documentation
* **Knowledge Base** - Team knowledge management system
* And more...

## Creating a Collection

A typical VuePress static site has the following file structure:

:::file-tree

* my-site
  * docs # Source directory
    * .vuepress/
    * …
    * README.md # Homepage
  * package.json

:::

When you want to add a collection for a **blog**:

:::: steps

* **Create a blog directory**

  :::file-tree

  * docs
    * blog
      * post-1.md
      * post-2.md
      * …
    * …
      :::

* **Add a collection of type `post` in the theme configuration**

  Set the `dir` configuration option to point to the `blog` directory

  ::: code-tabs#config

  @tab .vuepress/config.ts

  ```ts twoslash
  import { defineUserConfig } from 'vuepress'
  import { plumeTheme } from 'vuepress-theme-plume'

  export default defineUserConfig({
    theme: plumeTheme({
      collections: [
        // [!code word:type]
        { type: 'post', dir: 'blog', title: 'Blog' } // [!code word:dir]
      ]
    })
  })
  ```

  @tab .vuepress/plume.config.ts

  ```ts twoslash
  import { defineThemeConfig } from 'vuepress-theme-plume'

  export default defineThemeConfig({
    collections: [
      // [!code word:type]
      { type: 'post', dir: 'blog', title: 'Blog' } // [!code word:dir]
    ]
  })
  ```

  :::

  Markdown articles in the `blog` directory are read as article lists in the post collection,
  generating list pages, category pages, tag pages, and other pages.

* **Complete**
  ::::

Key considerations in this process:

* **`dir` Configuration Option**

  The `dir` option in the collection configuration points to a specific folder in the source directory.
  All Markdown files within this folder will belong to the collection.

* **`type` Configuration Option**

  The `type` option in the collection configuration specifies the collection type.

  The collection type determines which features are provided for documents within that collection. Currently supported types include:

  * `post`: Represents a collection of fragmented articles with no or weak relationships between them.
  * `doc`: Represents a collection of structured articles with strong, structured relationships between them, treated as a whole.

* **`title` Configuration Option**

  The `title` option in the collection configuration specifies the collection name.

  In the theme, `title` is used in the breadcrumb navigation of pages.

## Collection Types

The collection type determines which features are provided for documents within that collection.

::: details About Frontmatter
The **frontmatter** mentioned in the table below refers to the YAML format metadata at the top of a Markdown file,
used to configure the page's title, creation time, tags, categories, and other information. It is wrapped by three dashes `---`, for example:

```md title="frontmatter"
---
title: Article Title
createTime: 2024-01-01
tags:
  - Tag1
  - Tag2
---

Content...
```

The theme supports automatic frontmatter generation. See [Auto Frontmatter](./auto-frontmatter.md) for details.
:::

| Feature             | Post Collection                                | Doc Collection                                          |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| Use Case            | Blogs, essays, fragmented articles             | Documentation, tutorial series, knowledge bases         |
| Article List Page   | ✅ Auto-generated                              | ❌ Not generated                                        |
| Category Page       | ✅ Generated from directory structure          | ❌ Not generated                                        |
| Tag Page            | ✅ Generated from frontmatter.tags             | ❌ Not generated                                        |
| Archive Page        | ✅ Generated from createTime                   | ❌ Not generated                                        |
| Sidebar             | ❌ Not generated                               | ✅ Auto-generated or manually configured                |
| Directory Structure | Flat, no strong relationships between articles | Hierarchical, structured relationships between articles |
| Auto Frontmatter    | ✅ Supports title, createTime, etc.            | ✅ Supports title, createTime, etc.                     |

### Post Collection

The post collection provides the following feature implementations:

* Article list page - Article pinning, article cover images, article excerpts, etc.
* Article category page - Categories are automatically generated based on the directory structure.
* Article tag page - Tags are generated based on the page's `frontmatter.tags`.
* Article archive page - Archives are generated based on the page's `frontmatter.createTime`.

### Doc Collection

The doc collection provides the following feature implementations:

* **Sidebar Navigation** - Provides clear document structure navigation
* **Auto-generated Table of Contents** - Intelligently generates sidebars based on file structure
* **Multi-level Nesting Support** - Supports complex document hierarchy structures

::: warning Deprecated
The `notes` configuration option from the old version has been deprecated.
Please use the `collections` configuration instead. `notes` will be removed in a future major version.

The directories and note structures in the `notes` configuration can be migrated to the `doc` type collection in
`collections`. Refer to [Collection Configuration](./collection.md) for more details.
:::

## Collection Configuration
