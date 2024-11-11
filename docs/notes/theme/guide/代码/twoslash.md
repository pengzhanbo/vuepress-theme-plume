---
title: Two Slash
icon: material-symbols:experiment-outline
createTime: 2024/03/06 11:46:49
permalink: /guide/markdown/twoslash/
outline: [2, 4]
---

## 概述

为代码块添加支持 [TypeScript TwoSlash](https://www.typescriptlang.org/dev/twoslash/) 支持。
在代码块内提供内联类型提示。

该功能由 [shiki](https://shiki.style/) 和 [@shikijs/twoslash](https://shiki.style/packages/twoslash) 提供支持，
并整合在 [@vuepress-plume/plugin-shikiji](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-shikiji) 中。

::: important __twoslash__ 是一个高级功能，您需要熟练掌握 [TypeScript](https://www.typescriptlang.org/) 的知识，并且了解 [twoslash 语法](https://twoslash.netlify.app/)。
:::

::: warning
`twoslash` 是一个比较耗时的功能，由于它需要对代码进行类型编译，如果代码引入的包 比较大，会花费较长时间。

特别的，由于 vuepress 启动时，会预编译所有的 markdown 文件，因此它会直接影响 vuepress 的启动时间，
如果 包含了比较多的 `twoslash` 代码块，这可能会使 vuepress 启动时间变得很长。

比如，在未使用 `twoslash` 时，vuepress 的启动时间区间大约在 `300ms ~ 1000ms` 之间，而在使用 `twoslash` 后，
可能某一个 `twoslash` 的代码块编译耗时就需要额外再等待 `500ms` 以上。

但不必担心 markdown 文件热更新时的编译耗时，主题针对 代码高亮编译 耗时做了优化，即使 单个 markdown 文件
中包含多个 代码块，主题也仅会对 __有变更的代码块__ 进行编译，因此热更新的速度依然非常快。
:::

[twoslash](https://twoslash.netlify.app/) 是一种 `javascript` 和 `typescript` 标记语言。
你可以编写一个代码示例来描述整个 `javascript` 项目。

`twoslash` 将 __双斜杠注释__ (`//`) 视为 代码示例的预处理器。

`twoslash` 使用与文本编辑器相同的编译器 API 来提供类型驱动的悬停信息、准确的错误和类型标注。

## 功能预览

将鼠标悬停在 __变量__ 或 __函数__ 上查看效果：

```ts twoslash
import { getHighlighterCore } from 'shiki/core'

const highlighter = await getHighlighterCore({})
//      ^?
//

// @log: Custom log message
const a = 1
// @error: Custom error message
const b = 1
// @warn: Custom warning message
const c = 1
// @annotate: Custom annotation message
```

## 配置

### 启用功能

在 主题配置中，启用 `twoslash` 选项。

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      shiki: { twoslash: true },
    },
  }),
})
```

:::

### 从 `node_modules` 中导入类型文件

__twoslash__ 最大的特点就是对代码块进行类型编译，默认支持从项目的 `node_modules` 中导入类型文件。

例如，如果您需要使用 `express`的类型提示，你需要在项目中安装 `@types/express` 依赖：

::: npm-to

```sh
npm i -D @types/express
```

:::

然后，可以在 代码块中使用 `express` 的类型，如下所示：

```` md
```ts twoslash
import express from 'express'

const app = express()
```
````

### 导入本地类型文件

对于导入本地类型文件，由于代码块中的代码在编译时，并不容易确定代码的真实路径，我们很难直观的在 代码块中通过
__相对路径__ 导入类型文件。

#### 从 `tsconfig.json` 中读取路径映射

主题支持从项目根目录下的 `tsconfig.json`，读取 `compilerOptions.paths` 中的路径映射，来解决这个问题。

假设你的项目的 `tsconfig.json` 配置如下：

::: code-tabs
@tab tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

:::

你可以直接在 代码块中使用 `@/` 开头的路径，导入 `src` 目录下的类型文件，如下所示：

````md
```ts twoslash
import type { Foo } from '@/foo'

