---
url: /en/guide/repl/frontend/index.md
---
::: important Legacy Frontend Code Demo Deprecated - Please Migrate to New Solution

The legacy solution was provided by [vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/zh/).
We appreciate its support for code demos in the past. The code demo functionality in
`vuepress-plugin-md-enhance` will be migrated to [vuepress/ecosystem](https://github.com/vuepress/ecosystem). For details, please refer to [vuepress/ecosystem#293](https://github.com/vuepress/ecosystem/pull/293).

:::

::: details Why Redesign?

Frontend code demos are a highly useful feature, but the legacy implementation did not align with actual usage scenario expectations.

In the legacy solution, for example, `vue-demo` only supported simple Vue component demonstrations
and could not directly import dependencies from the project. It relied on loading external scripts for
additional functionality and did not provide full support for Vue SFC, being limited to simple code demonstrations.

Furthermore, script code compilation occurred in the browser runtime. It required loading `babel` from a
CDN first, then performing the transformation via `babel`, which introduced additional waiting time.
Additionally, for internal enterprise projects within an intranet environment that cannot access external
resources, the demos failed to display properly.

In the new solution, all demo code is compiled and transformed during the Node.js runtime.
Therefore, demo code can be displayed directly in the browser runtime without extra waiting time.
Leveraging Node.js's powerful capabilities, it fully supports all features of Vue SFC and allows direct
import of project dependencies, enabling richer demonstrations that better match real-world usage scenarios.
:::

## Overview

This feature supports embedding code demonstration functionality within pages. A frontend code demo consists of two main areas:
\==Render Area== and ==Code Area==.

The **Render Area** displays the execution results of the code, including UI rendering and interactions.
The **Code Area** displays the source code and is collapsed by default.

The theme provides support for three different types of frontend code demos:

* \==Vue Component Demo==: Supports demonstrations of `Vue` components.
  Write your demo code as you would a `Vue` component.
  It can be used to demonstrate external dependencies like component libraries or `Composables API`.
* \==Markdown Demo==: Supports demonstrations of `Markdown`.
* \==Normal Code Demo==: Supports native `HTML` + `JS/TS` + `CSS/Less/Sass/Stylus` code demos. Write your demo code as you would a web page.

The theme also provides two different methods for writing demo code:

* Embed Demo Code Files:

  ```md
  @[demo type](url)
  ```

  Use simple embedding syntax to import demo code from files.

* Inline Demo Code within Demo Container:

  ````md
  ::: demo type
  ``` [lang]
  code
  ```
  :::
  ````

  Write demo code directly within the markdown file, wrapped in a `demo` container.

## Configuration

Frontend code demos are powered by [vuepress-plugin-md-power](../../config/plugins/markdown-power.md).

Frontend code demos are disabled by default. You can enable them via configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      demo: true, // [!code ++]
    },
  })
})
```

## Language Support

Code demos support the following languages:

* javascript
* typescript
* html
* css
* less
* sass
* stylus

For CSS preprocessor languages, you need to install the corresponding preprocessor in your project, such as `less`, `sass`, or `stylus`.

## Embed Syntax

Different code demos use the same embed syntax, allowing you to quickly grasp their usage.

```md
<!-- Syntax -->
@[demo](url)
@[demo [type]](url)
@[demo [type] title="" desc="" expanded code-setting=""](url)
```

`@[demo](url)` is a fixed syntax format.

`[type]` indicates the type and supports three different values:

* `normal`: Normal code demo type. This is the default type when the `[type]` parameter is omitted.
* `vue`: Vue component demo type.
* `markdown`: Markdown demo type.

`url` indicates the path to the demo code file, which can be relative or absolute.

* Relative paths start with `./` or `../` and are relative to the current markdown file's path.
* Absolute paths start with `/` and are resolved from the [VuePress source directory path](../quick-start/project-structure.md#document-source-directory).

```md
<!-- Normal Code Demo -->
@[demo](./demo/normal.html)
@[demo normal](./demo/normal.html)
@[demo](/.vuepress/demo/normal.html)

<!-- Vue Component Demo -->
@[demo vue](./demo/Counter.vue)
@[demo vue](./demo/Counter.ts)
@[demo](/.vuepress/demo/Counter.vue)

