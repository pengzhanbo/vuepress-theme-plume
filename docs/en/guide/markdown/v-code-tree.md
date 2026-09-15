---
title: Code Tree
icon: stash:side-peek
createTime: 2025/10/08 05:59:44
permalink: /en/guide/markdown/code-tree/
badge:
  text: Changed
  type: warning
---

## Overview

In Markdown, use the `::: code-tree` container or `@[code-tree](dir_path)` syntax to display a code block area with a file tree.

Compared to code block grouping, code trees can more clearly present the
organizational structure of code files and their dependency relationships.

## Enable

This feature is disabled by default. You need to enable it in the `theme` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTree: true, // [!code ++]
    }
  })
})
```

## Usage

The theme provides two usage methods:

### code-tree Container

````md
::: code-tree title="Project Name" height="400px" entry="filepath" showSidebar
```lang title="filepath" :active
<!-- code content-->
```

```lang title="filepath"
<!-- code content-->
```
<!-- More code blocks -->
:::
````

Use the `::: code-tree` container to wrap multiple code blocks.

- Use `title="Project Name"` after `::: code-tree` to declare the code tree title
- Use `height="400px"` after `::: code-tree` to declare the code tree height.
  A number is also supported, e.g. `height="400"`, and the `px` unit will be appended automatically
- Use `entry="filepath"` after `::: code-tree` to declare the default expanded file path
- Use `showSidebar` after `::: code-tree` to show the file tree sidebar by default, which is hidden by default
- Use `title="filepath"` after the code block <code>\`\`\` lang</code> to declare the current code block's file path
- If `entry="filepath"` is not declared in `::: code-tree`, you can use `:active` after the code block
<code>\`\`\` lang</code> to declare the current code block as expanded
- If no expanded file path is specified, the first file will be expanded by default

::: details Why use `title="filepath"` instead of `filepath="filepath"` on code blocks?
Because the theme already [supports title syntax on code blocks](../code/features.md#code-block-titles).
Continuing to use the existing syntax support reduces the learning curve.
:::

**Input:**

````md :collapsed-lines
::: code-tree title="Vue App" height="400px" entry="src/main.ts"
```vue title="src/components/HelloWorld.vue"
<template>
  <div class="hello">
    <h1>Hello World</h1>
  </div>
</template>
```

```vue title="src/App.vue"
<template>
  <div id="app">
    <h3>vuepress-theme-plume</h3>
    <HelloWorld />
  </div>
</template>
```

```ts title="src/main.ts"
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

```json title="package.json"
{
  "name": "Vue App",
  "scripts": {
    "dev": "vite"
  }
}
```
:::
````

**Output:**

::: code-tree title="Vue App" height="400px" entry="src/main.ts"

```vue title="src/components/HelloWorld.vue"
<template>
  <div class="hello">
    <h1>Hello World</h1>
  </div>
</template>
```

```vue title="src/App.vue"
<template>
  <div id="app">
    <h3>vuepress-theme-plume</h3>
    <HelloWorld />
  </div>
</template>
```

```ts title="src/main.ts"
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

```json title="package.json"
{
  "name": "Vue App",
  "scripts": {
    "dev": "vite"
  }
}
```

:::

### Importing code-tree from Directory

The theme supports importing `code-tree` from a directory using the following syntax:

```md
<!-- Simple import -->
@[code-tree](dir_path)

<!-- With additional configuration -->
@[code-tree title="Project Name" height="400px" entry="filepath" showSidebar](dir_path)
```

- **dir_path**:
  When an absolute path is provided (starting with `/`), the search begins from the source directory of the documentation site.
  When a relative path is provided (starting with `.`), it is relative to the current Markdown file.

- **title**: Code tree title, optional, defaults to empty
- **height**: Code tree height, optional, defaults to empty. A number is also supported, and the `px` unit will be appended automatically
- **entry**: Default expanded file path, optional, defaults to the first file
- **showSidebar**: Show the file tree sidebar by default, optional, defaults to `false`

**Input:**

```md
<!-- This directory is the theme repository's `docs/.vuepress/collections/` -->
@[code-tree title="Collections Configuration" height="400px" entry="index.ts"](/.vuepress/collections)
```

**Output:**

@[code-tree title="Collections Configuration" height="400px" entry="index.ts"](/.vuepress/collections)

#### File Loaders

When importing `code-tree` from a directory, the theme processes the file content
automatically with built-in file loaders based on the file type:

| File Type | Rendering |
| --- | --- |
| Image files (`jpg`, `png`, `svg`, `webp`) | Rendered as `<img>`, absolute path when in the `public` dir, otherwise relative |
| `.editorconfig` | Rendered as a TOML code block |
| Dot files (`.git*`, `.env*`, `.*ignore`, `.npmrc`) | Rendered as plain text code blocks |
| `.XXXrc` config files (e.g. `.eslintrc`) | Rendered as JSON code blocks |
| Other files with Shiki syntax highlighting support | Rendered as code blocks |
| Other unsupported files | Content is not rendered, only the filename is shown in the file tree |

#### Custom File Loaders

You can configure custom file loaders via `loaders` in `markdown.codeTree`.
Custom loaders take precedence over built-in loaders.

```ts title=".vuepress/config.ts"
import { readFileSync } from 'node:fs'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTree: {
        loaders: [
          {
            // Supports glob patterns, arrays of glob patterns, or a predicate function receiving CodeTreeFile
            filter: ['**/*.md'],
            load: file => `\`\`\`md title="${file.path}"\n${readFileSync(file.absolutePath, 'utf-8')}\n\`\`\``,
          },
        ],
      },
    }
  })
})
```

- **filter**: Determines which files this loader handles. Supports glob patterns,
  arrays of glob patterns, or a predicate function receiving `CodeTreeFile`
- **load**: Receives a `CodeTreeFile` and the `App` instance, and returns markdown content to render (e.g. a fenced code block)

`CodeTreeFile` contains the following fields:

```ts
interface CodeTreeFile {
  /** Path relative to the embedded directory */
  path: string
  /** Absolute path on the filesystem */
  absolutePath: string
  /** Path relative to the current markdown file */
  relativePath: string
  /** File extension without the leading dot */
  extname: string
  /** File name including extension */
  basename: string
}
```

#### Ignoring Files

You can ignore files when importing `code-tree` via the `ignores` option in `markdown.codeTree`, using glob patterns:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTree: {
        ignores: ['**/dist/**', '**/*.map'],
      },
    }
  })
})
```

#### Invalid Directory

When the directory pointed to by `dir_path` does not exist, an error message is rendered and a warning log is printed during the build.

## Configuration

You can configure the global options of `code-tree` in `markdown.codeTree`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      codeTree: {
        // File icon type, optional: 'simple' | 'colored', defaults to 'colored'
        icon: 'colored',
        // Default code tree height, optional, defaults to empty
        height: 400,
        // Glob patterns of files to ignore when importing from a directory
        ignores: ['**/dist/**'],
        // Custom file loaders, taking precedence over built-in loaders
        loaders: [],
      },
    }
  })
})
```

- **icon**: File icon type, optional `simple` | `colored`, defaults to `colored`
- **height**: Default code tree height, optional, defaults to empty.
  A number is also supported, and the `px` unit will be appended automatically
- **ignores**: Files to ignore when importing `code-tree` from a directory, using glob patterns
- **loaders**: Custom file loaders, taking precedence over built-in loaders
