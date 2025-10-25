---
url: /article/mcgayb5w/index.md
---
## 标题锚点

标题会自动应用锚点。

### 自定义锚点

要为标题指定自定义锚点而不是使用自动生成的锚点，请向标题添加后缀：

```md
# 使用自定义锚点 {#my-anchor}
```

这允许将标题链接为 `#my-anchor`，而不是默认的 `#使用自定义锚点`。

## 链接

内部和外部链接都会被特殊处理。

主题默认对每个 md 文件自动生成一个新的 链接，并保存在对应的 md 文件的 frontmatter 的 `permalink` 中。
你可以随时修改它们。你也可以通过 `theme.autoFrontmatter` 选项来禁用这个功能，这时会恢复为 VuePress 的默认行为。

### 内部链接

有三种方式来使用内部链接：

* 使用 生成的 `permalink` 作为内部链接的目标。
* 使用 md 文件的相对路径作为内部链接的目标。
* 使用 md 文件的绝对路径作为内部链接的目标， 绝对路径 `/` 表示从 `${sourceDir}` 目录开始。

```md
[Markdown](/guide/markdown/)

[Markdown](./markdown基础.md)
```

渲染为：

[Markdown](/guide/markdown/)

[Markdown](./markdown基础.md)

#### 外部链接

外部链接带有 `target="_blank" rel="noreferrer"` ：

