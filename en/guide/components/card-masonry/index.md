---
url: /en/guide/components/card-masonry/index.md
---
## Overview

The Masonry Card is a versatile container component that automatically calculates the height of
each **item** and arranges them in a masonry layout. Any content can be placed within `<CardMasonry>`.

::: details What is an item?

An item represents individual content such as an image, text, video, etc.

* In Markdown syntax, any content occupying its own line (with blank lines before and after) is considered an item.
* In HTML structure, each direct child element of the container is considered an item.

:::

```md
<CardMasonry>

<img src="..." alt="...">

<!-- More content -->

</CardMasonry>
```

## Props

:::: field-group

::: field name="cols" type="number | { sm: number, md: number, lg: number }" optional
Number of columns.

The component automatically adjusts the number of columns based on screen width by default.
Three columns are displayed when space permits, while two columns are shown on smaller screens.

The `cols` prop configures the number of columns. When a `number` is provided,
all screen sizes display `number` columns. When `{ sm: number, md: number, lg: number }` is provided,
the number of columns adjusts automatically based on screen width.

* `sm` : `< 640px`
* `md` : `>= 640px < 960px`
* `lg` : `>= 960px`
  :::

::: field name="gap" type="number" optional default="16"
Gap between columns.
:::

::::

## Markdown Syntax Support

In Markdown, the `::: card-masonry` container can be used instead of `<CardMasonry>`.

```md
::: card-masonry cols="3" gap="16" <!-- [!code hl]-->

![](/images/1.png)

<!-- More content -->

::: <!-- [!code hl]-->
```

## Examples

### Image Masonry

Masonry layout is particularly suitable for displaying images. You can directly place `![](image_url)` within `::: card-masonry`.

**Input:**

```md
::: card-masonry

![](image_url)

![](image_url)

![](image_url)

![](image_url)

![](image_url)

![](image_url)

:::
```

**Output:**

::: card-masonry
![a](https://images.unsplash.com/photo-1719937051124-91c677bc58fc?w=800\&auto=format\&fit=crop\&q=60\&ixlib=rb-4.0.3\&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8)

![b](https://plus.unsplash.com/premium_photo-1731329153355-1015daf2cb92?w=800\&auto=format\&fit=crop\&q=60\&ixlib=rb-4.0.3\&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8)

![c](https://images.unsplash.com/photo-1731323036230-fb37b4d9ed71?w=800\&auto=format\&fit=crop\&q=60\&ixlib=rb-4.0.3\&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8)

![a](https://images.unsplash.com/photo-1730630906214-1256b57d65b7?w=800\&auto=format\&fit=crop\&q=60\&ixlib=rb-4.0.3\&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8)

![b](https://plus.unsplash.com/premium_photo-1733864822156-f3cf26187fd9?w=800\&auto=format\&fit=crop\&q=60\&ixlib=rb-4.0.3\&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8)

![a](https://images.unsplash.com/photo-1731756748993-85e1513dfc76?w=800\&auto=format\&fit=crop\&q=60\&ixlib=rb-4.0.3\&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8)

![b](https://images.unsplash.com/photo-1733705879328-a18f2a025c67?w=800\&auto=format\&fit=crop\&q=60\&ixlib=rb-4.0.3\&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx)
:::

### Card Masonry

Masonry layout is also suitable for displaying cards. You can place `::: card` containers within `::: card-masonry`.

**Input:**

```md :collapsed-lines
:::: card-masonry

::: card title="Card 1"
Card content
:::

::: card title="Card 2"
Card content

Additional card content
:::

::: card title="Card 3"
Card content
:::

::: card title="Card 4"
Card content
:::

::: card title="Card 5"
Card content

Additional card content
:::

::: card title="Card 6"
Card content
:::

::::
```

**Output:**

:::: card-masonry

::: card title="Card 1"
Card content
:::

::: card title="Card 2"
Card content

Additional card content
:::

::: card title="Card 3"
Card content
:::

::: card title="Card 4"
Card content
:::

::: card title="Card 5"
Card content

Additional card content
:::

::: card title="Card 6"
Card content
:::

::::

### Code Block Masonry

**Input:**

````md :collapsed-lines
:::card-masonry

```ts
const a = 1
```

```json
{
  "name": "John"
}
```

```css
p {
  color: red;
}
```

```html
<html>
  <body>
    <h1>Hello world</h1>
  </body>
</html>
```

```ts
const a = 12
const b = 1
```

```rust
fn main() {
    println!("Hello, world!");
}
```

:::
````

**Output:**

:::card-masonry

```ts
const a = 1
```

```json
{
  "name": "John"
}
```

```css
p {
  color: red;
}
```

```html
<html>
  <body>
    <h1>Hello world</h1>
  </body>
</html>
```

```ts
const a = 12
const b = 1
```

```rust
fn main() {
    println!("Hello, world!");
}
```

:::
