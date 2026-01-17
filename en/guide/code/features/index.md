---
url: /en/guide/code/features/index.md
---
The theme provides additional features beyond basic code highlighting, enhancing the expressiveness of your code blocks.

## Code Block Title&#x20;

Add `title="xxxx"` after \`\`\` \[lang] to add a title to the current code block.

**Input:**

````md {1}
```json title="package.json"
{
  "name": "vuepress-theme-plume"
}
```
````

**Output:**

```json title="package.json"
{
  "name": "vuepress-theme-plume"
}
```

## Line Numbers

Line numbers are displayed by default in the theme, controlled by `codeHighlighter.line-numbers`.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      lineNumbers: true, // [!code ++]
    }
  })
})
```

You can also control whether to display line numbers for the current code block using `:line-numbers` / `:no-line-numbers`.
Additionally, you can customize the starting line number by adding `=` after `:line-numbers`,
for example `:line-numbers=2` indicates that line numbers in the code block start from `2`.

**Input:**

````
```ts:line-numbers
// Line numbers enabled
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:no-line-numbers
// Line numbers disabled
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

```ts:line-numbers=2
// Line numbers enabled, starting from 2
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```
````

**Output:**

```ts:line-numbers
// Line numbers enabled
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```

```ts:no-line-numbers
// Line numbers disabled
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

```ts:line-numbers=2
// Line numbers enabled, starting from 2
const line3 = 'This is line 3'
const line4 = 'This is line 4'
```

## Line Highlighting in Code Blocks

Add `{xxxx}` immediately after `[lang]` to enable line highlighting, where `xxx` represents the line numbers to be highlighted.

**Input:**

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

**Output:**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

In addition to single lines, you can specify multiple single lines, line ranges, or both:

* Line ranges: e.g., `{5-8}`, `{3-10}`, `{10-17}`
* Multiple single lines: e.g., `{4,7,9}`
* Mixed single lines and ranges: e.g., `{4,7-13,16,23-27,40}`

**Input:**

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

**Output:**

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

You can also use the `// [!code highlight]` comment to enable line highlighting.

**Input:**

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

**Output:**

```js
export default {
  data() {
    return {
      msg: 'Highlighted!' // [!code highlight]
    }
  }
}
```

## Focus in Code Blocks

Adding the `// [!code focus]` comment on a specific line will focus it and blur the rest of the code.

Additionally, you can use `// [!code focus:<lines>]` to define the number of lines to focus.

**Input:**

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

**Output:**

```js
export default {
  data() {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
```

::: tip Use the valid line comment syntax for the language in different code blocks
For example, in bash code blocks, use `# [!code focus]`

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

## Diff in Code Blocks

Adding `// [!code --]` or `// [!code ++]` comments to a line will create a diff for that line while preserving the code block's syntax highlighting.

**Input:**

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

**Output:**

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

::: tip Use the valid line comment syntax for the language in different code blocks
For example, in bash code blocks, use `# [!code ++]`

````md
```bash
mkdir hello && cd hello  # [\!code ++]
```
````

```bash
mkdir hello && cd hello  # [!code ++]
```

:::

## Highlight "Errors" and "Warnings"

Adding `// [!code warning]` or `// [!code error]` comments to a line will apply corresponding coloring to that line.

**Input:**

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

**Output:**

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

::: tip Use the valid line comment syntax for the language in different code blocks
For example, in bash code blocks, use `# [!code warning]`

````md
```bash
mkdir hello && cd hello  # [\!code warning]
```
````

```bash
mkdir hello && cd hello  # [!code warning]
```

:::

## Word Highlighting in Code Blocks

**Input:**

````
```ts
export function foo() { // [\!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```
````

**Output:**

```ts
export function foo() { // [!code word:Hello]
  const msg = 'Hello World'
  console.log(msg) // prints Hello World
}
```

You can also specify the number of occurrences to highlight, for example `[!code word:options:2]`
will highlight only the first two occurrences of `options`.

**Input:**

````
```ts
// [\!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // This won't be highlighted
```
````

**Output:**

```ts
// [!code word:options:2]
const options = { foo: 'bar' }
options.foo = 'baz'
console.log(options.foo) // This won't be highlighted
```

:::tip Use the valid line comment syntax for the language in different code blocks
For example, in bash code blocks, use `# [!code word:hello]`

````md
```bash
mkdir hello && cd hello  # [\!code word:hello]
```
````

```bash
mkdir hello && cd hello  # [!code word:hello]
```

:::

## Whitespace in Code Blocks

Render whitespace characters (tabs and spaces) as visible.

Add `:whitespace` after the code block.

You can also globally enable the `whitespace` feature in `codeHighlighter`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      whitespace: true, // [!code ++]
    }
  })
})
```

When globally enabled, you can use `:no-whitespace` to disable the `whitespace` feature for a specific code block.

## Collapsed Code Blocks

Sometimes code blocks can be very long, which can be cumbersome when reading other content and
affect the reading experience. In such cases, you can collapse code blocks.

Add `:collapsed-lines` after the code block to collapse it, starting from line 15 by default.

**Input:**

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

**Output:**

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

You can also specify the starting line for collapsing. `:collapsed-lines=10` indicates collapsing starts from the tenth line.

**Input:**

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

**Output:**

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

You can also globally enable the `collapsed-lines` feature in `codeHighlighter`:

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

When globally enabled, you can use `:no-collapsed-lines` to disable the `collapsed-lines` feature for a specific code block.
