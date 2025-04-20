---
title: File Tree
createTime: 2025/03/24 20:15:12
icon: mdi:file-tree
permalink: /en/guide/markdown/file-tree/
---

## Overview

In Markdown, you can use the `file-tree` container to display a directory structure with file icons and collapsible subdirectories.

## Syntax

In the `::: file-tree` container, use the built-in **Markdown unordered list syntax** to specify the organization of files and directories.
Use nested list items to create subdirectories; if you want a directory to not display specific content, simply add a slash `/` at the end of the list item.

The following syntax can be used to customize the appearance of the file tree:

- Highlight files or directories by bolding their names, e.g., `**README.md**`
- Add annotations to files or directories by appending additional text after the name
- Use `...` or `…` as names to add placeholder files and directories.
- Adding `icon="simple"` or `icon="colored"` after `:::file-tree` can switch to simple icons or colored icons, with colored icons being the default.

**Input:**

```md
::: file-tree

- docs
  - .vuepress
    - config.ts
  - page1.md
  - README.md
- theme  A **theme** directory
  - client
    - components
      - **Navbar.vue**
    - composables
      - useNavbar.ts
    - styles
      - navbar.css
    - config.ts
  - node/
- package.json
- pnpm-lock.yaml
- .gitignore
- README.md
- …
:::
```

**Output:**

::: file-tree

- docs
  - .vuepress
    - config.ts
  - page1.md
  - README.md
- theme  A **theme** directory
  - client
    - components
      - **Navbar.vue**
    - composables
      - useNavbar.ts
    - styles
      - navbar.css
    - config.ts
  - node/
- package.json
- pnpm-lock.yaml
- .gitignore
- README.md
- …
  :::

## Using Simple Icons

**Input:**

```md
::: file-tree icon="simple"
- docs
  - .vuepress
    - config.ts
  - page1.md
  - README.md
- package.json
:::
```

**Output:**

::: file-tree icon="simple"

- docs
  - .vuepress
    - config.ts
  - page1.md
  - README.md
- package.json
  :::

## Configuration

You can configure the default icon type for the file tree in the `plugins.mdPower.fileTree` option:

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      fileTree: {
        icon: 'simple', // 'simple' | 'colored'
      }
    },
  })
})
```

:::

::: tip Worried that colored icons will affect the build package size?
You don't need to worry. The colored icons for the file tree are also parsed from `iconify`. We recommend that you install the `@iconify/json` project locally.
The theme will automatically parse the icon data from `@iconify/json` into local icon resources. Even if you use them multiple times on different pages, including the navbar, sidebar, icon components, etc., the same icon will only exist as one resource!

Each colored icon is approximately between `1kb ~ 2kb` in size. Even if your file tree uses 100+ different icons, the impact on the final build package size will not be significant.
:::
