---
url: /en/guide/code/copy-code/index.md
---
## Overview

This feature is powered by [@vuepress/plugin-copy-code](https://ecosystem.vuejs.press/zh/plugins/features/copy-code.html).

The code copying feature is enabled by default in the theme. It supports one-click copying of code displayed in articles.

By default, the theme adds a copy button to every code block. This button is only displayed on desktop.

When hovering over a code block, a copy button appears in the top-right corner.

## Configuration

Modify the behavior of code copying in the `.vuepress/config.ts` configuration file:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    // copyCode: false  // Disable code copying
    copyCode: {
      // ...More configurations
    }
  })
})
```

### showInMobile

* **Type:** `boolean`
* **Default:** `false`

Whether to show the copy button on mobile devices.

### ignoreSelector

* **Type:** `string | string[]`
* **Default:** `[]`

CSS selector for elements within code blocks to be ignored during copying.

Example: `['.token.comment']` will ignore nodes with the class `.token.comment` in code blocks (this would ignore comments in prismjs).

### inlineSelector

* **Type:** `string | string[] | boolean`
* **Default:** `false`

Whether to copy inline code content on double-click.

`boolean`: Whether to copy inline code content on double-click.

`string[] | string`: Selector indicating which inline code content should be copyable.

### transform&#x20;

* **Type:** `(preElement: HTMLPreElement) => void`
* **Default:** `null`

A transformer function to modify the code block content within `<pre>` before copying. This option is only effective when using `useCopyCode()`.

## Composition API

The Composition API for this feature can be configured in `.vuepress/client.ts`:

```ts title=".vuepress/client.ts"
import { defineClientConfig } from '@vuepress/client'
import { useCopyCode } from '@vuepress/plugin-copy-code/client'

export default defineClientConfig({
  setup() {
    useCopyCode({
      // ...
    })
  },
})
```

### Example

Add copyright information when copying code:

```ts title=".vuepress/client.ts"
import { defineClientConfig } from '@vuepress/client'
import { useCopyCode } from '@vuepress/plugin-copy-code/client'

export default defineClientConfig({
  setup() {
    useCopyCode({
      transform: (preElement) => {
        // Insert copyright information
        pre.innerHTML += `\n Copied by vuepress-theme-plume`
      },
    })
  },
})
```
