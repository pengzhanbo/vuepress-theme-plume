---
url: /en/guide/write/index.md
---
VuePress fully supports [Standard Markdown Syntax](../markdown/basic.md),
while also allowing page metadata (such as title, creation time, etc.) to be defined via Frontmatter
in [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) format.

Additionally, the theme provides extensive [Markdown Extended Syntax](../markdown/extensions.md).
You can not only write HTML directly in Markdown but also use Vue components to enhance content expressiveness.

## Frontmatter Page Configuration

Frontmatter allows you to customize the properties and behavior of each page.
Frontmatter is located at the top of the file, enclosed by `---` delimiters.

```md title="post.md"
<!--[!code ++:5]-->
---
title: Article Title
createTime: 2024/09/08 22:53:34
permalink: /article/9eh4d6ao/
---

Page content starts after the second `---`.
```

::: details What is Frontmatter?
Frontmatter is a configuration block using
[YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) format, located at the top of a Markdown file and delimited by `---`.

It is recommended to read the [Frontmatter Detailed Guide](../../../../4.教程/frontmatter.md) for the complete syntax specification.
:::

## Automatic Frontmatter Generation

After the development server starts, the theme automatically generates necessary Frontmatter fields for
Markdown files in the documentation source directory, including: **title**, **creation time**, and **permalink**.

This feature reduces the repetitive workload for content creators and provides essential data support for the theme's subsequent functionalities.

```md
---
title: Title
createTime: 2024/09/08 22:53:34
permalink: /article/9eh4d6ao/
---
```

### Title Generation Rules

The theme uses the filename as the article title by default. During parsing, the sequence number and
extension from the [File Naming Convention](#file-naming-convention) are automatically removed.
For example, `1.my-article.md` will generate the title `my-article`.

### Creation Time

The theme uses the file's creation time as the baseline, formatted as `yyyy/MM/dd HH:mm:ss`, to serve as the article creation time.

### Permalink

The **permalink** is the fixed access URL for the article after publication.
Once generated, this link remains constant even if the file path or name changes.

Setting the permalink in advance helps:

* Improve **SEO effectiveness** by avoiding frequent changes to indexed URLs
* Maintain **consistency** in the site's overall link style

### Disabling Automatic Generation

If full manual control over Frontmatter is required, automatic generation can be disabled via [Theme Configuration > autoFrontmatter](../../config/theme.md#autofrontmatter).

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // Completely disable all automatic generation
    // autoFrontmatter: false,

    // Enable specific features as needed
    autoFrontmatter: {
      permalink: true, // Generate permalink
      createTime: true, // Generate creation time
      title: true, // Generate title
    },
    collections: [{
      type: 'post',
      dir: 'blog',
      title: 'Blog',
      // Configure for specific collection
      autoFrontmatter: {
        permalink: true,
        createTime: true,
        title: true
      }
    }]
  })
})
```

## File Organization Conventions

::: info Note
The following examples are based on the baseline file structure from the [Project Structure](./project-structure.md).
:::

The theme provides a flexible file organization approach. You can create Markdown files with any preferred names within the `docs` directory.

### Directory Naming Convention

The theme applies the following rules to directory names within the `docs` directory:

For `post` type collections:

* Directory names serve as article **categories**
* Multi-level directories are supported, with subdirectories acting as children of parent categories

When sorting is required, use the following naming pattern (applicable to all collection types):

```ts :no-line-numbers
const dir = /\d+\.[\s\S]+/
// Format: Number + . + Category Name
// Example: 1.Frontend
```

The numeric part serves as the **sorting basis**. Directories without numbers are sorted according to default rules.

**Example Structure:**

::: file-tree

* docs
  * blog # post type collection
    * 1.Frontend
      * 1.html/
      * 2.css/
      * 3.javascript/
    * 2.Backend/
    * DevOps/
  * typescript # doc type collection
    * 1.Basics
      * 1.Variables.md
      * 2.Types.md
    * 2.Advanced.md
      :::

The theme automatically generates category pages or sidebars based on the directory structure.

### File Naming Convention

File naming follows the same rules as the [Directory Naming Convention](#directory-naming-convention),
providing sorting basis for the [auto-generated sidebar](../../config/notes.md#auto-generated-sidebar) in the notes feature.

## Start Writing

You can now create Markdown files under the `docs` directory to start writing.
For a complete description of Markdown extension features, please refer to the [Extended Syntax Documentation](../markdown/extensions.md).

Since the theme automatically generates article titles by default,
the main content should start with level 2 headings `## Level 2 Heading`.
If `autoFrontmatter.title` is disabled, start with level 1 headings `# Level 1 Heading`.

### Article Tags

Add tags to articles via `frontmatter.tags`:

```md
---
title: My Article
tags:
  - Tag1
  - Tag2
---
```
