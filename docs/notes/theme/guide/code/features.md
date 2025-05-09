---
title: 特性支持
icon: majesticons:code-block-line
createTime: 2024/04/04 10:41:28
permalink: /guide/code/features/
---

主题在代码高亮功能上，进一步支持了更多的特性，它们能够帮助你的代码块更加具备表达力。

## 代码块标题 <Badge type="tip" text="1.0.0-rc.136 +" />

在 <code>\`\`\` [lang]</code> 之后添加 `title="xxxx"` ，可以为当前代码块添加标题

**输入：**

````md {1}
```json title="package.json"
{
  "name": "vuepress-theme-plume"
}
```
````

**输出：**

```json title="package.json"
{
  "name": "vuepress-theme-plume"
}
```

## 代码行号

主题默认显示代码行号，它通过 `codeHighlighter.line-numbers` 来控制。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      lineNumbers: true, // [!code ++]
    }
  })
})
```

你还可以通过 `:line-numbers` / `:no-line-numbers` 来控制当前代码块是否显示代码行号。
还可以通过在 `:line-numbers` 之后添加 `=` 来自定义起始行号，例如 `:line-numbers=2` 表示代码块中的行号从 `2` 开始。

**输入：**

````
```ts:line-numbers
// 启用行号
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:no-line-numbers
// 行号已禁用
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

```ts:line-numbers=2
// 行号已启用，并从 2 开始
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```
````

**输出：**

```ts:line-numbers
// 启用行号
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:no-line-numbers
// 行号已禁用
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

```ts:line-numbers=2
// 行号已启用，并从 2 开始
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

## 在代码块中实现行高亮

在 `[lang]` 之后紧跟随 `{xxxx}` ，可以实现行高亮，其中 `xxx` 表示要高亮的行号。

**输入：**

````
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**输出：**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

除了单行之外，还可以指定多个单行、多行，或两者均指定：

- 多行：例如 `{5-8}`、`{3-10}`、`{10-17}`
- 多个单行：例如 `{4,7,9}`
- 多行与单行：例如 `{4,7-13,16,23-27,40}`

**输入：**

````
```js{1,4,6-8}
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',
      lorem: 'ipsum'
    }
  }
}
```
````

**输出：**

```js{1,4,6-8}
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',
      lorem: 'ipsum'
    }
  }
}
```

也可以使用 `// [!code highlight]` 注释实现行高亮。

**输入：**

````
```js
export default {
  data () {
    return {
      msg: 'Highlighted!' // [\!code highlight]
    }
  }
}
```
````

**输出：**

```js
export default {
  data() {
    return {
      msg: 'Highlighted!' // [!code highlight]
    }
  }
}
```

## 代码块中聚焦

在某一行上添加 `// [!code focus]` 注释将聚焦它并模糊代码的其他部分。

此外，可以使用 `// [!code focus:<lines>]` 定义要聚焦的行数。

**输入：**

````
```js
export default {
  data () {
    return {
      msg: 'Focused!' // [\!code focus]
    }
  }
}
```
````

**输出：**

```js
export default {
  data() {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
```

::: tip 在不同的语言代码块中，应该使用该语言的有效的行注释语法
比如在 bash 代码块中，应该使用 `# [!code focus]`

````md
```bash
mkdir hello && cd hello  # [\!code focus]
pnpm install
```
````

```bash
mkdir hello && cd hello  # [!code focus]
pnpm install
```

:::

## 代码块中的颜色差异

在某一行添加 `// [!code --]` 或 `// [!code ++]` 注释将会为该行创建 diff，同时保留代码块的颜色。

**输入：**

````
```js
export default {
  data () {
    return {
      error: 'Removed', // [\!code --]
      warning: 'Added' // [\!code ++]
    }
  }
}
```
````

**输出：**

```js
export default {
  data() {
    return {
      error: 'Removed', // [!code --]
      warning: 'Added' // [!code ++]
    }
  }
}
```

::: tip 在不同的语言代码块中，应该使用该语言的有效的行注释语法
比如在 bash 代码块中，应该使用 `# [!code ++]`

````md
```bash
mkdir hello && cd hello  # [\!code ++]
```
````

