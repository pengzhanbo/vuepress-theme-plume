---
url: /en/config/plugins/markdown-image/index.md
---
## Overview

Adds additional features for Markdown images.

Related plugin: [@vuepress/plugin-markdown-image](https://ecosystem.vuejs.press/plugins/markdown/markdown-image.html)

## Configuration

The plugin does not enable any features by default; you need to enable them manually.

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      image: {
        // Enable figure
        // figure: true,

        // Enable image lazy loading
        // lazyload: true,

        // Enable image marking
        // mark: true,

        // Enable image dimensions
        // size: true,
      }
    },
    // Can also be configured in `plugins.markdownImage`, but not recommended
    plugins: {
      markdownImage: {}
    }
  }),
})
```
