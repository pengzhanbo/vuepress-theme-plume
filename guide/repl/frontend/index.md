---
url: /guide/repl/frontend/index.md
---
## 概述

此功能支持在页面中嵌入代码演示功能。前端代码演示由两个主要区域组成：
\==渲染区== 和 ==代码区== 。

其中，**渲染区** 用于展示代码的执行结果，包括 UI 渲染和交互；**代码区** 用于展示源代码，默认是折叠的。

主题提供了三种不同的前端代码演示支持：

* \==vue 组件演示==： 支持 `vue` 组件的演示，像编写一个 `vue` 组件一样编写你的演示代码，可以用于演示如组件库、`composables-api` 等外部依赖。
* \==markdown 演示==：支持 `markdown` 的演示。
* \==普通代码演示== ：支持原生的 `HTML` + `JS/TS` + `CSS/Less/Sass/Stylus` 的代码演示，像编写一个网页一样编写你的演示代码。

主题还提供了两种不同的使用方式编写演示代码:

* 嵌入演示代码文件：

  ```md
  @[demo type](url)
  ```

  可以通过简单的嵌入语法，从文件中导入演示代码。

* demo 容器内联演示代码:

  ````md
  ::: demo type
  ``` [lang]
  code
  ```
  :::
  ````

  直接在 markdown 文件中编写演示代码，使用 `demo` 容器包裹即可。

## 配置

前端代码演示由 [vuepress-plugin-md-power](../../config/plugins/markdown-power.md) 提供支持。

前端代码演示默认不启用，你可以通过配置来启用它。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      demo: true, // [!code ++]
    },
  })
})
```

## 语言支持

代码演示支持以下语言：

* javascript
* typescript
* html
* css
* less
* sass
* stylus

对于 css 预处理语言，你需要在项目中安装对应的预处理器，如 `less` 、 `sass` 、 `stylus` 等。

## 嵌入语法

不同的代码演示均使用相同的嵌入语法，你可以快速掌握它们的使用方法。

```md
<!-- 语法 -->
@[demo](url)
@[demo [type]](url)
@[demo [type] title="" desc="" expanded code-setting=""](url)
```

`@[demo](url)` 是一个固定的语法格式。

`[type]` 表示类型，支持三个不同的值：

* `normal`: 普通代码演示类型。当不传入 `[type]` 参数时，默认为 `normal` 类型。
* `vue`: vue 组件演示类型。
* `markdown`: markdown 演示类型。

`url` 表示演示代码文件的路径，可以是相对路径或绝对路径，

* 相对路径，以 `./` 或 `../` 开头，表示相对于当前的 markdown 文件路径。
* 绝对路径，以 `/` 开头，表示从 [vuepress 源目录路径](../quick-start/project-structure.md#文档源目录) 开始。

::: warning 路径不能超出源目录
无论使用相对路径还是绝对路径，解析后的文件都必须位于文档源目录内。
任何解析后越出源目录的路径都会被拒绝，例如通过 `../` 向源目录外逃逸、或指向源目录外的符号链接。
构建时输出警告，且该演示不会被加载。
:::

```md
<!-- 普通代码演示 -->
@[demo](./demo/normal.html)
@[demo normal](./demo/normal.html)
@[demo](/.vuepress/demo/normal.html)

<!-- vue 组件演示 -->
@[demo vue](./demo/Counter.vue)
@[demo vue](./demo/Counter.ts)
@[demo](/.vuepress/demo/Counter.vue)

<!-- markdown 演示 -->
@[demo markdown](./demo/example.md)
@[demo markdown](/.vuepress/demo/example.md)
```

其它额外参数：

* `title="xxx"` ：演示标题
* `desc="xxx"`：演示描述
* `expanded`：展开代码区域
* `code-setting="xxx"`：代码设置，值将被拼接在 ` ``` [lang]` 之后，用于给代码块添加配置。

  `code-setting=":line-numbers"`,则会在代码块后面添加 `:line-numbers`，使代码块支持显示行号。

  `code-setting=":collapsed-lines=10"`,则会在代码块后面添加 `:collapsed-lines=10`，使代码块从第 10 行开始折叠。

