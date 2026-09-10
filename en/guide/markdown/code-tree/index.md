---
url: /en/guide/markdown/code-tree/index.md
---
## Overview

In Markdown, use the `::: code-tree` container or `@[code-tree](dir_path)` syntax to display a code block area with a file tree.

Compared to code block grouping, code trees can more clearly present the organizational structure of code files and their dependency relationships.

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
::: code-tree title="Project Name" height="400px" entry="filepath"
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

* Use `title="Project Name"` after `::: code-tree` to declare the code tree title
* Use `height="400px"` after `::: code-tree` to declare the code tree height
* Use `entry="filepath"` after `::: code-tree` to declare the default expanded file path
* Use `title="filepath"` after the code block \`\`\` lang to declare the current code block's file path
* If `entry="filepath"` is not declared in `::: code-tree`, you can use `:active` after the code block
  \`\`\` lang to declare the current code block as expanded
* If no expanded file path is specified, the first file will be expanded by default

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
@[code-tree title="Project Name" height="400px" entry="filepath"](dir_path)
```

* **dir\_path**:
  When an absolute path is provided (starting with `/`), the search begins from the source directory of the documentation site.
  When a relative path is provided (starting with `.`), it is relative to the current Markdown file.

* **title**: Code tree title, optional, defaults to empty

* **height**: Code tree height, optional, defaults to empty

* **entry**: Default expanded file path, optional, defaults to the first file

**Input:**

```md
<!-- This directory is the theme repository's `docs/.vuepress/collections/` -->
@[code-tree title="Collections Configuration" height="400px" entry="index.ts"](/.vuepress/collections)
```

**Output:**

@[code-tree title="Collections Configuration" height="400px" entry="index.ts"](/.vuepress/collections)
