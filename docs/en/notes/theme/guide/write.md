---
title: Writing Articles
icon: mingcute:edit-4-line
createTime: 2025/03/03 13:43:55
permalink: /en/guide/write/
tags:
  - Guide
  - Quick Start
---

VuePress supports the complete [Markdown syntax](./markdown/basic.md),
and uses [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f)
to define frontmatter page metadata, such as title and creation time.

The theme also provides [extensions](./markdown/extensions.md) for Markdown syntax. You can also write HTML directly in
Markdown, or use Vue components.

## Frontmatter

You can customize each page in VuePress by setting values in the frontmatter.
Frontmatter is the part at the top of your file between `---`.

::: code-tabs
@tab post.md

```md
---
title: Article Title
createTime: 2024/09/08 22:53:34
permalink: /article/9eh4d6ao/
---

The page content is after the second `---`.
```

:::

::: details What is frontmatter?
Frontmatter is a [YAML](https://dev.to/paulasantamaria/introduction-to-yaml-125f) formatted configuration content, placed at the top of the markdown file, separated by `---`.

You can read [this article](../../../4.Tutorials/frontmatter.md) to learn how to write frontmatter correctly.
:::

## Auto-Generated Frontmatter

By default, the theme will help generate some `frontmatter` configurations for markdown files in the source directory after starting the development service.
These configurations include: **title**, **creation time**, and **permalink**.

On one hand, this can reduce the repetitive work of content creators; on the other hand, these configurations also provide prerequisite support for other features of the theme.

```md
---
title: Title
createTime: 2024/09/08 22:53:34
permalink: /article/9eh4d6ao/
---
```

### Title

The theme defaults to using the file name as the article title. When parsing the file name, the file name named according to the [file naming convention](#file-naming-convention) such as `1.My Article.md`, the parts `1.` and `.md` will be trimmed, and the final article title will be `My Article`.

### Creation Time

The theme defaults to using the file creation time as the article creation time, and formats it as `yyyy/MM/dd HH:mm:ss`.

### Permalink

**Permalink** refers to the access address after the article is published. Once this address is generated, it will not change unless you manually modify it, even if the file path or file name changes.

Preparing **permalink** in advance is quite valuable. On one hand, it can help improve the SEO of the site and avoid frequent changes to the included addresses; on the other hand, the theme uses a set of specifications to generate **permalink**, which makes the link style of the entire site consistent.

- **Blog Articles**

  For blog articles, the default prefix for permalink is `/article/`, and then a random string of length `8` is generated using [`nanoid`](https://github.com/ai/nanoid) for concatenation as the article's permalink, such as `/article/9eh4d6ao/`.

  The link prefix can also be replaced by modifying [Theme Configuration > article](../config/basic.md#article).

- **Notes**

  For notes, the theme uses a more flexible custom solution. You can declare different link prefixes for notes in [notes > note.link](../config/notes.md#configuration), and then use [`nanoid`](https://github.com/ai/nanoid) to generate a random string of length `8` for concatenation as the permalink for note articles.

### Disabling Auto-Generation

You may not want the theme to do extra auto-generation and prefer to have full control. This is completely fine, and the theme supports controlling the behavior of auto-generating frontmatter through configuration.
You can easily achieve this through [Theme Configuration > autoFrontmatter](../config/basic.md#autofrontmatter).

::: code-tabs
@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // Completely disable all auto-generation
    // autoFrontmatter: false,

    // Control partial auto-generation
    autoFrontmatter: {
      permalink: true, // Whether to generate permalink
      createTime: true, // Whether to generate creation time
      title: true, // Whether to generate title
    }
  })
})
```

:::

## Conventions

::: info Note
The following content is based on the file structure in [Project Structure](./project-structure.md).
:::

Writing articles with this theme is very easy. You can create `Markdown` files with any name you like in the `docs` directory according to your personal naming preferences.

### Folder Naming Convention

For folder naming in `docs`, the theme has a simple set of conventions.

- The folder name will serve as the `category`, i.e., **category**.
- Multi-level directories are allowed, and subdirectories will be sub-items of the parent directory's category.
- If the directory name is declared in [Theme Configuration notes](../config/notes.md) for notes article management, it will not be used as a category directory by default.

Since folder names will serve as category names and are not sorted in theme configuration, for scenarios where sorting is needed, use the following rule for naming:

``` ts :no-line-numbers
const dir = /\d+\.[\s\S]+/
// That is, number + . + category name
// For example: 1.Frontend
```

The number will serve as the basis for **sorting**. If there is no number, the default sorting rule will be applied.

**Example:**

::: file-tree

- docs
  - 1.Frontend
    - 1.HTML/
    - 2.CSS/
    - 3.JavaScript/
  - 2.Backend/
  - Operations-And-Maintenance/
:::

The theme will generate a category page based on the directory structure.

### File Naming Convention

- **Blog Articles**

  For the names of **blog articles**, the theme has no specific conventions, and you can name them arbitrarily. The default sorting rule for blog articles is based solely on file creation time.
  You can also use [frontmatter > sticky](../config/frontmatter/article.md#sticky) to configure whether the article is stickied.

- **Notes**

  For the names of markdown files in **notes**, the same rules as [Folder Naming Convention](#folder-naming-convention) still apply.
  This can provide a basis for sorting the [auto-generated sidebar](../config/notes.md#auto-generated-sidebar) for notes.

## Article Writing

You can start writing your own articles by creating Markdown files in `docs` using `markdown` syntax.
For the supported features of markdown extensions, please refer to [this document](./markdown/extensions.md).

Since the theme defaults to auto-generating a `title` for the article's `frontmatter`, the main part of the article content should start with `h2`, i.e., `## Secondary Heading`. If you have disabled `autoFrontmatter.title`, you should start with `h1`, i.e., `# Primary Heading`.

### Tags

You can add tags to an article through `frontmatter.tags`.

```md
---
title: My Article
tags:
  - Tag 1
  - Tag 2
---
```