```md
@[demo vue expanded title="标题" desc="描述" code-setting=":collapsed-lines=10"](./demo/Counter.vue)
```

## demo 容器内联演示

demo 容器内联演示使用 `demo` 容器包裹演示代码，可以在 markdown 文件中快速地编写演示代码，如下：

```md
::: demo [type] title="" desc="" expanded
<!-- 代码块 -->
:::
```

所有参数与 `@[demo](url)` 语法相同。

````md
<!-- 普通代码演示 -->
::: demo
```html
<!-- html 代码 -->
```
``` js
// js 代码
```
``` css
/* css 代码 */
```
:::

<!-- vue 组件演示 -->
::: demo vue
``` vue
<!--  vue 代码 -->
```
:::

<!-- markdown 演示 -->
::: demo markdown
``` md
<!-- markdown 代码 -->
```
:::
````

还可以在 `::: demo` 容器中使用 `::: code-tabs` 容器包裹代码块，以获得更好的交互效果。

````md
:::: demo
::: code-tabs
@tab HTML
```html
<!-- html 代码 -->
```
@tab javascript
``` js
// js 代码
```
@tab css
``` css
/* css 代码 */
```
::::
````

当期望使用 Typescript 或 `Less/Sass/Stylus` 时，通过修改 ` ``` [lang]` 的值即可：

````md
:::: demo
::: code-tabs
@tab HTML
```html
<!-- html 代码 -->
```
@tab Typescript
``` ts
// ts 代码
```
@tab Scss
``` scss
/* scss 代码 */
```
::::
````

## vue 组件演示

vue 组件演示是一个很强大的功能，对于演示代码不做任何限制，这甚至完全取决于 `bundler` 对于 vue 的支持。
你还可以直接在演示代码中导入项目中安装的依赖，就像你在写一个 vue 项目的组件一样。

因此，你可以直接使用它来为你的组件库提供演示示例，或者为你的 `composables-api` 提供演示示例。

### 嵌入语法

你可以直接使用以下方式在页面中嵌入一个 vue 组件演示:

**输入：**

```md
@[demo vue title="计数器" desc="点击 +1 按钮，计数器自增 1"](./demo/Counter.vue)
```

::: details 查看 `./demo/Counter.vue` 代码

@[code](./demo/Counter.vue)

:::

**输出：**

@[demo vue title="计数器" desc="点击 +1 按钮，计数器自增 1"](./demo/Counter.vue)

***

也可以嵌入一个 `.ts` 编写的 vue 组件：

**输入：**

```md
@[demo vue title="计数器" desc="点击 +1 按钮，计数器自增 1"](./demo/Counter.ts)
```

::: details 查看 `./demo/Counter.ts` 代码

::: code-tabs
@tab Counter.ts
@[code](./demo/Counter.ts)
@tab Counter.module.css
@[code](./demo/Counter.module.css)
:::

:::

**输出：**

@[demo vue title="计数器" desc="点击 +1 按钮，计数器自增 1"](./demo/Counter.ts)

:::info 对于 `.js/.ts` 编写的组件，请使用 `css module` 来编写样式以实现样式隔离
:::

***

可以在演示代码中导入外部依赖，
以导入 `@vueuse/core` 中的 `useToggle()` 为例:

**输入：**

```md
@[demo vue title="useToggle" desc="useToggle() 演示"](./demo/Toggle.vue)
```

::: details ./demo/Toggle.vue
@[code](./demo/Toggle.vue)
:::

**输出：**

@[demo vue title="useToggle" desc="useToggle() 演示"](./demo/Toggle.vue)

### 容器语法

在 markdown 文件中使用 `demo` 容器包裹演示代码，可以快速地编写演示代码，如下：

**输入：**

:::: details 展开查看完整代码

````md
::: demo vue title="计数器" desc="点击 +1 按钮，计数器自增 1"
```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="counter">
    <p>计数器：{{ count }}</p>
    <button type="button" class="btn" @click="count += 1">
      + 1
    </button>
  </div>
</template>

