---
url: /config/plugins/markdown-include/index.md
---
## 概述

在 Markdown 文件中导入其他 markdown 文件内容。

关联插件：[@vuepress/plugin-markdown-include](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-include.html)

## 配置

主题默认启用 `markdownInclude`。你还可以通过配置来自定义行为。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      include: {
        // ... options
      },
    },
  }),
})
```

关于配置入口的优先级说明，请参考 [插件配置入口](./README.md#配置入口优先级)。

### resolvePath

* 类型：`(path: string, cwd: string | null) => string`
* 默认值：`(path) => path`
* 详情：处理 include 文件路径。

### deep

* 类型：`boolean`
* 默认值：`false`
* 详情：是否递归导入被包含文件中的 `@include`。为 `false` 时，被包含文件里的 `@include` 不会被继续解析。

### useComment

* 类型：`boolean`
* 默认值：`true`
* 详情：是否使用 `<!-- @include: xxx -->` 代替 `@include: xxx` 导入文件。

### resolveImagePath

* 类型：`boolean`
* 默认值：`true`
* 详情：是否解析包含的 Markdown 文件的里的相对图像路径。

### resolveLinkPath

* 类型：`boolean`
* 默认值：`true`
* 详情：是否解析包含的 Markdown 文件的里的文件相对路径。
