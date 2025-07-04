---
url: /config/plugins/code-highlight/index.md
---
## 概述

主题内置的代码高亮插件， 对代码块进行代码高亮。

关联插件：[@vuepress/plugin-shiki](https://ecosystem.vuejs.press/zh/plugins/markdown/shiki.html)

主题 使用 [Shiki](https://github.com/shikijs/shiki) 在 Markdown 代码块中使用彩色文本实现语法高亮。
Shiki 支持多种编程语言。

在 Shiki 的代码仓库中，可以找到 [合法的编程语言列表](https://shiki.style/languages) 。

## 特性

* [代码块标题](../../guide/code/features.md#代码块标题)
* [代码行高亮](../../guide/code/features.md#在代码块中实现行高亮)
* [代码聚焦](../../guide/code/features.md#代码块中聚焦)
* [代码对比差异](../../guide/code/features.md#代码块中的颜色差异)
* [代码高亮“错误”和“警告”](../../guide/code/features.md#高亮-错误-和-警告)
* [代码词高亮](../../guide/code/features.md#代码块中-词高亮)
* [代码块折叠](../../guide/code/features.md#折叠代码块)
* [twoslash](../../guide/code/twoslash.md#twoslash) ：在代码块内提供内联类型提示。

## 配置

默认配置：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
      notationDiff: true,
      notationErrorLevel: true,
      notationFocus: true,
      notationHighlight: true,
      notationWordHighlight: true,
      highlightLines: true,
      collapsedLines: false,
      lineNumbers: true,
    },
    // 也可以通过 plugins.shiki 配置，但不推荐
    plugins: {
      shiki: {}
    }
  }),
})
```

### themes

* 类型: `{ light: string, dark: string }`
* 默认值: `{ light: 'vitesse-light', dark: 'vitesse-dark' }`

代码高亮主题，支持 浅色/暗色 双主题。

可在 支持的 [主题列表](https://shiki.style/themes) 中选择你喜欢的主题。

### langs

* 类型: `string[]`
* 默认值: `[]`

需要高亮的编程语言， 例如 `javascript`、`typescript`、`python`、`java`、`c++`、`c#`等。
默认会根据代码块的语言自动识别。

在 Shiki 的代码仓库中，可以找到 [合法的编程语言列表](https://shiki.style/languages) 。

### defaultLang

* 类型： `string`
* 默认值： `text`

指定的语言不可用时所使用的备选语言。

### lineNumbers

* 类型：`boolean | number`
* 默认值： `true`

是否显示行号。

`true`： 显示行号\
`false`： 不显示行号\
`number`： 指定需要显式代码行号的最小行数。

### twoslash

* 类型: `boolean | ShikiTwoslashOptions`
* 默认值: `false`

是否启用 对 `typescript` 和 `vue` 语言的 类型提示 支持。

### whitespace

* 类型: `boolean | 'all' | 'boundary' | 'trailing'`
* 默认值: `false`

将空白字符（Tab 和空格）渲染为单独的标签（具有 tab 或 space 类名）。

效果：

### collapsedLines

* 类型: `boolean | number`
* 默认值： `false`

将代码块折叠到指定行数。

### transformers

* 类型: `ShikiTransformer[]`
* 默认值: `[]`

代码转换器， 查看 [shiki transformers](https://shiki.style/guide/transformers) 了解更多信息。
