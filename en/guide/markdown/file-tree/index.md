---
url: /en/guide/markdown/file-tree/index.md
---
## Overview

In Markdown, you can use the `file-tree` container to display directory structures with file icons and collapsible subdirectories.

## Syntax

Within the `::: file-tree` container, use the built-in **Markdown unordered list syntax** to specify the organization of files and directories.
Use nested list items to create subdirectories; to indicate that a directory's contents should not be
displayed, simply add a slash `/` at the end of the list item.

The following syntax can be used to customize the appearance of the file tree:

* Emphasize file or directory names by making them bold, e.g., `**README.md**`
* Add comments to files or directories by adding additional text after the name
* Mark files or directories as **added** or **deleted** by prefixing the name with `++` or `--`
* Use `...` or `…` as the name to add placeholder files and directories.
* Add `icon="simple"` or `icon="colored"` after `:::file-tree` to switch to simple icons or colored icons. The default is colored icons.
* Add `title="xxxx"` after `:::file-tree` to add a title to the file tree.

**Input:**

```md /++/ /--/
::: file-tree

- docs
  - .vuepress
    - ++ config.ts
  - -- page1.md
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

* docs
  * .vuepress
    * ++ config.ts
  * \-- page1.md
  * README.md
* theme  A **theme** directory
  * client
    * components
      * **Navbar.vue**
    * composables
      * useNavbar.ts
    * styles
      * navbar.css
    * config.ts
  * node/
* package.json
* pnpm-lock.yaml
* .gitignore
* README.md
* …
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

* docs
  * .vuepress
    * config.ts
  * page1.md
  * README.md
* package.json
  :::

## Configuration

You can configure the default icon type for file trees in the `markdown.fileTree` option:

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

::: tip Concerned about colored icons affecting build bundle size?
You don't need to worry. The colored icons for the file tree are also resolved from `iconify`.
We recommend installing the `@iconify/json` package locally in your project.
The theme will automatically parse the icon data from `@iconify/json` into local icon resources.
Even if you use the same icon multiple times across different pages
(including navigation bars, sidebars, icon components, etc.), only one copy of the resource will exist for each icon!

Each colored icon is approximately `1kb ~ 2kb` in size.
Even if your file tree extensively uses 100+ different icons, the impact on the final build bundle size
will not be significant.
:::