<style scoped>
.btn {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}
</style>
```
:::
````

::::

**输出：**

::: demo vue title="计数器" desc="点击 +1 按钮，计数器自增 1"

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="counter">
    <p>计数器：{{ count }}</p>
    <button type="button" class="btn" @click="count += 1">
      + 1
    </button>
  </div>
</template>

<style scoped>
.btn {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}
</style>
```

:::

:::::: warning
vue demo 容器语法虽然也支持使用 `.js/ts + css` 的方式来嵌入演示代码，
但主题不推荐这样做。因为样式无法被隔离，这可能导致样式污染。

::::: details 参考示例

````md
:::: demo vue title="标题" desc="描述"
::: code-tabs
@tab Counter.ts
```ts
import { defineComponent, ref } from 'vue'

export default defineComponent({
  // code
})
```
@tab Counter.css
```css
/* css code */
```
:::
::::
````

:::::
::::::

## 普通代码演示

普通代码演示支持 `html` 、 `css/less/sass/stylus` 、 `js/ts` 语言。

适合于相对简单的代码演示，比如一个样式渲染效果，一个交互效果，一个功能等。

普通代码演示还支持跳转到 `codePen` 和 `jsFiddle` 中查看。

同时，也支持通过外部链接的方式引入第三方的库，比如 `jQuery` ， `dayjs` 等。

::: warning 不建议过于复杂的演示。
:::

### 嵌入语法

使用嵌入语法时，对于导入的代码演示文件，使用 `.html` 作为文件后缀。在 `.html` 文件中，
你可以像编写一个 HTML 页面一样编写演示代码：

```html
<!-- html 代码 -->
<div id="app">
  演示内容
<div>

<!-- 脚本内容，使用 lang 属性设置语言, 默认为 js -->
<script lang="ts">
</script>

<!-- 样式内容，使用 lang 属性设置语言, 默认为 css -->
<style lang="css">
</style>

<!-- 可选的配置文件 json 格式 -->
<script type="config">
{
  "jsLib": [],
  "cssLib": []
}
</script>
```

每一个区域的内容都是可选的。但请注意，不支持存在多个相同的区域。区域的顺序无要求。
除了 `<script>` 和 `<style>` 之外的内容，都被认为是 HTML 代码。

你可以在 `<script type="config"></script>` 内使用 `json` 格式声明要加载的其他依赖资源。

比如，加载 `jQuery`， 以及 `normalize.css`:

```html
<div>xxxx</div>

<script type="config">
{
  "jsLib": [
    "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"
  ],
  "cssLib": [
    "https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css"
  ]
}
</script>
```

***

一个常规的示例：

**输入：**

```md
@[demo title="示例" desc="这是一个常规演示"](./demo/normal.html)
```

::: details 查看 `./demo/normal.html`代码
@[code](./demo/normal.html)
:::

**输出：**

@[demo title="示例" desc="这是一个常规演示"](./demo/normal.html)

***

引入 `jQuery` , `dayjs` 和 `normalize.css` 的示例:

**输入：**

```md
@[demo title="示例" desc="这是一个常规演示"](./demo/normal-lib.html)
```

::: details 查看 `./demo/normal-lib.html`代码
@[code](./demo/normal-lib.html)
:::

**输出：**

@[demo title="示例" desc="这是一个常规演示"](./demo/normal-lib.html)

### 容器语法

在 markdown 文件中使用 demo 容器包裹演示代码，可以快速地编写演示代码，如下：

:::: details 展开查看完整示例代码

````md
::: demo title="示例" desc="描述" expanded
```json
{
  "jsLib": [],
  "cssLib": []
}
```

```html
<!-- html 代码 -->
```

```js
// js 代码
```

```css
/* css 代码 */
```
:::
````

::::

还可以在 `::: demo` 中包裹 `::: code-tabs` 以获得更好的代码块展示效果：

::::: details 展开查看完整示例代码

````md
:::: demo title="示例" desc="描述" expanded
```json
{
  "jsLib": [],
  "cssLib": []
}
```
::: code-tabs
@tab HTML
```html
<!-- html 代码 -->
```
@tab Javascript
```js
// js 代码
```
@tab CSS
```css
/* css 代码 */
```
:::
::::
````