<!-- Markdown Demo -->
@[demo markdown](./demo/example.md)
@[demo markdown](/.vuepress/demo/example.md)
```

Additional parameters:

* `title="xxx"`: Demo title.
* `desc="xxx"`: Demo description.
* `expanded`: Expand the code area.
* `code-setting="xxx"`: Code settings. The value will be appended after \`\`\` \[lang]\` and is used to add configurations to the code block.

  `code-setting=":lines-number"` will add `:lines-number` after the code block, enabling line numbers.

  `code-setting=":collapsed-lines=10"` will add `:collapsed-lines=10` after the code block,
  causing the code block to be collapsed starting from line 10.

```md
@[demo vue expanded title="Title" desc="Description" code-setting=":collapsed-lines=10"](./demo/Counter.vue)
```

## Demo Container Inline Demo

Demo container inline demos use the `demo` container to wrap the demo code, allowing quick writing of demo code within the markdown file:

```md
::: demo [type] title="" desc="" expanded
<!-- Code Block -->
:::
```

All parameters are the same as the `@[demo](url)` syntax.

````md
<!-- Normal Code Demo -->
::: demo
```html
<!-- html code -->
```
``` js
// js code
```
``` css
/* css code */
```
:::

<!-- Vue Component Demo -->
::: demo vue
``` vue
<!-- vue code -->
```
:::

<!-- Markdown Demo -->
::: demo markdown
``` md
<!-- markdown code -->
```
:::
````

You can also wrap code blocks with the `::: code-tabs` container within the `::: demo` container for better interactive presentation.

````md
:::: demo
::: code-tabs
@tab HTML
```html
<!-- html code -->
```
@tab javascript
``` js
// js code
```
@tab css
``` css
/* css code */
```
:::
:::::
````

When using TypeScript or `Less/Sass/Stylus`, simply modify the value of ` ``` [lang]`:

````md
:::: demo
::: code-tabs
@tab HTML
```html
<!-- html code -->
```
@tab Typescript
``` ts
// ts code
```
@tab Scss
``` scss
/* scss code */
```
:::
:::::
````

## Vue Component Demo

Vue component demo is a powerful feature with no restrictions on the demo code—it ultimately depends on the `bundler`'s support for Vue.
You can directly import dependencies installed in your project within the demo code, just as you would when writing a component in a Vue project.

Therefore, you can use it directly to provide demonstration examples for your component library or for your `Composables API`.

### Embed Syntax

You can directly embed a Vue component demo in a page using the following method:

**Input:**

```md
@[demo vue title="Counter" desc="Click the +1 button to increment the counter by 1"](./demo/Counter.vue)
```

::: details View `./demo/Counter.vue` Code

@[code](./demo/Counter.vue)

:::

**Output:**

@[demo vue title="Counter" desc="Click the +1 button to increment the counter by 1"](./demo/Counter.vue)

***

You can also embed a Vue component written in `.ts`:

**Input:**

```md
@[demo vue title="Counter" desc="Click the +1 button to increment the counter by 1"](./demo/Counter.ts)
```

::: details View `./demo/Counter.ts` Code

::: code-tabs
@tab Counter.ts
@[code](./demo/Counter.ts)
@tab Counter.module.css
@[code](./demo/Counter.module.css)
:::

**Output:**

@[demo vue title="Counter" desc="Click the +1 button to increment the counter by 1"](./demo/Counter.ts)

:::info For components written in `.js/.ts`, use `CSS Module` to write styles for style isolation.
:::

***

You can import external dependencies in the demo code.
Example using `useToggle()` from `@vueuse/core`:

**Input:**

```md
@[demo vue title="useToggle" desc="useToggle() Demo"](./demo/Toggle.vue)
```

::: details ./demo/Toggle.vue
@[code](./demo/Toggle.vue)
:::

**Output:**

@[demo vue title="useToggle" desc="useToggle() Demo"](./demo/Toggle.vue)

### Container Syntax

Using the `demo` container to wrap demo code in a markdown file allows for quick demo code writing:

**Input:**

:::: details Expand to view full code

````md
::: demo vue title="Counter" desc="Click the +1 button to increment the counter by 1"
```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="counter">
    <p>Counter: {{ count }}</p>
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

**Output:**

::: demo vue title="Counter" desc="Click the +1 button to increment the counter by 1"

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="counter">
    <p>Counter: {{ count }}</p>
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
The Vue demo container syntax also supports embedding demo code using the `.js/ts + css` approach,
but this is not recommended by the theme. Styles cannot be isolated, which may lead to style pollution.

::::: details Reference Example

````md
:::: demo vue title="Title" desc="Description"
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

## Normal Code Demo

Normal code demos support `html`, `css/less/sass/stylus`, and `js/ts` languages.

They are suitable for relatively simple code demonstrations, such as a style rendering effect, an interaction effect, or a functionality.

Normal code demos also support jumping to `CodePen` and `jsFiddle` for viewing.

Additionally, they support importing third-party libraries via external links, such as `jQuery` or `dayjs`.

::: warning Overly complex demonstrations are not recommended.
:::

### Embed Syntax

When using the embed syntax, use `.html` as the file suffix for the imported demo code file.
In the `.html` file, you can write the demo code as you would an HTML page:

```html
<!-- html code -->
<div id="app">
  Demo Content