const foo: Foo = 1
```
````

#### 从 `shiki.twoslash` 中读取路径映射

你可以在 `shiki.twoslash` 中配置 `compilerOptions`，来解决这个问题，如下所示：

::: code-tabs
@tab .vuepress/config.ts

```ts
import path from 'node:path'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      shiki: {
        twoslash: {
          compilerOptions: { // [!code hl:8]
            paths: {
              // 相对于工作目录 `process.cwd()`
              '@/*': ['./src/*'],
              // 使用绝对路径
              '@@/*': [path.resolve(process.cwd(), './src/*')],
            }
          }
        }
      },
    },
  }),
})
```

:::

你可以直接在 代码块中使用 `@/` 开头的路径，导入 `src` 目录下的类型文件，如下所示：

````md
```ts twoslash
import type { Foo } from '@/foo'

const foo: Foo = 1
```
````

::: important
使用 `plugins.shiki.twoslash.compilerOptions` 可以更灵活的配置 类型编译，你可以在这里修改 `baseUrl` 等配置选项。

[参考 CompilerOptions](https://www.typescriptlang.org/tsconfig/#compilerOptions)

通常您只需要配置 `paths` 选项，其它选项保持默认即可，除非您了解您在配置什么。
:::

## 使用

::: warning `twoslash` 仅支持 `typescript` 和 `vue` 的 代码块。
:::

启用该功能后，你只需要在 原有的 markdown 代码块语法中，在代码语言声明后添加 `twoslash` 关键词即可：

````md
```ts twoslash  // [!code highlight]
const a = 1
```
````

主题仅会对有 `twoslash` 关键词的代码进行编译处理。

## 语法参考

完整语法请参考 [ts-twoslasher](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher) 和 [shikijs-twoslash](https://twoslash.netlify.app/)

`twoslash` 将 __双斜杠__ 视为代码示例的预处理器。
因此，所有的标记都是在 `//` 之后添加的。

### 符号标记

常用的 `twoslash` 标记：

#### `^?` {#extract-type}

使用 `^?` 可以提取位于其上方代码行中特定标识符的类型信息。

__输入：__

````md
```ts twoslash
const hi = 'Hello'
const msg = `${hi}, world`
//     ^?
```
````

__输出：__

```ts twoslash
const hi = 'Hello'
const msg = `${hi}, world`
//     ^?
//
```

::: important 符号 `^`必须正确指向需要突出显示类型的变量
:::

#### `^|` {#completions}

使用 `^|` ，可以提取特定位置的自动补全信息。

__输入：__

````md
```ts twoslash
// @noErrors
console.e
//       ^|
```
````

__输出：__

```ts twoslash
// @noErrors
console.e
//       ^|
//
```

::: important 符号`^`必须正确指向需要进行内容预测的位置
:::

Twoslash 会向 TypeScript 请求获取在 `^` 位置的自动补全建议，然后根据 `.` 后面的字母过滤可能的输出。
最多会显示 5 个内联结果，如果某个补全项被标记为已弃用，输出中会予以体现。

因此，在这种情况下，Twoslash 向 TypeScript 请求 `console` 的补全建议，然后筛选出以 `e` 开头的补全项。
注意，设置 `// @noErrors` 编译器标志，因为 `console.e` 是一个失败的 TypeScript 代码示例，但我们并不关心这一点。

#### `^^^` {#highlighting}

使用 `^^^` 来突出显示其上方某行的特定范围。

__输入：__

````md
```ts twoslash
function add(a: number, b: number) {
  //     ^^^
  return a + b
}
```
````

__输出：__

```ts twoslash
function add(a: number, b: number) {
  //     ^^^
  return a + b
}
```

::: important 使用连续多个符号`^`正确指向需要突出显示的范围
:::

### `@filename` {#import-files}

`@filename: <filename>` 用于声明后续的代码将来自哪个文件，
你可以在其他部分的代码中通过 `import` 导入该文件。

__输入：__

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

__输出：__

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

### 剪切代码

#### `---cut-before---` {#cut-before}

在 TypeScript 生成项目并提取所有编辑器信息（如标识符、查询、高亮等）后，剪切操作会修正所有偏移量和行号，
以适应较小的输出。

