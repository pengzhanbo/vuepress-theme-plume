---
url: /en/guide/markdown/container/index.md
---
::: tip Tip containers help you highlight important information in your documentation, making the content hierarchy clearer.
:::

Tip containers define different information display styles through type, title, and content.

## Default Title Styles

**Input Example:**

```md
::: note
This is a note container
:::

::: info
This is an info container
:::

::: tip
This is a tip container
:::

::: warning
This is a warning container
:::

::: caution
This is a danger warning container
:::

::: details
This is a details collapsible container
:::
```

**Actual Effect:**

::: note
This is a note container
:::

::: info
This is an info container
:::

::: tip
This is a tip container
:::

::: warning
This is a warning container
:::

::: caution
This is a danger warning container
:::

::: details
This is a details collapsible container
:::

## Custom Title Settings

You can easily set custom titles by adding text after the container type.

**Input Example:**

````md
::: caution STOP
Danger zone, do not proceed
:::

::: details Click to view code
```js
console.log('Hello, VitePress!')
```
:::
````

**Actual Effect:**

::: caution STOP
Danger zone, do not proceed
:::

::: details Click to view code

```js
console.log('Hello, VuePress Plume!')
```

:::
