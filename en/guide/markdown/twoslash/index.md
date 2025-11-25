---
url: /en/guide/markdown/twoslash/index.md
---
## Overview

Adds support for [TypeScript TwoSlash](https://www.typescriptlang.org/dev/twoslash/) in code blocks. Provides inline type hints within code blocks.

This feature is powered by [shiki](https://shiki.style/) and [@shikijs/twoslash](https://shiki.style/packages/twoslash), and integrated in [@vuepress-plume/plugin-shikiji](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/plugins/plugin-shikiji).

::: important **twoslash** is an advanced feature that requires proficiency in
[TypeScript](https://www.typescriptlang.org/) and understanding of [twoslash syntax](https://twoslash.netlify.app/).
:::

::: warning
`twoslash` is a relatively time-consuming feature. Since it requires type compilation of code,
if the code imports large packages, it can take considerable time.

Specifically, since VuePress pre-compiles all markdown files on startup, this directly affects VuePress startup time.
If you include many `twoslash` code blocks, this may significantly increase VuePress startup time.

For example, without `twoslash`, VuePress startup time typically ranges from `300ms ~ 1000ms`.
With `twoslash`, compiling a single `twoslash` code block may require an additional `500ms` or more.

However, don't worry about compilation time during markdown file hot updates.
The theme optimizes code highlighting compilation time - even if a single markdown file contains
multiple code blocks, the theme only compiles **modified code blocks**, so hot updates remain fast.
:::

[twoslash](https://twoslash.netlify.app/) is a `JavaScript` and `TypeScript` markup language.
You can write code examples that describe entire `JavaScript` projects.

`twoslash` treats **double-slash comments** (`//`) as preprocessor directives for code examples.

`twoslash` uses the same compiler APIs as text editors to provide type-driven hover information, accurate errors, and type annotations.

## Feature Preview

Hover over **variables** or **functions** to see the effect:

```ts twoslash
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({ themes: ['nord'], langs: ['javascript'] })
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

## Configuration

### Enabling the Feature

Before enabling this feature, you need to install the `@vuepress/shiki-twoslash` package:

::: npm-to

```sh
npm i @vuepress/shiki-twoslash
```

:::

Enable the `twoslash` option in the theme configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      twoslash: true,
    },
  }),
})
```

::: important
For most users, `twoslash` is not a necessary feature, and `twoslash`-related dependencies have large
package sizes. Therefore, all `twoslash` implementations have been moved to `@vuepress/shiki-twoslash`,
which effectively reduces the initial installation size of the theme.

You only need to install `@vuepress/shiki-twoslash` when you require the `twoslash` feature.
:::

### Importing Type Files from `node_modules`

The main feature of **twoslash** is type compilation of code blocks, which natively supports importing type files from your project's `node_modules`.

For example, if you need type hints for `express`, you need to install the `@types/express` dependency in your project:

::: npm-to

```sh
npm i -D @types/express
```

:::

Then, you can use `express` types in code blocks as follows:

````md
```ts twoslash
import express from 'express'

const app = express()
```
````

### Importing Local Type Files

For importing local type files, since it's difficult to determine the real path of code in code blocks
during compilation, it's not intuitive to import type files via **relative paths** in code blocks.

#### Reading Path Mappings from `tsconfig.json`

The theme supports reading path mappings from `compilerOptions.paths` in `tsconfig.json` at the project root to solve this issue.

Assume your project's `tsconfig.json` is configured as follows:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

You can directly use paths starting with `@/` in code blocks to import type files from the `src` directory:

````md
```ts twoslash
import type { Foo } from '@/foo'

const foo: Foo = 1
```
````

#### Reading Path Mappings from `shiki.twoslash`

You can configure `compilerOptions` in `shiki.twoslash` to solve this issue:

```ts title=".vuepress/config.ts"
import path from 'node:path'

export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      twoslash: {
        compilerOptions: { // [!code hl:8]
          paths: {
            // Relative to working directory `process.cwd()`
            '@/*': ['./src/*'],
            // Using absolute paths
            '@@/*': [path.resolve(process.cwd(), './src/*')],
          }
        }
      }
    },
  }),
})
```

You can directly use paths starting with `@/` in code blocks to import type files from the `src` directory:

````md
```ts twoslash
import type { Foo } from '@/foo'

const foo: Foo = 1
```
````

::: important
Using `plugins.shiki.twoslash.compilerOptions` allows more flexible configuration of type compilation.
You can modify `baseUrl` and other configuration options here.

[Refer to CompilerOptions](https://www.typescriptlang.org/tsconfig/#compilerOptions)

Usually you only need to configure the `paths` option, keeping other options default unless you understand what you're configuring.
:::

## Usage

::: warning `twoslash` only supports `typescript` and `vue` code blocks.
:::

After enabling this feature, simply add the `twoslash` keyword after the code language declaration in your existing markdown code block syntax:

````md{1}
```ts twoslash
const a = 1
```
````

The theme only processes code blocks with the `twoslash` keyword.

## Syntax Reference

Complete syntax reference: [ts-twoslasher](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ts-twoslasher) and [shikijs-twoslash](https://twoslash.netlify.app/)

`twoslash` treats **double slashes** as preprocessor directives for code examples. Therefore, all annotations are added after `//`.

### Symbol Annotations

Common `twoslash` annotations:

#### `^?` {#extract-type}

Use `^?` to extract type information for specific identifiers on the code line above it.

**Input:**

````md
```ts twoslash
const hi = 'Hello'
const msg = `${hi}, world`
//     ^?
```
````

**Output:**

```ts twoslash
const hi = 'Hello'
const msg = `${hi}, world`
//     ^?
//
```

::: important The symbol `^` must correctly point to the variable whose type you want to highlight.
:::

#### `^|` {#completions}

Use `^|` to extract autocompletion information at a specific position.

**Input:**

````md
```ts twoslash
// @noErrors
console.e
//       ^|
```
````

**Output:**

```ts twoslash
// @noErrors
console.e
//       ^|
//
```

::: important The symbol `^` must correctly point to the position where you want content prediction.
:::

Twoslash requests TypeScript for autocompletion suggestions at the `^` position,
then filters possible outputs based on letters after the `.`. Up to 5 inline results are displayed,
and if a completion item is marked as deprecated, the output reflects this.

In this case, Twoslash requests completion suggestions for `console` from TypeScript,
then filters for items starting with `e`. Note the `// @noErrors` compiler flag is set because `console.e`
is a failing TypeScript code example, but we don't care about that.

#### `^^^` {#highlighting}

Use `^^^` to highlight specific ranges on the line above it.

**Input:**

````md
```ts twoslash
function add(a: number, b: number) {
  //     ^^^
  return a + b
}
```
````

**Output:**

```ts twoslash
function add(a: number, b: number) {
  //     ^^^
  return a + b
}
```

::: important Use consecutive `^` symbols to correctly point to the range you want to highlight.
:::

### `@filename` {#import-files}

`@filename: <filename>` declares which file subsequent code will come from. You can import this file via `import` in other parts of the code.

**Input:**

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

**Output:**

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

### Code Cutting

#### `---cut-before---` {#cut-before}

After TypeScript generates the project and extracts all editor information (like identifiers,
queries, highlights, etc.), cutting operations adjust all offsets and line numbers to fit the smaller output.

Users see content below `// ---cut-before---`. The shorthand `// ---cut---` is also supported.

**Input:**

````md
```ts twoslash
const level: string = 'Danger'
// ---cut---
console.log(level)
````

**Output:**

```ts twoslash
const level: string = 'Danger'
// ---cut---
console.log(level)
```

Show only a single file:

**Input:**

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

**Output:**

```ts twoslash
// @filename: a.ts
export const helloWorld: string = 'Hi'
// ---cut---
// @filename: b.ts
import { helloWorld } from './a'

console.log(helloWorld)
```

Only the last two lines are displayed, but to TypeScript, this is a program with two files,
and all IDE information is correctly connected between files. This is why `// @filename: [file]`
is the only Twoslash command not removed, as it can be `---cut---` if irrelevant.

#### `---cut-after---` {#cut-after}

The sibling of `---cut-before---`, used to trim everything after the symbol:

**Input:**

````md
```ts twoslash
const level: string = 'Danger'
// ---cut-before---
console.log(level)
// ---cut-after---
console.log('This is not shown')
```
````

**Output:**

```ts twoslash
const level: string = 'Danger'
// ---cut-before---
console.log(level)
// ---cut-after---
console.log('This is not shown')
```

#### `---cut-start---` and `---cut-end---` {#cut-start-end}

You can also use the `---cut-start---` and `---cut-end---` pair to cut code segments between two symbols.

**Input:**

````md
```ts twoslash
const level: string = 'Danger'
// ---cut-start---
console.log(level) // This part is cut
// ---cut-end---
console.log('This is shown')
```
````

**Output:**

```ts twoslash
const level: string = 'Danger'
// ---cut-start---
console.log(level) // This part is cut
// ---cut-end---
console.log('This is shown')
```

Multiple instances are supported to cut multiple sections, but symbols must appear in pairs.

### Custom Output Messages {id=twoslash-custom-message}

`@log`, `@error`, `@warn`, and `@annotate` output custom messages at different levels to users.

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

### Output Compiled Files

Running Twoslash code examples triggers full TypeScript compilation runs that create files in a virtual
file system. You can replace code example content with results from running TypeScript on the project.

#### `@showEmit`

`// @showEmit` is the primary command to tell Twoslash you want to replace the code example output with the equivalent `.js` file.

**Input:**

````md
```ts twoslash
// @showEmit
const level: string = 'Danger'
```
````

**Output:**

```ts twoslash
// @showEmit
const level: string = 'Danger'
```

The result shows the `.js` file corresponding to this `.ts` file. You can see TypeScript output removes `: string` and adds `export {}`.

#### `@showEmittedFile: [file]`

While `.js` files may be the most useful out of the box, TypeScript does emit other files (`.d.ts` and `.map`)
when proper flags are enabled, and with multi-file code examples, you may need to tell Twoslash which file to
display. For all these cases, you can also add `@showEmittedFile: [file]` to tell Twoslash which file you want to display.

**Display `.d.ts` file for TypeScript code example:**

**Input:**

````md
```ts twoslash
// @declaration
// @showEmit
// @showEmittedFile: index.d.ts
export const hello = 'world'
```
````

**Output:**

```ts twoslash
// @declaration
// @showEmit
// @showEmittedFile: index.d.ts
export const hello = 'world'
```

**Display `.map` file from JavaScript to TypeScript:**

**Input:**

````md
```ts twoslash
// @sourceMap
// @showEmit
// @showEmittedFile: index.js.map
export const hello = 'world'
```
````

**Output:**

```ts twoslash
// @sourceMap
// @showEmit
// @showEmittedFile: index.js.map
export const hello = 'world'
```

**Display `.map` for `.d.ts` files (mainly for project references):**

**Input:**

````md
```ts twoslash
// @declaration
// @declarationMap
// @showEmit
// @showEmittedFile: index.d.ts.map
export const hello: string = 'world'
```
````

**Output:**

```ts twoslash
// @declaration
// @declarationMap
// @showEmit
// @showEmittedFile: index.d.ts.map
export const hello: string = 'world'
```

**Generate `.js` file for `b.ts`:**

**Input:**

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

**Output:**

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

`@errors: <error code>` shows how code produces errors:

**Input:**

````md
```ts twoslash
// @errors: 2322 2588
const str: string = 1
str = 'Hello'
````

**Output:**

```ts twoslash
// @errors: 2322 2588
const str: string = 1
str = 'Hello'
```

You need to declare corresponding TypeScript error codes after `@errors`. Separate multiple error codes with spaces.

::: note
If you don't know which error code to add, try writing the code first and wait for compilation to fail.
You should see relevant error information in the console, then find the corresponding error code in the
error message's `description`. Then add the error code to `@errors`.

Don't worry about compilation failures terminating the process - the theme displays error information
when compilation fails while outputting uncompiled code in the code block.
:::

### `@noErrors`

Suppresses all errors in code. You can also provide error codes to suppress specific errors.

**Input:**

````md
```ts twoslash
// @noErrors
const str: string = 1
str = 'Hello'
```
````

**Output:**

```ts twoslash
// @noErrors
const str: string = 1
str = 'Hello'
```

### `@noErrorsCutted`

Ignores errors occurring in cut code.

**Input:**

````md
```ts twoslash
// @noErrorsCutted
const hello = 'world'
// ---cut-after---
hello = 'hi' // Should be an error but ignored because it's cut.
```
````

**Output:**

```ts twoslash
// @noErrorsCutted
const hello = 'world'
// ---cut-after---
hello = 'hi' // Should be an error but ignored because it's cut.
```

### `@noErrorValidation`

Disables error validation. Error messages will still render, but Twoslash won't throw errors from compile-time code.

**Input:**

````md
```ts twoslash
// @noErrorValidation
const str: string = 1
```
````

**Output:**

```ts twoslash
// @noErrorValidation
const str: string = 1
```

### `@keepNotations`

Tells Twoslash not to remove any comments and keep original code unchanged. Nodes will contain position information of original code.

**Input:**

````md
```ts twoslash
// @keepNotations
// @module: esnext
// @errors: 2322
const str: string = 1
```
````

**Output:**

```ts twoslash
// @keepNotations
// @module: esnext
// @errors: 2322
const str: string = 1
```

### Overriding Compiler Options

Use `// @name` and `// @name: value` comments to override TypeScript's
[compiler options](https://www.typescriptlang.org/tsconfig#compilerOptions). These comments will be removed from output.

**Input:**

````md
```ts twoslash
// @noImplicitAny: false
// @target: esnext
// @lib: esnext
// This should throw an error,
// but since we disabled noImplicitAny, it won't.
const fn = a => a + 1
```
````

**Output:**

```ts twoslash
// @noImplicitAny: false
// @target: esnext
// @lib: esnext
// This should throw an error,
// but since we disabled noImplicitAny, it won't.
const fn = a => a + 1
```
