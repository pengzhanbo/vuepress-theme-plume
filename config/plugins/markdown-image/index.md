---
url: /config/plugins/markdown-image/index.md
---
## 概述

为 Markdown 图像添加附加功能。

关联插件：[@vuepress/plugin-markdown-image](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-image.html)

## 配置

插件默认不启用任何功能，你需要手动开启它们。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      image: {
        // 启用 figure
        // figure: true,

        // 启用图片懒加载
        // lazyload: true,

        // 启用图片标记
        // mark: true,

        // 启用图片大小
        // size: true,
      }
    },
    // 也可以在 `plugins.markdownImage` 配置，但不推荐
    plugins: {
      markdownImage: {}
    }
  }),
})
```
