---
title: markdown增强
createTime: 2022/05/14 10:43:53
author: pengzhanbo
permalink: /note/vuepress-theme-plume/markdown-enhance/
---

markdown 增强 由 [vuepress-plugin-md-enhance](https://vuepress-theme-hope.github.io/v2/md-enhance/zh) 提供支持。

## 内容容器

支持多种内容容器，更好的表达文章内容。

1. tip 提示
2. note 注释
3. info 信息
4. warning 警告
5. danger 危险
6. details 详情

- 提示
  ``` md
  ::: tip 提示
  提示内容
  :::
  ```
  ::: tip 提示
  提示内容
  :::

- 注释
  ``` md
  ::: note 注释
  注释内容
  :::
  ```
  ::: note 注释
  注释内容
  :::

- 信息
  ``` md
  ::: info 信息
  信息内容
  :::
  ```
  ::: info 信息
  信息内容
  :::

- 警告
  ``` md
  ::: warning 警告
  警告内容
  :::
  ```
  ::: warning 警告
  警告内容
  :::

- 危险
  ``` md
  ::: caution 危险
  危险内容
  :::
  ```
  ::: caution 危险
  危险内容
  `markdown`
  :::

- 详情
  ``` md
  ::: details 详情
  详情信息
  :::
  ```
  ::: details 详情
  详情信息
  :::

- 重要

  ``` md
  ::: important 重要
  重要内容
  :::
  ```
  ::: important 重要
  重要内容
  :::

## 自定义对齐

- 左对齐
  ``` md
  ::: left
  这是左对齐
  :::
  ```
  ::: left
  这是左对齐
  :::
- 右对齐
  ``` md
  ::: right
  这是右对齐
  :::
  ```
  ::: right
  这是右对齐
  :::
- 居中
  ``` md
  ::: center
  这是居中对齐
  :::
  ```
  ::: center
  这是居中对齐
  :::

## 任务列表

``` md
- [ ] todo1
- [x] todo2
```
- [ ] todo1
- [x] todo2
  
## 标记

``` md
将这个内容进行 ==标记== ，变成高亮。
```
将这个内容进行 ==标记== ，变成高亮。

## 代码块分组

你需要在 外围使用`code-group` 容器，内部使用`code-group-item` 将代码块进行包裹。

需要给 `code-group-item` 容器设置标题

如果需要给先让某个选项卡被激活，在标题后面补充`:active`后缀。

````md
::: code-tabs

@tab yarn
```sh
yarn version
```


@tab:active npm
```sh
npm version
```
:::


````

::: code-tabs
@tab yarn
``` sh
yarn version
```

@tab:active npm
``` sh
npm version
```
:::

## 代码演示

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
const message: string = "VuePress Theme Hope";

document.querySelector("h1").innerHTML = message;
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
const message: string = "VuePress Theme Hope";

document.querySelector("h1").innerHTML = message;
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
    ...
  ],
  "cssLib":[
    ...
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
document.querySelector("#very").addEventListener("click", () => {
  alert("非常强大");
});
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
document.querySelector("#very").addEventListener("click", () => {
  alert("非常强大");
});
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
<template>
  <!-- vue 模板 -->
</template>
<script>
export default {
  // vue 组件
};
</script>
<style>
/* css 代码 */
</style>
```

```json
// 配置 (可选)
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
<template>
  <div class="box">
    <code>Hello Word</code> is
    <span @click="handler">{{ message }}</span
    >!
  </div>
</template>
<script>
const { ref } = Vue;

export default {
  setup() {
    const message = ref("powerful");

    const handler = () => {
      message.value = "very " + message.value;
    };

    return {
      message,
      handler,
    };
  },
};
</script>
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
<template>
  <div class="box">
    <code>Hello Word</code> is
    <span @click="handler">{{ message }}</span
    >!
  </div>
</template>
<script>
const { ref } = Vue;

export default {
  setup() {
    const message = ref("powerful");

    const handler = () => {
      message.value = "very " + message.value;
    };

    return {
      message,
      handler,
    };
  },
};
</script>
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
const { useState } = React;

export default () => {
  const [message, setMessage] = useState(" 强大");

  const handler = () => {
    setMessage(`十分${message}`);
  };

  return (
    <div className="box">
      <code>Hello Word !</code>
      <span id="powerful" onClick={handler}>
        {message}
      </span>
    </div>
  );
};
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
const { useState } = React;

export default () => {
  const [message, setMessage] = useState(" 强大");

  const handler = () => {
    setMessage(`十分${message}`);
  };

  return (
    <div className="box">
      <code>Hello Word !</code>
      <span id="powerful" onClick={handler}>
        {message}
      </span>
    </div>
  );
};
```

```css
.box #powerful {
  color: blue;
}
```

:::
````
::::

## 其他支持

更多支持请参考 [主题插件配置](/note/vuepress-theme-plume/plugins-config/#markdownenhance)
