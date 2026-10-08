---
url: /en/config/plugins/markdown-enhance/index.md
---
::: danger Removed from theme starting from `1.0.0-rc.154`
The functionality provided by [vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/) that
was explicitly supported in the theme has been migrated to other plugins in the
`vuepress/ecosystem` repository. Therefore, the theme will safely remove the `vuepress-plugin-md-enhance` plugin starting from `1.0.0-rc.154`.
:::

## Overview

Provides Markdown enhancement features.

Related plugin: [vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/)

Default configuration:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      // The following options are not enabled by default in the theme,
      // Please configure them explicitly in the theme if needed
      // stylize: true, // Style inline syntax to create code snippets
      // playground: true, // Interactive playgrounds
      // kotlinPlayground: true, // Kotlin interactive playgrounds
      // vuePlayground: true, // Vue interactive playgrounds
      // sandpack: true, // Sandpack interactive playgrounds
    },
  }),
})
```

## Configuration

For detailed configuration, please refer to [vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/config.html).
