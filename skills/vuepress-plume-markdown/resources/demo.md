# Demo (live preview)

## Enable

```ts
markdown: { demo: true }
```

## Two forms

```md
@[demo [type] title="" desc="" expanded code-setting=""](url)

:::: demo [type] title="" desc="" expanded
<!-- fenced code blocks -->
::::
```

`type` is positional and optional: `normal` (default) for HTML/JS/CSS demos, `vue` for Vue SFC demos,
`markdown` for markdown demos. `title` / `desc` / `expanded` / `code-setting` are **key=value** attributes.

## Inline demo container

````md
:::: demo
```html
<button class="btn">Click me</button>
```
```js
document.querySelector('.btn').addEventListener('click', () => alert('hi'))
```
```css
.btn { padding: 8px 16px; }
```
::::
````

`html` / `js` / `css` / `ts` / `less` / `scss` / `styl` fences are all supported. For a tabbed source view, wrap
the fences in `::: code-tabs` (outer container then needs 4 colons):

````md
:::: demo
::: code-tabs
@tab HTML
```html
<div>hi</div>
```
@tab TS
```ts
const a: number = 1
```
::::
````

Vue component demo:

````md
:::: demo vue title="计数器" desc="点击 +1"
```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count += 1">{{ count }}</button>
</template>
```
::::
````

## Embed a file

```md
@[demo](./demo/normal.html)
@[demo normal](./demo/normal.html)
@[demo vue](./demo/Counter.vue)
@[demo vue](./demo/Counter.ts)            <!-- vue component written in TS -->
@[demo markdown](./demo/example.md)
@[demo vue expanded title="标题" desc="描述" code-setting=":collapsed-lines=10"](./demo/Counter.vue)
```

Files must live under `.vuepress/` (e.g. `.vuepress/demo/...`); the path may be relative to the current page or
site-absolute. `code-setting` passes shiki fence flags to the displayed source.

## External libraries

A `normal` demo file may load extra libs via a hidden `<script type="config">` block:

```html
<script type="config">
{ "jsLib": ["https://cdn.example.com/lib.js"], "cssLib": ["https://cdn.example.com/lib.css"] }
</script>
```

An inline `::: demo` supports the same idea through a ```` ```json ```` block (rendered hidden).

## Notes

- `@[demo ...]` never has a positional title — use `title="..."`.
- Preferred over `@[codepen]` / `@[codesandbox]` when the demo only needs HTML/CSS/JS.
