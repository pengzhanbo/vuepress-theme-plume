---
title: Documents/Notes
icon: teenyicons:doc-outline
createTime: 2025/03/04 12:52:47
permalink: /en/guide/document/
tags:
  - Guide
  - Quick Start
---

## Overview

The theme provides a `notes` feature, which is used to aggregate articles from the same series or serve as the site's **sub-documentation**.

"Notes" are organized based on the file structure. By default, the `notes/` directory is used as the root directory. Documents stored under the `notes` directory will not be treated as blog posts and will not appear on the blog post list page.

## File Structure and Configuration

In one of our projects, we have the following file structure:

::: file-tree

- docs
  - notes
    - typescript \# Typescript notes
      - basic.md
      - types.md
    - rust \# Rust notes
      - tuple.md
      - struct.md
  - blog-post.md \# Blog post
  - README.md \# Site home page

:::

Under the `docs/notes` directory, there are two subdirectories for storing the series content of `typescript` and `rust`, respectively.

Next, configure `notes` in the configuration file:

::: code-tabs
@tab .vuepress/config.ts

```js
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    notes: {
      // Declare the directory for all notes, (default configuration, usually you don't need to declare it)
      dir: '/notes/',
      link: '/', // Declare the default link prefix for all notes, default is '/' (default configuration, usually you don't need to declare it)
      notes: [
        // Each note is an object in the `notes` array
        {
          // Declare the note's directory, relative to `notes.dir`, here it represents the `notes/typescript` directory
          dir: 'typescript',
          // Declare the note's link prefix, concatenated with `notes.link`, here it represents `/typescript/`
          // All articles within the note will use `/typescript/` as the access link prefix.
          link: '/typescript/',
          // Configure the note's sidebar navigation, used to navigate all documents within the note
          // Declared as `auto`, the sidebar navigation will be automatically generated based on the directory structure
          sidebar: 'auto'
        },
        {
          dir: 'rust',
          link: '/rust/',
          sidebar: [
            { text: 'Introduction', items: ['foo'] }
          ]
        }
      ]
    }
  })
})
```

:::

::: tip

It is recommended to configure the note's directory and link prefix before creating files.
The theme has enabled [auto-frontmatter](../config/basic.md#autofrontmatter) by default,
which needs to generate permanent links and sidebars for md files in the directory based on the configuration.

:::

## Writing Notes Configuration

Since writing all `notes` configurations inside `plumeTheme({  })` may cause the code nesting to be too deep, it is more recommended to use the `defineNotesConfig()` and `defineNoteConfig()` provided by the theme to extract the notes configuration to the outside. They can also help you get better type hints, making it more readable and easier to maintain.

::: code-tabs

@tab .vuepress/notes.ts

```ts
import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

/**
 * Configure a single note
 */
const typescript = defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    '/guide/intro.md',
    '/guide/getting-start.md',
    '/config/config-file.md',
  ]
})

/**
 * Configure notes
 */
export default defineNotesConfig({
  // Declare the directory for all notes, (default configuration, usually you don't need to declare it)
  dir: '/notes/',
  link: '/',
  // Add note configurations here
  notes: [typescript] // [!code ++]
})
```

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import notes from './notes' // [!code ++]

export default defineUserConfig({
  theme: plumeTheme({
    notes // [!code ++]
  }),
})
```

:::

:::: details How to configure when there are many notes?
If you have a large number of notes and putting them all in one `notes.ts` file may make the file too large and difficult to maintain,
you can split the files, using the `.vuepress/notes/` directory as the directory for note configurations.
::: file-tree

- docs
  - .vuepress
    - notes
      - typescript.ts
      - rust.ts
      - index.ts
      - …
  - notes
    - typescript/
    - rust/
:::

The code is as follows:

::: code-tabs
@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import notes from './notes/index.ts' // [!code ++]

export default defineUserConfig({
  theme: plumeTheme({
    notes // [!code ++]
  }),
})
```

@tab .vuepress/notes/index.ts

```ts
import { defineNotesConfig } from 'vuepress-theme-plume'
import rust from './rust' // [!code ++]
import typescript from './typescript' // [!code ++]

export default defineNotesConfig({
  // Declare the directory for all notes, (default configuration, usually you don't need to declare it)
  dir: '/notes/',
  link: '/',
  // Add note configurations here
  notes: [ // [!code ++:4]
    typescript,
    rust,
  ]
})
```

@tab .vuepress/notes/typescript.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

export default defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    '/guide/intro.md',
    '/guide/getting-start.md',
    '/config/config-file.md',
  ]
})
```

@tab .vuepress/notes/rust.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

export default defineNoteConfig({
  dir: 'rust',
  link: '/rust/',
  sidebar: [
    '/guide/intro.md',
    '/guide/getting-start.md',
    '/config/config-file.md',
  ]
})
```

