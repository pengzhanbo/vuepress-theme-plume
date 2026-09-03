---
url: /config/plugins/markdown-enhance/index.md
---
::: danger 从 `1.0.0-rc.154` 开始，该插件已从主题中移除
[vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/zh/) 提供的，在主题中明确受到支持
的功能，已迁移到 `vuepress/ecosystem` 仓库的其他插件中，因此，主题将从 `1.0.0-rc.154` 开始，安全的
移除 `vuepress-plugin-md-enhance` 插件。
:::

## 概述

提供 Markdown 增强功能。

关联插件：[vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/zh/)

默认配置：

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      // 以下可选项在 主题中默认不启用，
      // 请在主题中自行配置
      // stylize: true, // 对行内语法进行样式化以创建代码片段
      // playground: true, // 交互演示
      // kotlinPlayground: true, // Kotlin 交互演示
      // vuePlayground: true, // Vue 交互演示
      // sandpack: true, // sandpack 交互演示
    },
  }),
})
```

## 配置

详见 [vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/zh/config.html)
