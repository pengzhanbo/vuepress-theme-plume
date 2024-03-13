---
title: 高阶
author: pengzhanbo
icon: ic:outline-auto-fix-high
createTime: 2024/03/05 16:27:59
permalink: /guide/markdown/advance/
---

## 代码演示

代码演示 默认不启用，你可以通过配置来启用它。

::: code-tabs
@tab .vuepress/config.ts
```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownEnhance: {
        demo: true,
      },
    }
  })
})
```
:::

### 语法

```` md
::: [类型]-demo 可选的标题文字

```html
<!-- ↑ 使用可用的语言 -->
<!-- 在代码块中放置你对应语言的代码，一个语言不能出现多个块 -->
<!-- 你可以有多个代码块，并且 html, js, css 都是视情况可选的 -->
```

```json
// json block 作为插件配置存放处
{
  // 放置你的配置 (可选的)
}
```

:::
````
::: tip 提示
JSON 块是可选的，可用的配置详见[配置](https://vuepress-theme-hope.github.io/v2/md-enhance/zh/config.html)
:::

插件支持三种类型

- normal(默认)
- vue
- react

### 可用的语言

你可以在演示块中使用不同语言。

当你设置一些不能在浏览器上直接运行的语言时，由于插件无法解析它们，因此网页演示将被禁用。插件只显示代码。同时提供一个 "在 CodePen 中打开" 按钮允许用户直接在 CodePen 打开并浏览代码。

可用的 HTML 语言:

- `"html"` (默认)
- `"slim"`
- `"haml"`
- `"markdown"`

可用的 JS 语言:

- `"javascript"` (default)
- `"coffeescript"`
- `"babel"`
- `"livescript"`
- `"typescript"`

> 你也可以在代码块中使用 `js`, `ts`, `coffee` 和 `ls。`

可用的 CSS 语言:

- `"css"` (default)
- `"less"`
- `"scss"`
- `"sass"`
- `"stylus"`

### 不支持的语言

::: normal-demo 一个使用浏览器不支持解析语言 Demo

```md
# 标题

十分强大
```

```ts
const message: string = 'VuePress Theme Hope'

document.querySelector('h1').innerHTML = message
```

```scss
h1 {
  font-style: italic;

  + p {
    color: red;
  }
}
```

:::

:::: details 代码
```` md
::: normal-demo 一个使用浏览器不支持解析语言 Demo

```md
# 标题

十分强大
```

```ts
const message: string = 'VuePress Theme Hope'

document.querySelector('h1').innerHTML = message
```

```scss
h1 {
  font-style: italic;

  + p {
    color: red;
  }
}
```

:::
````
::::

### 普通代码演示
格式：
```` md
::: normal-demo 可选的标题文字

```html
<!-- html code -->
```

```js
// js code
```

```css
/* css code */
```

```json
// 配置 (可选)
{
  "jsLib": [
    // ...
  ],
  "cssLib": [
    // ...
  ]
}
```

:::
````
::: warning 注意事项
我们使用 `"ShadowDOM"` 进行样式隔离，并已经将 `document` 替换为了 `shadowRoot` 对象。如果需要访问页面的 `document，请访问` `window.document`。
:::

#### 例子

::: normal-demo Demo 演示

```html
<h1>Hello Word!</h1>
<p><span id="very">非常</span>强大!</p>
```

```js
document.querySelector('#very').addEventListener('click', () => {
  alert('非常强大')
})
```

```css
span {
  color: red;
}
```

:::

:::: details 代码
```` md
::: normal-demo Demo 演示

```html
<h1>Hello Word!</h1>
<p><span id="very">非常</span>强大!</p>
```

```js
document.querySelector('#very').addEventListener('click', () => {
  alert('非常强大')
})
```

```css
span {
  color: red;
}
```

:::
````
::::

### Vue 代码演示

#### 格式
```` md
::: vue-demo 可选的标题文字

```vue
<!-- ↑ 你也可以使用 html -->
<script>
export default {
  // vue 组件
}
</script>

<template>
  <!-- vue 模板 -->
  <div>demo</div>
</template>

<style>
/* css 代码 */
</style>
```

```json
// 配置 (可选)
{}
```

:::
````

::: warning 注意事项
- 你只能使用 `Vue3`。
- 必须将组件通过 `export default` 默认导出
- 我们使用 `"ShadowDOM"` 进行样式隔离，并已经将 `document` 替换为了 `shadowRoot` 对象。如果需要访问页面的 `document`，请访问 `window.document`。
:::

#### 演示

::: vue-demo 一个 Vue Composition 演示

```vue
<script>
const { ref } = Vue

export default {
  setup() {
    const message = ref('powerful')

    const handler = () => {
      message.value = `very ${message.value}`
    }

    return {
      message,
      handler,
    }
  },
}
</script>

<template>
  <div class="box">
    <code>Hello Word</code> is
    <span @click="handler">{{ message }}</span>!
  </div>
</template>

<style>
.box span {
  color: red;
}
</style>
```

:::

:::: details 代码
```` md
::: vue-demo 一个 Vue Composition 演示

```vue
<script>
const { ref } = Vue

export default {
  setup() {
    const message = ref('powerful')

    const handler = () => {
      message.value = `very ${message.value}`
    }

    return {
      message,
      handler,
    }
  },
}
</script>

<template>
  <div class="box">
    <code>Hello Word</code> is
    <span @click="handler">{{ message }}</span>!
  </div>
</template>

<style>
.box span {
  color: red;
}
</style>
```

:::
````
::::

### React 代码演示

#### 格式

```` md
::: react-demo 可选的标题文字

```js
// 放置脚本，并通过 `export default` 导出你的 react 组件
```

```css
/* 你的 css 内容 */
```

```json
// 配置 (可选)
{}
```

:::
````

::: warning 注意事项
- 使用 React 的时候，为了解析 JSX 必须引入 Babel，此过程由插件自动完成。
- 必须将组件通过 `export default` 默认导出
- 我们使用 `"ShadowDOM"` 进行样式隔离，并已经将 `document` 替换为了 `shadowRoot` 对象。如果需要访问页面的 `document`，请访问 `window.document`。
:::

#### 演示

::: react-demo 一个函数式 React Demo

```js
const { useState } = React

export default () => {
  const [message, setMessage] = useState(' 强大')

  const handler = () => {
    setMessage(`十分${message}`)
  }

  return (
    <div className="box">
      <code>Hello Word !</code>
      <span id="powerful" onClick={handler}>
        {message}
      </span>
    </div>
  )
}
```

```css
.box #powerful {
  color: blue;
}
```

:::

:::: details 代码
```` md
::: react-demo 一个函数式 React Demo

```js
const { useState } = React

export default () => {
  const [message, setMessage] = useState(' 强大')

  const handler = () => {
    setMessage(`十分${message}`)
  }

  return (
    <div className="box">
      <code>Hello Word !</code>
      <span id="powerful" onClick={handler}>
        {message}
      </span>
    </div>
  )
}
```

```css
.box #powerful {
  color: blue;
}
```

:::
````
::::

## 选项组

让你的 Markdown 文件支持供选项卡。

你需要将选项卡包装在 `tabs` 容器中。

你可以在 `tabs` 容器中添加一个 id 后缀，该后缀将用作选项卡 id。
所有具有相同 id 的选项卡将共享相同的切换事件。

```md
::: tabs#fruit

<!-- 这里，fruit 将用作 id，它是可选的 -->

<!-- 选项卡内容 -->

:::
```

在这个容器内，你应该使用 `@tab` 标记来标记和分隔选项卡内容。

在 `@tab` 标记后，你可以添加文本 `:active` 默认激活选项卡，之后的文本将被解析为选项卡标题。

```md
::: tabs

@tab 标题 1

<!-- tab 1 内容 -->

@tab 标题 2

<!-- tab 2 内容 -->

@tab:active 标题 3

<!-- tab 3 将会被默认激活 -->

<!-- tab 3 内容 -->

:::
```

默认情况下，标题将用作选项卡的值，但你可以使用 id 后缀覆盖它。

```md
::: tabs

@tab 标题 1

<!-- 此处，选项卡 1 的标题“标题 1”将用作值。 -->

<!-- tab 1 内容 -->

@tab 标题 2#值 2

<!-- 这里，tab 2 的标题将是 “标题 2”，但它会使用 “值 2” 作为选项卡的值-->

<!-- tab 2 内容 -->

:::
```

你可以在每个选项卡中使用 Vue 语法和组件，并且你可以访问 value 和 isActive，
表示选项卡的绑定值和选项卡是否处于激活状态。

**输入**

````
::: tabs
@tab npm

npm 应该与 Node.js 被一同安装。

@tab pnpm

```sh
corepack enable
corepack use pnpm@8
```

:::
````

**输出**

::: tabs
@tab npm

npm 应该与 Node.js 被一同安装。

@tab pnpm

```sh
corepack enable
corepack use pnpm@8
```

:::