用户所见的内容为 `// ---cut-before---` 以下的部分。此外，还可使用简写形式 `// ---cut---` 。

__输入：__

````md
```ts twoslash
const level: string = 'Danger'
// ---cut---
console.log(level)
````

__输出：__

```ts twoslash
const level: string = 'Danger'
// ---cut---
console.log(level)
```

仅显示单个文件：

__输入：__

````md
```ts twoslash
// @filename: a.ts
export const helloWorld: string = 'Hi'
// ---cut---
// @filename: b.ts
import { helloWorld } from './a'

console.log(helloWorld)
```
````

__输出：__

```ts twoslash
// @filename: a.ts
export const helloWorld: string = 'Hi'
// ---cut---
// @filename: b.ts
import { helloWorld } from './a'

console.log(helloWorld)
```

只显示最后两行，但对 TypeScript 来说，这是一个包含两个文件的程序，并且所有 IDE 信息在文件间都正确连接。
这就是为什么 `// @filename: [file]` 是唯一不会被移除的 Twoslash 命令，因为如果不相关，它可以被 `---cut---` 掉。

#### `---cut-after---` {#cut-after}

`---cut-before---` 的兄弟，用于修剪符号后的所有内容：

__输入：__

````md
```ts twoslash
const level: string = 'Danger'
// ---cut-before---
console.log(level)
// ---cut-after---
console.log('This is not shown')
```
````

__输出：__

```ts twoslash
const level: string = 'Danger'
// ---cut-before---
console.log(level)
// ---cut-after---
console.log('This is not shown')
```

#### `---cut-start---` 和 `---cut-end---` {#cut-start-end}

你也可以使用 `---cut-start---` 和 `---cut-end---` 对来剪切两个符号之间的代码段。

__输入：__

````md
```ts twoslash
const level: string = 'Danger'
// ---cut-start---
console.log(level) // 这里是被剪切的
// ---cut-end---
console.log('This is shown')
```
````

__输出：__

```ts twoslash
const level: string = 'Danger'
// ---cut-start---
console.log(level) // 这里是被剪切的
// ---cut-end---
console.log('This is shown')
```

支持多个实例以剪切多个部分，但符号必须成对出现。

### 自定义输出信息 {id=twoslash-custom-message}

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

### 输出已编译文件

运行 Twoslash 代码示例会触发完整的 TypeScript 编译运行，该运行会在虚拟文件系统中创建文件。
你可以将代码示例的内容替换为对项目运行TypeScript后的结果。

#### `@showEmit`

`// @showEmit` 是 告诉 Twoslash 你希望将代码示例的输出替换为等效的 ·.js· 文件的主要命令。

__输入：__

````md
```ts twoslash
// @showEmit
const level: string = 'Danger'
```
````

__输出：__

```ts twoslash
// @showEmit
const level: string = 'Danger'
```

结果将显示此 `.ts` 文件所对应的 `.js` 文件。
可以看到 TypeScript 输出的内容中移除了 `: string` ，并添加了 `export {}`。

#### `@showEmittedFile: [file]`

虽然 `.js` 文件可能是开箱即用最有用的文件，但 TypeScript 确实会在启用正确标志时发出其他文件（`.d.ts`和 `.map`），
并且在有多文件代码示例时，你可能需要告诉 Twoslash 显示哪个文件。
对于所有这些情况，你也可以添加 `@showEmittedFile: [file]` 来告诉 Twoslash 你想显示哪个文件。

__显示TypeScript代码示例的 `.d.ts` 文件：__

__输入：__

````md
```ts twoslash
// @declaration
// @showEmit
// @showEmittedFile: index.d.ts
export const hello = 'world'
```
````

__输出：__

```ts twoslash
// @declaration
// @showEmit
// @showEmittedFile: index.d.ts
export const hello = 'world'
```

__显示 JavaScript 到 TypeScript 的 `.map` 文件：__

__输入：__

````md
```ts twoslash
// @sourceMap
// @showEmit
// @showEmittedFile: index.js.map
export const hello = 'world'
```
````

__输出：__

```ts twoslash
// @sourceMap
// @showEmit
// @showEmittedFile: index.js.map
export const hello = 'world'
```

