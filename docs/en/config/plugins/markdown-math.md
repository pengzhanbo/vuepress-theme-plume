---
title: Markdown Math
createTime: 2025/10/09 13:20:41
permalink: /en/config/plugins/markdown-math/
---

## Overview

Adds mathematical formula support for Markdown.

Related plugin: [@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/plugins/markdown/markdown-math.html)

This plugin allows you to render $\TeX$ content in Markdown using MathJax or KaTeX.

## Configuration

The plugin enables `katex` by default.

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      math: {
        type: 'katex',
      }
    },
    // Can also be configured in `plugins.markdownMath`, but not recommended
    plugins: {
      markdownMath: {}
    }
  }),
})
```
