---
url: /config/markdown/index.md
---
## 概述

Markdown 配置用于控制 Markdown 的行为。此配置聚合了主题为 markdown 增强的各种功能的配置。

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // [!code ++:3]
    markdown: {
      // 在这里配置 markdown
    },
  }),
})
```

::: warning
不要和 [VuePress](https://v2.vuepress.vuejs.org/) 的 [markdown](https://v2.vuepress.vuejs.org/zh/reference/config.html#markdown) 配置混淆。

二者是相互独立的，不要在 [VuePress > markdown](https://v2.vuepress.vuejs.org/zh/reference/config.html#markdown) 中配置主题的 markdown 配置,反之亦然。
:::

**默认配置：**

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // [!code focus:11]
    markdown: {
      hint: true,
      alert: true,
      fileTree: true,
      plot: true,
      icons: true,
      math: { type: 'katex' },
      include: {
        // ...option
      },
    },
  }),
})
```

## 配置项

::: tip `hint` 和 `alter` 的功能由 [@vuepress/plugin-markdown-hint](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-hint.html) 插件实现。
:::

### hint

* **类型：** `boolean`
* **默认值：** `true`
* **详情：** 是否启用提示容器

### alert

* **类型：** `boolean`
* **默认值：** `true`
* **详情：** 是否启用 Github 风格的警告语法

***

::: tip `image` 配置由 [@vuepress/plugin-markdown-image](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-image.html) 插件实现。
:::

### image

* **类型**: `boolean | MarkdownImagePluginOptions`
* **默认值**: `false`
* **详情**: 是否启用图片增强语法

***

::: tip `math` 配置由 [@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-math.html) 插件实现。
:::

### math

* **类型**: `boolean | MarkdownMathPluginOptions`
* **默认值**: `{ type: 'katex' }`
* **详情**: 是否启用数学支持

***

### include

::: tip `include` 配置由 [@vuepress/plugin-markdown-include](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-include.html) 插件实现。
:::

* **类型**: `boolean | MarkdownIncludePluginOptions`
* **默认值**: `true`
* **详情**: 是否启用 Markdown 文件导入

***

::: tip 以下配置字段由 [vuepress-plugin-md-power](./plugins/markdown-power.md) 插件实现。
:::

### annotation

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用内容注释

### abbr

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用缩写语法

### mark

* **类型**: `MarkOptions`
* **默认值**: `'eager'`
* **详情**: 设置 `==马克笔==` 的动画播放模式

### codeTabs

* **类型**: `boolean | CodeTabsOptions`
* **默认值**: `true`
* **详情**: 是否启用代码块分组

### tabs

* **类型**: `boolean | TabsOptions`
* **默认值**: `true`
* **详情**: 是否启用 分组

### npmTo

* **类型**: `boolean | NpmToOptions`
* **默认值**: `false`
* **详情**: 是否启用 `npm-to` 容器

### icon

* **类型**: `IconOptions`
* **默认值**: `{ provider: 'iconify' }`
* **详情**: 图标配置

  [查看 **icon** 使用说明](../../theme/guide/features/icon.md){.read-more}

### plot

* **类型**: `boolean | PlotOptions`
* **默认值**: `true`
* **详情**: 是否启用隐秘文本语法

### fileTree

* **类型**: `boolean | FileTreeOptions`
* **默认值**: `true`
* **详情**: 是否启用文件树容器语法

### field

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用字段容器

### table

* **类型**: `boolean | TableContainerOptions`
* **默认值**: `false`
* **详情**: 是否启用表格增强容器

### timeline

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用时间线容器语法

### collapse

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用折叠面板容器语法

### chat

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用对话记录容器

### demo

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 Demo 容器

### pdf

* **类型**: `boolean | PdfOptions`
* **默认值**: `false`
* **详情**: 是否启用 PDF 嵌入语法

### bilibili

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 Bilibili 视频嵌入语法

### youtube

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 YouTube 视频嵌入语法

### artPlayer

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 ArtPlayer 视频嵌入语法

### audioReader

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 Audio Reader 音频嵌入语法

### codepen

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 CodePen 嵌入语法

### codeSandbox

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 CodeSandbox 嵌入语法

### jsfiddle

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 JS Fiddle 嵌入语法

### repl

* **类型**: `boolean | ReplOptions`
* **默认值**: `false`
* **详情**: 是否启用 Repl 容器语法

### caniuse

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 Can I Use 嵌入语法

### imageSize

* **类型**: `boolean | 'local' | 'all'`
* **默认值**: `false`
* **详情**: 是否启用 自动填充图片宽高属性

***

::: tip 以下配置字段由 [@vuepress/plugin-markdown-chart](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-chart/) 插件实现。
:::

### chartjs

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 Chart.js 图表嵌入语法

### echarts

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 ECharts 图表嵌入语法

### mermaid

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 Mermaid 图表嵌入语法

### markmap

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 Markmap 图表嵌入语法

### plantuml

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 PlantUML 图表嵌入语法

### flowchart

* **类型**: `boolean`
* **默认值**: `false`
* **详情**: 是否启用 Flowchart 图表嵌入语法