__显示 `.d.ts` 文件的 `.map`（主要用于项目引用）：__

__输入：__

````md
```ts twoslash
// @declaration
// @declarationMap
// @showEmit
// @showEmittedFile: index.d.ts.map
export const hello: string = 'world'
```
````

__输出：__

```ts twoslash
// @declaration
// @declarationMap
// @showEmit
// @showEmittedFile: index.d.ts.map
export const hello: string = 'world'
```

__为 `b.ts` 生成 `.js` 文件：__

__输入：__

````md
```ts twoslash
// @showEmit
// @showEmittedFile: b.js
// @filename: a.ts
export const helloWorld: string = 'Hi'

// @filename: b.ts
import { helloWorld } from './a'
console.log(helloWorld)
```
````

__输出：__

```ts twoslash
// @showEmit
// @showEmittedFile: b.js
// @filename: a.ts
export const helloWorld: string = 'Hi'

// @filename: b.ts
import { helloWorld } from './a'
console.log(helloWorld)
```

### `@errors`

`@errors: <error code>` 显示代码是如何出现错误的：

__输入：__

````md
```ts twoslash
// @errors: 2322 2588
const str: string = 1
str = 'Hello'
````

__输出：__

```ts twoslash
// @errors: 2322 2588
const str: string = 1
str = 'Hello'
```

你需要在 `@errors` 后面，声明对应的 `typescript` 错误码。使用空格分隔多个错误代码。

::: note
如果你不知道应该添加哪个 错误码，你可以先尝试直接编写好代码，然后等待编译失败，
你应该能够在控制台中查看到相关的错误信息，然后在错误信息的 `description` 中找到对应的错误码。
然后再将错误码添加到 `@errors` 中。

不用担心变异失败会终止进程，主题会在编译失败时显示错误信息，同时在代码块中输出未编译的代码。
:::

### `@noErrors`

在代码中屏蔽所有错误。你还可以提供错误代码来屏蔽特定错误。

__输入：__

````md
```ts twoslash
// @noErrors
const str: string = 1
str = 'Hello'
```
````

__输出：__

```ts twoslash
// @noErrors
const str: string = 1
str = 'Hello'
```

### `@noErrorsCutted`

忽略在剪切代码中发生的错误。

__输入：__

````md
```ts twoslash
// @noErrorsCutted
const hello = 'world'
// ---cut-after---
hello = 'hi' // 本应为错误，但因被截断而忽略。
```
````

__输出：__

```ts twoslash
// @noErrorsCutted
const hello = 'world'
// ---cut-after---
hello = 'hi' // 本应为错误，但因被截断而忽略。
```

### `@noErrorValidation`

禁用错误验证，错误信息仍将呈现，但 Twoslash 不会抛出编译时代码中的错误。

__输入：__

````md
```ts twoslash
// @noErrorValidation
const str: string = 1
```
````

__输出：__

```ts twoslash
// @noErrorValidation
const str: string = 1
```

### `@keepNotations`

告知Twoslash不要移除任何注释，并保持原始代码不变。节点将包含原始代码的位置信息。

__输入：__

````md
```ts twoslash
// @keepNotations
// @module: esnext
// @errors: 2322
const str: string = 1
```
````

__输出：__

```ts twoslash
// @keepNotations
// @module: esnext
// @errors: 2322
const str: string = 1
```

### 覆盖编译器选项

使用 `// @name` 和 `// @name: value` 注释来覆盖 TypeScript 的[编译器选项](https://www.typescriptlang.org/tsconfig#compilerOptions)。
这些注释将从输出中移除。

__输入：__

````md
```ts twoslash
// @noImplicitAny: false
// @target: esnext
// @lib: esnext
// 这本应抛出一个错误，
// 但由于我们禁用了noImplicitAny，所以不会抛出错误。
const fn = a => a + 1
```
````

__输出：__

```ts twoslash
// @noImplicitAny: false
// @target: esnext
// @lib: esnext
// 这本应抛出一个错误，
// 但由于我们禁用了noImplicitAny，所以不会抛出错误。
const fn = a => a + 1
```
