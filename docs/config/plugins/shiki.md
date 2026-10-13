---
title: 代码高亮
createTime: 2024/03/06 10:21:47
permalink: /config/plugins/code-highlight/
---

## 概述

主题内置的代码高亮插件， 对代码块进行代码高亮。

关联插件：[@vuepress/plugin-shiki](https://ecosystem.vuejs.press/zh/plugins/markdown/shiki.html)

主题使用 [Shiki](https://github.com/shikijs/shiki) 在 Markdown 代码块中使用彩色文本实现语法高亮。
Shiki 支持多种编程语言。

在 Shiki 的代码仓库中，可以找到 [合法的编程语言列表](https://shiki.style/languages) 。

## 特性

- [代码块标题](../../guide/code/features.md#代码块标题)
- [代码行高亮](../../guide/code/features.md#在代码块中实现行高亮)
- [代码聚焦](../../guide/code/features.md#代码块中聚焦)
- [代码对比差异](../../guide/code/features.md#代码块中的颜色差异)
- [代码高亮“错误”和“警告”](../../guide/code/features.md#高亮-错误-和-警告)
- [代码词高亮](../../guide/code/features.md#代码块中词高亮)
- [代码块折叠](../../guide/code/features.md#折叠代码块)
- [twoslash](../../guide/code/twoslash.md) ：在代码块内提供内联类型提示。

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
  }),
})
```

关于配置入口的优先级说明，请参考 [插件配置入口](./README.md#配置入口优先级)。

### theme

- 类型: `string | ThemeRegistration`
- 默认值: 主题默认注入 `themes: { light: 'vitesse-light', dark: 'vitesse-dark' }`

单主题配置，与 `themes` 二选一。
一旦传入 `theme`，主题就**不再注入**默认的浅色/暗色双主题。

### themes

- 类型: `{ light: string, dark: string }`
- 默认值: `{ light: 'vitesse-light', dark: 'vitesse-dark' }`

代码高亮主题，支持浅色/暗色双主题。

可在支持的 [主题列表](https://shiki.style/themes) 中选择你喜欢的主题。

### langs

- 类型: `string[]`
- 默认值: `[]`

需要高亮的编程语言， 例如 `javascript`、`typescript`、`python`、`java`、`c++`、`c#`等。
默认会根据代码块的语言自动识别。

在 Shiki 的代码仓库中，可以找到 [合法的编程语言列表](https://shiki.style/languages) 。

### langAlias

- 类型: `Record<string, string>`
- 默认值: `{}`

自定义语言别名，例如 `{ 'my-lang': 'javascript' }`。

查看 [自定义语言别名](https://shiki.style/guide/load-lang#custom-language-aliases) 了解更多。

### defaultLang

- 类型： `string`
- 默认值： `plain`

指定的语言不可用时所使用的备选语言。语言不可用时会输出一条警告（`logLevel` 为 `silent` 时静默）。

### lineNumbers

- 类型： `boolean | number`
- 默认值： `true`

是否显示代码行号。

- `true`：总是显示行号
- `false`：不显示行号
- `number`：仅当代码块行数不少于该值时显示行号

单个代码块可以使用 `:line-numbers` / `:no-line-numbers` 覆盖该配置。

### twoslash

- 类型: `boolean | ShikiTwoslashOptions`
- 默认值: `false`

是否启用对 `typescript` 和 `vue` 语言的类型提示支持。

### whitespace

- 类型: `boolean | 'all' | 'boundary' | 'leading' | 'trailing'`
- 默认值: `false`

将空白字符（Tab 和空格）渲染为单独的标签（具有 tab 或 space 类名）。

- `true`：启用空白字符渲染，但默认不渲染任何空白字符
- `false`：完全禁用
- `'all'`：渲染所有空白字符
- `'boundary'`：渲染每行的前导与尾随空白字符
- `'leading'`：渲染每行的前导空白字符
- `'trailing'`：渲染每行的尾随空白字符

单个代码块可使用 `:whitespace`、`:no-whitespace` 或 `:whitespace=all|boundary|leading|trailing` 覆盖。

效果：

<!-- @include: ../../snippet/whitespace.snippet.md{17-23} -->

### collapsedLines

- 类型: `boolean | number | 'disable'`
- 默认值： `false`（主题显式设置，`'disable'` 表示完全不注册该功能）

将代码块折叠到指定行数。`number` 表示折叠阈值，`false` 表示不折叠。

单个代码块可使用 `:collapsed-lines`、`:collapsed-lines=10`、`:no-collapsed-lines` 覆盖。

### removeLastLine

- 类型: `boolean`
- 默认值: `false`

在计算行号与折叠行数时，是否移除代码块的最后一行（用于忽略结尾空行）。

### renderIndentGuides

- 类型: `boolean | Partial<TransformerRenderIndentGuidesOptions>`
- 默认值: `false`

是否在代码块中渲染缩进参考线。启用后，代码中的缩进会显示为可视化的参考线，便于阅读嵌套较深的代码。

### colorizedBrackets

- 类型: `boolean | Partial<TransformerColorizedBracketsOptions>`
- 默认值: `false`

是否为代码块中的括号添加颜色匹配。启用后，成对的括号会以不同颜色显示，便于识别代码中的括号匹配关系。

### transformers

- 类型: `ShikiTransformer[]`
- 默认值: `[]`

代码转换器， 查看 [shiki transformers](https://shiki.style/guide/transformers) 了解更多信息。

### shikiSetup

- 类型: `(shiki: Highlighter) => Promise<void> | void`
- 默认值: `undefined`

用于自定义 Shiki 高亮器实例的函数，在高亮器创建后、加载语言与主题之前调用。

### removeComments

- 类型: `boolean`
- 默认值: `false`

是否移除代码块中的注释。

### logLevel

- 类型: `'debug' | 'silent' | 'warn'`
- 默认值: `'warn'`（启用 `--debug` 标志时为 `'debug'`）

高亮器语言检测器的日志级别。代码块使用了不可用的语言时，
`warn` 会输出警告、`debug` 会额外输出信息、`silent` 静默。

### preWrapper

- 类型: `boolean`
- 默认值: `true`

是否在 `<pre>` 外层包裹一个 `<div>`。
行号、代码块标题与折叠功能都依赖该包裹层，除非你完全清楚其作用，否则不要关闭。

### codeBlockTitle

- 类型: `CodeBlockTitleRender | boolean`
- 默认值: `true`（**由主题接管**）

::: warning 该字段传入自定义实现不会生效
主题固定使用内置的 `codeBlockTitle` 渲染器输出带文件图标的代码块标题，
`codeHighlighter.codeBlockTitle` 会被直接忽略。
:::