```bash
mkdir hello && cd hello  # [!code ++]
```

:::

## 高亮“错误”和“警告”

在某一行添加 `// [!code warning]` 或 `// [!code error]` 注释将会为该行相应的着色。

**输入：**

````
```js
export default {
  data () {
    return {
      error: 'Error', // [\!code error]
      warning: 'Warning' // [\!code warning]
    }
  }
}
```
````

**输出：**

```js
export default {
  data() {
    return {
      error: 'Error', // [!code error]
      warning: 'Warning' // [!code warning]
    }
  }
}
```

::: tip 在不同的语言代码块中，应该使用该语言的有效的行注释语法
比如在 bash 代码块中，应该使用 `# [!code warning]`

````md
```bash
mkdir hello && cd hello  # [\!code warning]
```
````

```bash
mkdir hello && cd hello  # [!code warning]
```

:::

## 代码块中 词高亮

**输入：**

````
```ts
export function foo() { // [\!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```
````

**输出：**

```ts
export function foo() { // [!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```

你还可以指定高亮显示的次数，例如 `[!code word:options:2]` 会高亮显示近两个 `options`。

**输入：**

````
```ts
// [\!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // 这个不会被高亮显示
```
````

**输出：**

```ts
// [!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // 这个不会被高亮显示
```

:::tip 在不同的语言代码块中，应该使用该语言的有效的行注释语法
比如在 bash 代码块中，应该使用 `# [!code word:hello]`

````md
```bash
mkdir hello && cd hello  # [\!code word:hello]
```
````

```bash
mkdir hello && cd hello  # [!code word:hello]
```

:::

## 代码块中的 空白符

将空白字符（Tab 和空格）渲染为可见状态。

在 代码块 后面添加 `:whitespace`。

<!-- @include: ../../snippet/whitespace.snippet.md -->

还可以在 `codeHighlighter` 中全局启用 `whitespace` 功能：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      whitespace: true, // [!code ++]
    }
  })
})
```

全局启用时，可以使用 `:no-whitespace` 来单独为某一代码块禁用 `whitespace` 功能。

## 折叠代码块

有时候，代码块会很长，对于阅读其它部分的内容时，会显得很麻烦，影响阅读体验，这时候可以折叠代码块。

在 代码块 后面添加 `:collapsed-lines`，即可折叠代码块，默认从第 15 行开始折叠。

**输入：**

````txt
```css :collapsed-lines
html {
  margin: 0;
  background: black;
  height: 100%;
}

... more code
```
````

**输出：**

```css :collapsed-lines
html {
  margin: 0;
  background: black;
  height: 100%;
}

body {
  margin: 0;
  width: 100%;
  height: inherit;
}

/* the three main rows going down the page */

body > div {
  height: 25%;
}

.thumb {
  float: left;
  width: 25%;
  height: 100%;
  object-fit: cover;
}

.main {
  display: none;
}

.blowup {
  display: block;
  position: absolute;
  object-fit: contain;
  object-position: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
}

.darken {
  opacity: 0.4;
}
```

还可以指定起始折叠行。`:collapsed-lines=10` 表示从第十行开始折叠。

**输入：**

````txt
```css :collapsed-lines=10
html {
  margin: 0;
  background: black;
  height: 100%;
}

... more code
```
````

**输出：**

```css :collapsed-lines=10
html {
  margin: 0;
  background: black;
  height: 100%;
}

body {
  margin: 0;
  width: 100%;
  height: inherit;
}

/* the three main rows going down the page */

body > div {
  height: 25%;
}

.thumb {
  float: left;
  width: 25%;
  height: 100%;
  object-fit: cover;
}

.main {
  display: none;
}

.blowup {
  display: block;
  position: absolute;
  object-fit: contain;
  object-position: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
}

.darken {
  opacity: 0.4;
}
```

还可以在 `codeHighlighter` 中全局启用 `collapsed-lines` 功能：

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      collapsedLines: true // [!code ++]
    }
  })
})
```

:::

全局启用时，可以使用 `:no-collapsed-lines` 来单独为某一代码块禁用 `collapsed-lines` 功能。
