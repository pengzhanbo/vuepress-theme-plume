---
url: /config/plugins/markdown-math/index.md
---
## 概述

为 Markdown 添加数学支持。

关联插件：[@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-math.html)

此插件允许你使用 mathjax 或 katex 在 Markdown 中渲染 $\TeX$ 内容。

## 配置

插件默认启用 `katex`。

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
    // 也可以在 `plugins.markdownMath` 中进行配置，但不推荐
    plugins: {
      markdownMath: {}
    }
  }),
})
```