[VuePress](https://v2.vuepress.vuejs.org/)

## Github风格的表格

**输入：**

```md
| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |
```

**输出：**

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

## Emoji :tada:

**输入：**

```md
:tada: :100:
```

**输出：**

:tada: :100:

这里可以找到 [所有支持的 emoji 列表](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs)。

## 目录表

**输入：**

```md
[[TOC]]
```

**输出：**

\[\[TOC]]

## 自定义容器

自定义容器可以通过它们的类型、标题和内容来定义。

### 默认标题

**输入：**

```md
::: note
This is a note box
:::

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: caution
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**输出：**

::: note
This is a note box
:::

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: caution
This is a dangerous warning.
:::

::: details
This is a details block.
:::

### 自定义标题

可以通过在容器的 "type" 之后附加文本来设置自定义标题。

**输入：**

````md
::: caution STOP
危险区域，请勿继续
:::

::: details 点我查看代码
```js
console.log('Hello, VitePress!')
```
:::
````

**输出：**

::: caution STOP
危险区域，请勿继续
:::

::: details 点我查看代码

```js
console.log('Hello, VitePress!')
```

:::

## GitHub 风格的警报

主题 同样支持以标注的方式渲染 [GitHub 风格的警报](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)。它们和[自定义容器](#自定义容器)的渲染方式相同。

**输入：**

```md
> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。
```

**输出：**

> \[!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> \[!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> \[!IMPORTANT]
> 对用户达成目标至关重要的信息。

> \[!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> \[!CAUTION]
> 行为可能带来的负面影响。

## 代码块中的语法高亮

主题 使用 [Shiki](https://github.com/shikijs/shiki) 在 Markdown 代码块中使用彩色文本实现语法高亮。
Shiki 支持多种编程语言。需要做的就是将有效的语言别名附加到代码块的开头：

**输入：**

````
```js
export default {
  name: 'MyComponent',
  // ...
}
```
````

````
```html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```
````

**输出：**

```js
export default {
  name: 'MyComponent',
  // ...
}
```

```html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

在 Shiki 的代码仓库中，可以找到 [合法的编程语言列表](https://shiki.style/languages)。

## 在代码块中实现行高亮

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

* 多行：例如 `{5-8}`、`{3-10}`、`{10-17}`
* 多个单行：例如 `{4,7,9}`
* 多行与单行：例如 `{4,7-13,16,23-27,40}`

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

## 代码块中的颜色差异

在某一行添加 `// [!code --]` 或 `// [!code ++]` 注释将会为该行创建 diff，同时保留代码块的颜色。

**输入：**

````
```js
export default {
  data () {
    return {
      remove: 'Removed', // [\!code --]
      add: 'Added' // [\!code ++]
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
      remove: 'Removed', // [!code --]
      add: 'Added' // [!code ++]
    }
  }
}
```

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

## 代码组

可以像这样对多个代码块进行分组：

**输入：**

````md
::: code-tabs
@tab config.js
```js
/**
 * @type {import('vuepress').UserConfig}
 */
const config = {
  // ..
}

export default config
```

@tab config.ts
```ts
import type { UserConfig } from 'vuepress'

const config: UserConfig = {
  // ..
}

export default config
```
:::
````

**输出：**

::: code-tabs
@tab config.js

```js
/**
 * @type {import('vuepress').UserConfig}
 */
const config = {
  // ..
}

export default config
```

@tab config.ts

```ts
import type { UserConfig } from 'vuepress'

const config: UserConfig = {
  // ..
}

export default config
```

:::

你还可以通过 `@tab:active`

## 导入代码块

**输入：**

你可以使用下面的语法，从文件中导入代码块：

```md
@[code](../snippet/snippet-1.js)
```

**输出：**

@[code](../../snippet/snippet-1.js)

如果你只想导入这个文件的一部分：

```md
<!-- 仅导入第 1 行至第 10 行 -->
@[code{1-10}](../snippet/snippet-1.js)
```

代码语言会根据文件扩展名进行推断，但我们建议你显式指定：

```md
<!-- 指定代码语言 -->
@[code js](../snippet/snippet-1.js)

<!-- 行高亮 -->
@[code js{2,4-5}](../foo.js)
```

## 数学方程

**输入：**

```
When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are
$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

**Maxwell's equations:**

| equation                                                                                                                                                                  | description                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| $\nabla \cdot \vec{\mathbf{B}}  = 0$                                                                                                                                      | divergence of $\vec{\mathbf{B}}$ is zero                                               |
| $\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t}  = \vec{\mathbf{0}}$                                                          | curl of $\vec{\mathbf{E}}$ is proportional to the rate of change of $\vec{\mathbf{B}}$ |
| $\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} = \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} = 4 \pi \rho$ | _wha?_                                                                                 |
```

**输出：**

When $a \ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are
$$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$

**Maxwell's equations:**

| equation                                                                                                                                                                  | description                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| $\nabla \cdot \vec{\mathbf{B}}  = 0$                                                                                                                                      | divergence of $\vec{\mathbf{B}}$ is zero                                               |
| $\nabla \times \vec{\mathbf{E}}, +, \frac1c, \frac{\partial\vec{\mathbf{B}}}{\partial t}  = \vec{\mathbf{0}}$                                                          | curl of $\vec{\mathbf{E}}$ is proportional to the rate of change of $\vec{\mathbf{B}}$ |
| $\nabla \times \vec{\mathbf{B}} -, \frac1c, \frac{\partial\vec{\mathbf{E}}}{\partial t} = \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} = 4 \pi \rho$ | *wha?*                                                                                 |

## 标记

使用 `== ==` 进行标记。请注意两边需要有空格。

**输入：**

```md
vuepress-theme-plume 是一个 ==简洁美观== 的 主题
```

**输出：**

vuepress-theme-plume 是一个 ==简洁美观== 的 主题

## 上下角标

* 使用 `^ ^` 进行上角标标注。
* 使用 `~ ~` 进行下角标标注。

**输入：**

```md
- 19^th^
- H~2~O
```

**输出：**

* 19^th^
* H~2~O

## 自定义对齐

**输入：**

```md
::: left
左对齐的内容
:::

::: center
居中的内容
:::

::: right
右对齐的内容
:::
```

**输出：**

::: left
左对齐的内容
:::

::: center
居中的内容
:::

::: right
右对齐的内容
:::

## 属性支持

你可以使用特殊标记为 Markdown 元素添加属性。

**为图片添加属性：**

这将为图片添加 一个 名为 `full-width` 的 class 属性，以及一个 `width` 属性，值为 `100%`。

```md
![](/plume.png){.full-width width="100%"}
```

同时也支持其他属性:

```md
一个包含文字的段落。 {#p .a .b align=center customize-attr="content with spaces"}
```

这将被渲染为：

```html
<p id="p" class="a b" align="center" customize-attr="content with spaces">
  一个包含文字的段落。
</p>
```

## 任务列表

**输入：**

```md
- [ ] 任务 1
- [x] 任务 2
- [ ] 任务 3
```

**输出：**

* \[ ] 任务 1
* \[x] 任务 2
* \[ ] 任务 3

## 脚注

**输入：**

```md
人生自古谁无死，留取丹心照汗青[^脚注1]。

[^脚注1]: 出自 宋·文天祥 **《过零丁洋》**
```

**输出：**

人生自古谁无死，留取丹心照汗青\[^脚注1]。

\[^脚注1]: 出自 宋·文天祥 **《过零丁洋》**
