---
url: /en/guide/component-overrides/index.md
---
## Overview

Layout slots are quite practical, but sometimes you might find them not flexible enough.
The theme also provides the capability to override individual components.

::: warning
Before using this feature, you should first familiarize yourself with this theme's source code
and understand the various built-in components to safely override them.

The theme's component source code is hosted on
[GitHub](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/theme/src/client/components) under the MIT license.
:::

## Usage

The theme registers all non-global components with an
[alias](https://v2.vuepress.vuejs.org/zh/reference/plugin-api.html#alias) prefixed with `@theme`.
For example, the alias for `VPFooter.vue` is `@theme/VPFooter.vue`.

If you want to override the `VPFooter.vue` component, you simply need to override this alias in the configuration file `.vuepress/config.ts`:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
  theme: plumeTheme(),

  alias: {
    '@theme/VPFooter.vue': path.resolve(
      __dirname,
      './components/MyFooter.vue',
    ),
  },
})
```
