---
title: 试验性
author: pengzhanbo
icon: material-symbols:experiment-outline
createTime: 2024/03/06 11:46:49
permalink: /guide/markdown/experiment/
---

## twoslash <Badge type="tip" text="实验性" />

为代码块添加支持 [TypeScript TwoSlash](https://www.typescriptlang.org/dev/twoslash/) 支持。
在代码块内提供内联类型提示。

该功能由 [shiki](https://shiki.style/) 和 [@shikijs/twoslash](https://shiki.style/packages/twoslash) 提供支持，并整合在 [@vuepress-plume/plugin-shikiji](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-shikiji) 中。

> [!important]
> 该功能当前仅在以下版本中通过可用性验证，在后续的所有的版本中均不能保证其可用性，请谨慎使用：
> - [x] `vuepress@2.0.0-rc.0`
> - [x] `vuepress@2.0.0-rc.2`
> - [x] `vuepress@2.0.0-rc.7`
> - [x] `vuepress@2.0.0-rc.8`

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

> [!warning]
> 启用该功能需要对 `@vuepress/markdown` 包的源码进行修改，此操作具有一定的风险。
>
> 由于需要通过 `pnpm patch` 对 `@vuepress/markdown` 包进行补丁。因此，你需要使用
> `pnpm` 作为你的项目的包管理器。

#### 步骤一

在项目根目录下，通过 `pnpm patch` 命令对 `@vuepress/markdown` 包进行补丁:

```sh
$ pnpm patch @vuepress/markdown --edit-dir _tmp/vuepress__markdown
```

该命令将会在你的项目根目录下生成一个 `_tmp/vuepress__markdown` 目录，该目录将会包含 `@vuepress/markdown` 包的源码。

#### 步骤二

修改 `@vuepress/markdown` 包的源码, 打开 `_tmp/vuepress__markdown/dist/index.js` 文件，
找到 `270` 行，其内容如下：

```ts
const code = options.highlight?.(token.content, language.name, '') || md.utils.escapeHtml(token.content)
```

对其进行修改：

```ts
const code = options.highlight?.(token.content, language.name, '') || md.utils.escapeHtml(token.content) // [!code --]
const code = options.highlight?.(token.content, language.name, info || '') || md.utils.escapeHtml(token.content) // [!code ++]
```

你可以直接复制上面的代码内容，然后粘贴到 `_tmp/vuepress__markdown/dist/index.js` 文件中替换 `248` 行。

#### 步骤三

将源码修改进行 补丁提交，执行下面的命令：

```sh
$ pnpm patch-commit '_tmp/vuepress__markdown'
```

此命令将会在你的项目根目录下生成一个 `patch` 目录，该目录将会包含 `@vuepress/markdown` 包的补丁，
并提供 `patchedDependencies` 字段注册到你的项目中。

之后你就可以选择 删除 `_tmp/vuepress__markdown` 目录了。

#### 步骤四

在 主题配置中，将 `twoslash` 选项打开。

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