:::
::::

### Sidebar Configuration

Taking the `typescript` directory as an example, it has the following file structure:

::: file-tree

- typescript
  - guide
    - intro.md
    - getting-start.md
  - config
    - config-file.md
    - configuration.md
  - reference
    - basic.md
    - syntax.md
    - modules.md
  - built-in
    - types
      - Required.md
      - Omit.md
  - README.md

:::

#### Automatically Generating Sidebar

The simplest configuration method is `sidebar: 'auto'`, the theme will automatically generate the sidebar based on the file structure and sort it according to the encoding of the first character.

If you want to modify the order of the automatically generated sidebar, you can add prefixes such as `1.` or `2.` before the directory name or file name.

::: file-tree

- typescript
  - 1.guide
    - 1.intro.md
    - 2.getting-start.md
  - 2.config
    - 1.config-file.md
    - 2.configuration.md
  - …

:::

The theme will sort based on the numbers in these prefixes, and the prefix part will not be displayed in the sidebar.

#### Customizing the Sidebar

Sometimes, automatically generating the sidebar may not fully meet the requirements, and you can customize the sidebar.

Here is the type definition for the sidebar:

```ts
type Sidebar = (string | SidebarItem)[]

interface SidebarItem {
  /**
   * Sidebar text
   */
  text?: string

  /**
   * Sidebar link
   */
  link?: string

  /**
   * Sidebar icon
   */
  icon?: ThemeIcon

  /**
   * The link prefix for the current group, the link prefix will be concatenated before the `link` in `items`
   * It will only be concatenated when the `link` in `items` is a relative path
   */
  prefix?: string
  /**
   * Subordinate sidebar groups
   */
  items?: 'auto' | (string | SidebarItem)[]

  /**
   * If not specified, the group is not collapsible.
   * If `true`, the group is collapsible and defaults to collapsed.
   * If `false`, the group is collapsible but defaults to expanded.
   */
  collapsed?: boolean
}
```

When the type passed in is `string`, it represents the path to a markdown file:

::: code-tabs
@tab .vuepress/notes.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

const typescript = defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    '/guide/intro.md',
    '/guide/getting-start.md',
    '/config/config-file.md',
    // …
  ]
})

// … other code
```

:::

You can also omit the `.md` file suffix and abbreviate it to `/guide/intro`. The theme will parse the corresponding file, obtain the **title** and **page link address**, and convert it into the data format of `{ text: string, link: string }`.

When the type passed in is `SidebarItem`:

::: code-tabs
@tab .vuepress/notes.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

const typescript = defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    { text: 'Introduction', link: '/guide/intro' },
    { text: 'Quick Start', link: '/guide/getting-start' },
  // …
  ]
})

// … other code
```

:::

You can also nest multiple levels:

::: code-tabs
@tab .vuepress/notes.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

const typescript = defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    {
      text: 'Guide',
      prefix: '/guide', // Use prefix to concatenate, you can abbreviate the link in the items below to a relative path
      items: [
      // You can mix string and SidebarItem
        { text: 'Introduction', link: 'intro' },
        'getting-start',
      ],
    },
    {
      text: 'Configuration',
      prefix: '/config',
      items: 'auto', // items is 'auto', the sidebar will be automatically generated based on the file structure of prefix
    },
  ]
})

// … other code
```

:::

### About `prefix`

The purpose of `prefix` is to abbreviate the links in the same level `items` by extracting the common prefix to `prefix`, allowing the theme to complete the full link concatenation for you.

It should be noted that only relative path links in `items` will be concatenated with `prefix`, while absolute paths will not be processed.

::: code-tabs

@tab .vuepress/notes.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

const typescript = defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    {
      prefix: '/guide',
      items: [
        'intro', // Relative path, finally concatenated to /guide/intro
        '/config/config-file', // Absolute path, not concatenated
        {
          text: 'Blog',
          link: 'blog', // Relative path, finally concatenated to /guide/blog
        },
        {
          text: 'Configuration',
          link: '/config', // Absolute path, not concatenated
        }
      ]
    }
  ]
})
```

:::

