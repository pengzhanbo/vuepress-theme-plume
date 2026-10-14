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
      icon: { provider: 'iconify' },
      math: { type: 'katex' },
      include: {
        // ...option
      },
    },
  }),
})
```

## 配置项

只要没有显式设置 `plugins.markdownPower: false`，主题就会默认注入 `plot`、`fileTree` 与图标支持三项，
因此隐秘文本、文件树、`::name::` 图标语法**默认启用**，无需额外配置。

其余功能默认关闭，需要按需开启。

以下字段按所属插件分组。

### 由 `@vuepress/plugin-markdown-hint` 实现

#### hint

* **类型：** `boolean`
* **默认值：** `true`
* **详情：** 是否启用提示容器

#### alert

* **类型：** `boolean`
* **默认值：** `true`
* **详情：** 是否启用 GitHub 风格的警告语法。
  主题默认开启 [obsidian 兼容](#obsidian)，该语法由 obsidian callout 渲染；
  仅当 `markdown.obsidian` 被显式设置为 `false` 时，改由 markdown-hint 渲染。

### 由 `@vuepress/plugin-markdown-image` 实现

#### image

* **类型：** `false | MarkdownImagePluginOptions`
* **默认值：** `false`
* **详情：** 是否启用图片增强语法

### 由 `@vuepress/plugin-markdown-math` 实现

#### math

* **类型：** `false | MarkdownMathPluginOptions`
* **默认值：** `{ type: 'katex' }`
* **详情：** 是否启用数学支持

### 由 `@vuepress/plugin-markdown-include` 实现

#### include

* **类型：** `false | MarkdownIncludePluginOptions`
* **默认值：** `true`
* **详情：** 是否启用 Markdown 文件导入

### 由 `vuepress-plugin-md-power` 实现

该组字段的完整说明见 [markdown-power 插件](./plugins/markdown-power.md)。

#### env

* **类型：** `MarkdownEnvPreset`
* **默认值：** `undefined`
* **详情：** 预设 markdown 环境，如预设链接引用、缩写词、内容注释等。预设可在任意 markdown 文件中直接使用

#### annotation

* **类型：** `boolean | MarkdownEnvPreset['annotations']`
* **默认值：** `false`
* **详情：** 是否启用内容注释，或直接预设内容注释

#### abbr

* **类型：** `boolean | MarkdownEnvPreset['abbreviations']`
* **默认值：** `false`
* **详情：** 是否启用缩写语法，或直接预设缩写词

#### mark

* **类型：** `MarkOptions`
* **默认值：** `'eager'`
* **详情：** 设置 `==马克笔==` 的动画播放模式

#### encrypt

* **类型：** `boolean | EncryptSnippetOptions`
* **默认值：** `false`
* **详情：** 是否启用内容片段加密容器

#### codeTabs

* **类型：** `CodeTabsOptions`（`{ icon?: boolean }`）
* **默认值：** `{ icon: true }`
* **详情：** 代码块分组容器的图标配置。`::: code-tabs` 容器**默认启用**，此选项仅用于控制是否显示语言图标

> `::: tabs` 选项卡容器同样**默认可用**，且没有任何配置项，无需设置。

#### codeTree

* **类型：** `boolean | CodeTreeOptions`
* **默认值：** `false`
* **详情：** 是否启用代码树容器语法与嵌入语法

#### npmTo

* **类型：** `boolean | NpmToOptions`
* **默认值：** `false`
* **详情：** 是否启用 `npm-to` 容器

#### icon

* **类型：** `IconOptions`
* **默认值：** `{ provider: 'iconify' }`
* **详情：** 图标渲染配置（提供商、前缀、尺寸、颜色、资源等）。`::name::` 图标语法**默认可用**，此选项用于定制渲染行为

  [查看 **icon** 使用说明](../guide/features/icon.md){.read-more}

#### plot

* **类型：** `boolean | PlotOptions`
* **默认值：** `true`
* **详情：** 是否启用隐秘文本语法

#### fileTree

* **类型：** `boolean | FileTreeOptions`
* **默认值：** `true`
* **详情：** 是否启用文件树容器语法

#### field

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用字段容器，即 [`field-group`](../guide/markdown/v-field.md) 与 `field` 容器

#### table

* **类型：** `boolean | TableContainerOptions`
* **默认值：** `false`
* **详情：** 是否启用表格增强容器

#### timeline

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用时间线容器语法

#### collapse

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用折叠面板容器语法

#### chat

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用对话记录容器

#### demo

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 Demo 容器

#### pdf

* **类型：** `boolean | PDFOptions`
* **默认值：** `false`
* **详情：** 是否启用 PDF 嵌入语法

#### acfun

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 AcFun 视频嵌入语法

#### bilibili

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 Bilibili 视频嵌入语法

#### youtube

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 YouTube 视频嵌入语法

#### artPlayer

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 ArtPlayer 视频嵌入语法

#### audioReader

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 Audio Reader 音频嵌入语法

#### codepen

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 CodePen 嵌入语法

#### codeSandbox

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 CodeSandbox 嵌入语法

#### jsfiddle

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 JS Fiddle 嵌入语法

#### replit&#x20;

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 Repl.it 嵌入语法，请改用 `repl`

#### repl

* **类型：** `false | ReplOptions`
* **默认值：** `false`
* **详情：** 是否启用 Repl 容器语法

#### caniuse

* **类型：** `boolean | CanIUseOptions`
* **默认值：** `false`
* **详情：** 是否启用 Can I Use 嵌入语法

#### qrcode

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用二维码嵌入语法

#### obsidian

* **类型：** `boolean | ObsidianOptions`
* **默认值：** 主题默认为启用状态（未显式设置为 `false` 时即启用）
* **详情：** 是否启用 obsidian 官方 markdown 扩展语法的兼容性支持，包括 wiki link、嵌入、callout 与注释

#### locales

* **类型：** `LocaleConfig<MDPowerLocaleData>`
* **默认值：** `undefined`
* **详情：** markdown-power 插件的多语言文本配置

#### imageSize

* **类型：** `boolean | 'local' | 'all'`
* **默认值：** `false`
* **详情：** 是否启用自动填充图片宽高属性。该功能仅在构建生产包时生效

### 由 `@vuepress/plugin-markdown-chart` 实现

#### chartjs

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 Chart.js 图表嵌入语法

#### echarts

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 ECharts 图表嵌入语法

#### mermaid

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 Mermaid 图表嵌入语法

#### markmap

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 Markmap 图表嵌入语法

#### plantuml

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 PlantUML 图表嵌入语法

#### flowchart

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否启用 Flowchart 图表嵌入语法

#### DANGEROUS_ALLOW_SCRIPT_EXECUTION

* **类型：** `boolean`
* **默认值：** `false`
* **详情：** 是否允许图表脚本执行。启用后图表内容中的脚本会被执行，可能带来 XSS 或远程代码执行风险，请仅在内容来源完全可信时开启。

#### DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST

* **类型：** `string[] | '*'`
* **默认值：** `undefined`
* **详情：** 允许执行图表脚本的源文件列表（允许清单），仅在 `DANGEROUS_ALLOW_SCRIPT_EXECUTION` 为 `true` 时生效；传入 `'*'` 表示允许所有源文件。
