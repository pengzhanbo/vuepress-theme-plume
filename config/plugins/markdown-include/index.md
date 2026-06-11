---
url: /config/plugins/markdown-include/index.md
---
## 概述

在 Markdown 文件中导入其他 markdown 文件内容。

关联插件：[@vuepress/plugin-markdown-include](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-include.html)

## 配置

主题默认启用 `markdownInclude`。你还可以通过配置来自定义行为。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      include: {
        // ... options
      }
    },
    // 也可以在 `plugins.markdownInclude` 中配置，但不推荐
    plugins: {
      markdownInclude: {},
    }
  })
})
```

### resolvePath

* 类型：`(path: string, cwd: string | null) => string`
* 默认值：`(path) => path`
* 详情：处理 include 文件路径。

### deep

* 类型：`boolean`
* 详情：是否启用图片 Figure 支持。

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
