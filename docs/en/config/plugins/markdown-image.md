---
title: Markdown Image
createTime: 2025/10/09 12:06:28
permalink: /en/config/plugins/markdown-image/
---

## Overview

Adds additional features for Markdown images.

Related plugin: [@vuepress/plugin-markdown-image](https://ecosystem.vuejs.press/plugins/markdown/markdown-image.html)

## Configuration

- **Type:** `false | MarkdownImagePluginOptions`
- **Default:** `false`

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
  }),
})
```

For configuration entry priority information, please refer to [Plugin Configuration Entry](./README.md#configuration-entry-priority).

## Configuration Options

### figure

- **Type:** `boolean | MarkdownItFigureOptions`
- **Default:** `false`
- **Details:** Whether to render standalone images as a figure

### lazyload

- **Type:** `boolean`
- **Default:** `false`
- **Details:** Whether to enable native image lazy loading

### mark

- **Type:** `boolean | MarkdownItImgMarkOptions`
- **Default:** `false`
- **Details:** Whether to enable GFM image ID marking

### size

- **Type:** `boolean`
- **Default:** `false`
- **Details:** Whether to enable image size support

### obsidianSize

- **Type:** `boolean`
- **Default:** `false`
- **Details:** Whether to enable Obsidian image size support

### legacySize

- **Type:** `boolean`
- **Default:** `false`
- **Details:** <Badge type="warning" text="Deprecated" /> Whether to enable legacy image size support

::: tip Difference from `markdown.imageSize`
The `size` / `obsidianSize` on this page are **syntax-level** support, used to write image dimensions like `![alt](./a.png =200x100)`.
If you want to automatically fill in the `width` / `height` attributes of images during the build stage (to solve layout jitter),
use [`imageSize` in the markdown configuration](../markdown.md#imagesize) instead.
:::
