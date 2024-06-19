---
title: Two Slash
author: pengzhanbo
icon: material-symbols:experiment-outline
createTime: 2024/03/06 11:46:49
permalink: /guide/markdown/experiment/
---

## twoslash <Badge type="tip" text="实验性" />

为代码块添加支持 [TypeScript TwoSlash](https://www.typescriptlang.org/dev/twoslash/) 支持。
在代码块内提供内联类型提示。

该功能由 [shiki](https://shiki.style/) 和 [@shikijs/twoslash](https://shiki.style/packages/twoslash) 提供支持，
并整合在 [@vuepress-plume/plugin-shikiji](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-shikiji) 中。

:::important
从 `vuepress@2.0.0-rc.12` 开始，不再需要对 `@vuepress/markdown` 进行额外的 hack 操作，
因此，现在你可以安全的使用这项功能了！
:::

::: warning
`twoslash` 是一个比较耗时的功能，由于它需要对代码进行类型编译，如果代码引入的包 比较大，会花费较长时间。

特别的，由于 vuepress 启动时，会预编译所有的 markdown 文件，因此它会直接影响 vuepress 的启动时间，
如果 包含了比较多的 `twoslash` 代码块，这可能会使 vuepress 启动时间变得很长。

比如，在未使用 `twoslash` 时，vuepress 的启动时间区间大约在 `300ms ~ 1000ms` 之间，而在使用 `twoslash` 后，
可能某一个 `twoslash` 的代码块编译耗时就需要额外再等待 `500ms` 以上。

但不必担心 markdown 文件热更新时的编译耗时，主题针对 代码高亮编译 耗时做了优化，即使 单个 markdown 文件
中包含多个 代码块，主题也仅会对 **有变更的代码块** 进行编译，因此热更新的速度依然非常快。
:::

### 概述

[twoslash](https://shikijs.github.io/twoslash/) 是一种 `javascript` 和 `typescript` 标记语言。
你可以编写一个代码示例来描述整个 `javascript` 项目。

`twoslash` 将 **双斜杠** 作为 代码示例的预处理器。

`twoslash` 使用与文本编辑器相同的编译器 API 来提供类型驱动的悬停信息、准确的错误和类型标注。

### 功能预览

````md
```ts twoslash
import { getHighlighterCore } from 'shiki/core'

const highlighter = await getHighlighterCore({})
//      ^?

// @log: Custom log message
const a = 1
// @error: Custom error message
const b = 1
// @warn: Custom warning message
const c = 1
// @annotate: Custom annotation message
```
````

将鼠标悬停在 `highlighter` 变量上查看效果：

```ts twoslash
import { getHighlighterCore } from 'shiki/core'

const highlighter = await getHighlighterCore({})
//      ^?

// @log: Custom log message
const a = 1
// @error: Custom error message
const b = 1
// @warn: Custom warning message
const c = 1
// @annotate: Custom annotation message
```

::: tip
`twoslash` 仅支持 `typescript` 和 `vue` 的 代码块。
:::

### 开启功能

在 主题配置中，启用 `twoslash` 选项。

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      shiki: { twoslash: true },
    },
  }),
})
```

### 使用

启用该功能后，你只需要在 原有的 markdown 代码块语法中，在代码语言声明后添加 `twoslash` 关键词即可：

````md
```ts twoslash  // [!code highlight]
const a = 1
```
````

主题仅会对有 `twoslash` 关键词的代码进行编译处理。

### 语法参考

完整语法请参考 [ts-twoslasher](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher) 和 [shikijs-twoslash](https://shikijs.github.io/twoslash/)

`twoslash` 将 **双斜杠** 视为代码示例的预处理器。
因此，所有的标记都是在 `//` 之后添加的。

常用的 `twoslash` 标记：

#### `^?` {id=twoslash-hover}

`^?` 用于突出显示类型，而无需用户进行悬停交互：

````md
```ts twoslash
const a = 1
//    ^?
```
````

```ts twoslash
const a = 1
//    ^?
//
```

**需要注意的是，`^`必须正确指向需要突出显示类型的变量**

#### `^|` {id=twoslash-list}

`^|` 可以将展示代码编辑过程中的内容预测列表，如编辑器中的自动完成功能：

````md
```ts twoslash
// @noErrors
// @esModuleInterop
import express from 'express'
const app = express()
app.get('/', (req, res) => {
  res.sen
//      ^|
})
app.listen(3000)
```
````

```ts twoslash
// @noErrors
// @esModuleInterop
import express from 'express'
const app = express()
app.get('/', (req, res) => {
  res.sen
//       ^|
})
app.listen(3000)
//
//
//
```

**需要注意的是，`^`必须正确指向需要进行内容预测的位置**

这些类型提示并不是凭空而来的，它依赖于你的项目中的 `node_modules`。比如 `express`。
你需要在项目中 安装 `@types/express` 才能使用这些类型提示。

#### `@errors` {id=twoslash-errors}

`@errors: <error code>` 显示代码是如何出现错误的：

````md
```ts twoslash
// @errors: 2339
const welcome = 'Tudo bem gente?'
const words = welcome.contains(' ')
```
````

```ts twoslash
// @errors: 2339
const welcome = 'Tudo bem gente?'
const words = welcome.contains(' ')
```

你需要在 `@errors` 后面，声明对应的 `typescript` 错误码。

::: note
如果你不知道应该添加哪个 错误码，你可以先尝试直接编写好代码，然后等待编译失败，
你应该能够在控制台中查看到相关的错误信息，然后在错误信息的 `description` 中找到对应的错误码。
然后再将错误码添加到 `@errors` 中
:::

#### `---cut---` {id=twoslash-cut}

`---cut---` 用于将代码分割, 被 `---cut---` 标记的，在其之前的代码将被忽略，不会显示：

````md
```ts twoslash
const hi = 'hi'
// ---cut---
const msg = `${hi} words` as const
//    ^?
```
````

```ts twoslash
const hi = 'hi'
// ---cut---
const msg = `${hi} words` as const
//    ^?
//
```

#### 自定义输出信息 {id=twoslash-custom-message}

`@log`, `@error`, `@warn` 和 `@annotate` 用于向用户输出不同级别的自定义信息

````md
```ts twoslash
// @log: Custom log message
const a = 1
// @error: Custom error message
const b = 1
// @warn: Custom warning message
const c = 1
// @annotate: Custom annotation message
```
````

```ts twoslash
// @log: Custom log message
const a = 1
// @error: Custom error message
const b = 1
// @warn: Custom warning message
const c = 1
// @annotate: Custom annotation message
```

#### import_files {id=twoslash-import-files}

`@filename: <filename>` 用于声明后续的代码将来自哪个文件，
你可以在其他部分的代码中通过 `import` 导入该文件。

````md
```ts twoslash
// @filename: sum.ts
export function sum(a: number, b: number): number {
  return a + b
}

// @filename: ok.ts
import { sum } from './sum'
sum(1, 2)

// @filename: error.ts
// @errors: 2345
import { sum } from './sum'
sum(4, 'woops')
```
````

```ts twoslash
// @filename: sum.ts
export function sum(a: number, b: number): number {
  return a + b
}

// @filename: ok.ts
import { sum } from './sum'
sum(1, 2)

// @filename: error.ts
// @errors: 2345
import { sum } from './sum'
sum(4, 'woops')
```

::: warning
在本节中未提及的其他标记，由于未正式验证其是否可用，请谨慎使用。
:::