:::::

***

一个常规的容器示例：

**输入：**

::::: details 展开查看完整示例代码

````md
:::: demo title="常规示例" desc="一个常规示例"
::: code-tabs
@tab HTML
```html
<div id="app">
  <h3>vuepress-theme-plume</h3>
</div>
```
@tab Javascript
```js
const a = 'So Awesome!'
const app = document.querySelector('#app')
app.appendChild(document.createElement('small')).textContent = a
```
@tab CSS
```css
#app {
  font-size: 2em;
  text-align: center;
}
```
:::
::::
````

:::::

**输出：**

:::: demo title="常规示例" desc="一个常规示例"

::: code-tabs
@tab HTML

```html
<div id="app">
  <h3>vuepress-theme-plume</h3>
</div>
```

@tab Javascript

```js
const a = 'So Awesome!'
const app = document.querySelector('#app')
app.appendChild(document.createElement('small')).textContent = a
```

@tab CSS

```css
#app {
  font-size: 2em;
  text-align: center;
}
```

:::
::::

***

引入 jQuery , dayjs 和 normalize.css 的示例:

**输入：**

::::: details 展开查看完整示例代码

````md
:::: demo title="常规示例" desc="一个常规示例"
```json
{
  "jsLib": [
    "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js"
  ],
  "cssLib": ["https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css"]
}
```
::: code-tabs
@tab HTML
```html
<div id="app">
  <h3>vuepress-theme-plume</h3>
  <p id="message"></p>
  <datetime id="datetime"></datetime>
</div>
```
@tab Javascript
```js
$('#message').text('So Awesome!')
const datetime = $('#datetime')
setInterval(() => {
  datetime.text(dayjs().format('YYYY-MM-DD HH:mm:ss'))
}, 1000)
```
@tab CSS
```css
#app {
  font-size: 2em;
  text-align: center;
}
```
:::
::::
````

:::::

**输出：**

:::: demo title="常规示例" desc="一个常规示例"

```json
{
  "jsLib": [
    "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js"
  ],
  "cssLib": ["https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css"]
}
```

::: code-tabs
@tab HTML

```html
<div id="app">
  <h3>vuepress-theme-plume</h3>
  <p id="message"></p>
  <datetime id="datetime"></datetime>
</div>
```

@tab Javascript

```js
$('#message').text('So Awesome!')
const datetime = $('#datetime')
setInterval(() => {
  datetime.text(dayjs().format('YYYY-MM-DD HH:mm:ss'))
}, 1000)
```

@tab CSS

```css
#app {
  font-size: 2em;
  text-align: center;
}
```

:::
::::

## Markdown 演示

在页面中演示 markdown 源代码和渲染结果。

### 嵌入语法

**输入：**

```md
@[demo markdown title="公告板" desc="公告板代码示例"](/.vuepress/bulletin.md)
```

::: details 展开查看 `/.vuepress/bulletin.md` 代码
@[code](../../.vuepress/bulletin.md)
:::

**输出：**

@[demo markdown title="公告板" desc="公告板代码示例"](/.vuepress/bulletin.md)

### 容器语法

**输入：**

:::::: details 展开查看完整代码

````md
:::: demo markdown title="公告板" desc="公告板代码示例"
```md
::: center

**QQ 交流群：** [792882761](https://qm.qq.com/q/FbPPoOIscE)

![QQ qr_code](/images/qq_qrcode.png){width="618" height="616" style="width: 200px"}

您在使用过程中遇到任何问题，欢迎通过 [issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues/new/choose) 反馈。也欢迎加入我们的 QQ 交流群一起讨论。

:::
```
::::
````

::::::

**输出：**

:::: demo markdown title="公告板" desc="公告板代码示例"

```md
::: center

**QQ 交流群：** [792882761](https://qm.qq.com/q/FbPPoOIscE)

![QQ qr_code](/images/qq_qrcode.png){width="618" height="616" style="width: 200px"}

您在使用过程中遇到任何问题，欢迎通过 [issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues/new/choose) 反馈。也欢迎加入我们的 QQ 交流群一起讨论。

:::
```

::::