<div>

<!-- Script content, use lang attribute to set language, defaults to js -->
<script lang="ts">
</script>

<!-- Style content, use lang attribute to set language, defaults to css -->
<style lang="css">
</style>

<!-- Optional configuration file in json format -->
<script type="config">
{
  "jsLib": [],
  "cssLib": []
}
</script>
```

Each section is optional. However, note that multiple identical sections are not supported. The order of sections does not matter.
Content outside of `<script>` and `<style>` is considered HTML code.

You can declare additional dependency resources to load using JSON format within `<script type="config"></script>`.

For example, loading `jQuery` and `normalize.css`:

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

A conventional example:

**Input:**

```md
@[demo title="Example" desc="This is a conventional demo"](./demo/normal.html)
```

::: details View `./demo/normal.html` Code
@[code](./demo/normal.html)
:::

**Output:**

@[demo title="Example" desc="This is a conventional demo"](./demo/normal.html)

***

Example introducing `jQuery`, `dayjs`, and `normalize.css`:

**Input:**

```md
@[demo title="Example" desc="This is a conventional demo"](./demo/normal-lib.html)
```

::: details View `./demo/normal-lib.html` Code
@[code](./demo/normal-lib.html)
:::

**Output:**

@[demo title="Example" desc="This is a conventional demo"](./demo/normal-lib.html)

### Container Syntax

Using the demo container to wrap demo code in a markdown file allows for quick demo code writing:

:::: details Expand to view full example code

`````md
::: demo title="Example" desc="Description" expanded
```json
{
  "jsLib": [],
  "cssLib": []
}
```

```html
<!-- html code -->
```

```js
// js code
```

```css
/* css code */
```
:::
```
::::

You can also wrap `::: code-tabs` within `::: demo` for better code block presentation:

::::: details Expand to view full example code

````md
:::: demo title="Example" desc="Description" expanded
```json
{
  "jsLib": [],
  "cssLib": []
}
```
::: code-tabs
@tab HTML
```html
<!-- html code -->
```
@tab Javascript
```js
// js code
```
@tab CSS
```css
/* css code */
```
:::
::::
```
:::::

---

A conventional container example:

**Input:**

::::: details Expand to view full example code

````md
:::: demo title="Conventional Example" desc="A conventional example"
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
`````

:::::

**Output:**

:::: demo title="Conventional Example" desc="A conventional example"

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

Example introducing jQuery, dayjs, and normalize.css:

**Input:**

::::: details Expand to view full example code

````md
:::: demo title="Conventional Example" desc="A conventional example"
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

**Output:**

:::: demo title="Conventional Example" desc="A conventional example"

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

## Markdown Demo

Demonstrate markdown source code and rendering results within a page.

### Embed Syntax

**Input:**

```md
@[demo markdown title="Bulletin Board" desc="Bulletin Board Code Example"](/.vuepress/bulletin.md)
```

::: details Expand to view `/.vuepress/bulletin.md` Code
@[code](../../../.vuepress/bulletin.md)
:::

**Output:**

@[demo markdown title="Bulletin Board" desc="Bulletin Board Code Example"](/.vuepress/bulletin.md)

### Container Syntax

**Input:**

:::::: details Expand to view full code

````md
:::: demo markdown title="Bulletin Board" desc="Bulletin Board Code Example"
```md
::: center

**QQ Group:** [792882761](https://qm.qq.com/q/FbPPoOIscE)

![QQ qr_code](/images/qq_qrcode.png){width="618" height="616" style="width: 200px"}

If you encounter any issues during use, please feel free to provide feedback via [issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues/new/choose). You are also welcome to join our QQ group for discussion.

:::
```
::::
````

::::::

**Output:**

:::: demo markdown title="Bulletin Board" desc="Bulletin Board Code Example"

```md
::: center

**QQ Group:** [792882761](https://qm.qq.com/q/FbPPoOIscE)

![QQ qr_code](/images/qq_qrcode.png){width="618" height="616" style="width: 200px"}

If you encounter any issues during use, please feel free to provide feedback via [issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues/new/choose). You are also welcome to join our QQ group for discussion.

:::
```

::::