At the same time, deep nesting is also supported within `items`, and `prefix` is still supported inside, following the same rules. If `prefix` is a relative path, it will be concatenated with the `prefix` of the upper level, and then with the `link` in the current level `items`. If `prefix` is an absolute path, it will not be concatenated with the `prefix` of the upper level.

::: code-tabs
@tab .vuepress/notes.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

const typescript = defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    {
      prefix: '/guide',
      items: [
        'intro', // Relative path, finally concatenated to /guide/intro
        {
          prefix: '/config',
          items: [
            'config-file', // Relative path, finally concatenated to /config/config-file
            'configuration', // Relative path, finally concatenated to /config/configuration
          ]
        },
        {
          prefix: 'blog',
          items: [
            'intro', // Relative path, finally concatenated to /guide/blog/intro
            'getting-start', // Relative path, finally concatenated to /guide/blog/getting-start
          ]
        }
      ]
    }
  ]
})
```

:::

**The criterion for whether it is an absolute path is that if it starts with `/`, it is an absolute path; otherwise, it is a relative path.**

:::warning
It is not recommended to have too many levels in the sidebar. Sidebars with more than 3 levels may lead to poor UI effects.
:::

### Sidebar Icons

Adding icons to the sidebar helps to better present the sidebar. Thanks to the powerful open-source icon library [iconify](https://iconify.design/), you can use over `200k` icons by simply adding the `icon` configuration.

::: code-tabs
@tab .vuepress/notes.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

const typescript = defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    {
      text: 'Guide',
      prefix: '/guide',
      icon: 'ep:guide', // iconify icon name // [!code hl]
      items: [
        { text: 'Introduction', link: 'intro', icon: 'ph:info-light' }, // [!code hl]
      ],
    },
  ]
})
```

:::

You can also use local icons or local images:

::: code-tabs
@tab .vuepress/notes.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

const typescript = defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    {
      text: 'Guide',
      prefix: '/guide',
      icon: '/images/guide.png', // iconify icon name // [!code hl]
      items: [
        { text: 'Introduction', link: 'intro', icon: '/images/info.png' }, // [!code hl]
        // It can also be a remote image
        { text: 'Quick Start', link: 'getting-start', icon: 'https://cn.vuejs.org/images/logo.png  ' },
      ],
    },
  ]
})
```

:::

**Please note that using local images must start with `/`, indicating a static resource path, which will be loaded from the `.vuepress/public/` directory.**

::: file-tree

- docs
  - .vuepress
    - public \# Save static resources in this location
      - images
        - guide.png
        - info.png
  - …

:::

You may have noticed how to configure sidebar icons when `sidebar: auto`. In fact, it's very simple. Just add an `icon` field in the `frontmatter` section of the file.

::: code-tabs
@tab typescript/guide/intro.md

```md
---
title: Introduction
icon: ep:guide
---
```

:::

### Sidebar Group Internal Separation

Separating items within a group is a relatively niche requirement. It may be more applicable when there are many items in a group, but it is not suitable to split them into multiple groups, or when it is not suitable to split the group into multiple subgroups. It provides a way to use auxiliary text color to display a separator item name at the same level, for simple separation of items.

::: code-tabs
@tab .vuepress/notes.ts

```ts
import { defineNoteConfig } from 'vuepress-theme-plume'

const typescript = defineNoteConfig({
  dir: 'typescript',
  link: '/typescript/',
  sidebar: [
    {
      text: 'Guide',
      items: [
        'Project 1',
        'Project 2',
        'Project 3',
        { text: 'Separator', link: '---' }, // [!code ++]
        'Project 4',
        'Project 5',
        // …
      ],
    },
  ]
})
```

:::

It is very simple to complete the separation within a group. You just need to insert a `{ text: 'xxxx', link: '---' }` at the appropriate position. The key is to set the `link` to consecutive `---`, at least three `-`. You can define the text arbitrarily and also add icons.

## Note Home Page

You may have noticed that there is a `README.md` file in the `typescript` directory, which will be displayed as the note home page.

::: file-tree

- typescript
  - README.md
  - …
- …

:::

By default, it is no different from ordinary documentation pages because the theme sets `pageLayout: docs` for all pages by default.

But you can directly configure `pageLayout: 'home'`, just like configuring the [site home page](./custom-home.md), to customize a home page for the note!

::: code-tabs
@tab typescript/README.md

```md
---
pageLayout: home
config:
  - type: hero
  - type: features
---
```
