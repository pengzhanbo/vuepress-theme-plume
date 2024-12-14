---
title: 瀑布流容器
icon: ri:layout-masonry-line
createTime: 2024/12/14 17:17:06
permalink: /guide/components/card-masonry/
badge:
  text: v1.0.0-rc.121 +
---

## 概述

瀑布流容器是一个 通用的容器组件，你可以把任何内容放到 `<CardMasonry>` 里面，容器会自动计算每一个 **项** 的高度，
然后将它们按照瀑布流的方式进行排列。

::: details 什么是项 ？

项 表示的是一个单独的内容，可以是图片、文字、视频等等。

- 从 markdown 的语法而言，独占一行的可以被认为是一个项。（该行的前后应该有空行）
- 从 html 的结构而言，容器下的每一个子元素都会被认为是一个项。

:::

```md
<CardMasonry>

<img src="..." alt="...">

<!-- 更多内容 -->

</CardMasonry>
```

## Props

| 名称 | 类型                                             | 默认值 | 说明           |
| :--- | :----------------------------------------------- | :----- | :------------- |
| cols | `number \| Record<'sm' \| 'md' \| 'lg', number>` | `3`    | 列数           |
| gap  | `number`                                         | `16`   | 列之间的间距   |

组件默认会根据屏幕宽度自动调整列数。在空间足够时，默认显示三列，小屏幕下显示双列。

你可以通过 `cols` 配置列数。当传入 `number` 时，所有尺寸均显示为 `number` 个卡片。
传入 `{ sm: number, md: number, lg: number }` 时，根据屏幕宽度自动调整列数。

- `sm` : `< 640px`
- `md` : `>= 640px < 960px`
- `lg` : `>= 960px`

## Markdown 语法支持

在 markdown 中，可以使用 `::: card-masonry` 容器代替 `<CardMasonry>`。

``` md
::: card-masonry cols="3" gap="16" <!-- [!code hl]-->

![](/images/1.png)

<!-- 更多内容 -->

::: <!-- [!code hl]-->
```

## 示例

### 图片瀑布流

瀑布流特别适合用于展示图片，你可以直接在将 `![](image_url)` 写到 `::: card-masonry` 中。

**输入：**

``` md
::: card-masonry

![](image_url)

![](image_url)

![](image_url)

![](image_url)

![](image_url)

![](image_url)

:::
```

**输出：**

::: card-masonry
![a](https://images.unsplash.com/photo-1719937051124-91c677bc58fc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8)

![b](https://plus.unsplash.com/premium_photo-1731329153355-1015daf2cb92?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8)

![c](https://images.unsplash.com/photo-1731323036230-fb37b4d9ed71?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8)

![a](https://images.unsplash.com/photo-1730630906214-1256b57d65b7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8)

![b](https://plus.unsplash.com/premium_photo-1733864822156-f3cf26187fd9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8)

![a](https://images.unsplash.com/photo-1731756748993-85e1513dfc76?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8)

![b](https://images.unsplash.com/photo-1733705879328-a18f2a025c67?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx)
:::

### 卡片瀑布流

瀑布流也适合用于展示卡片，你可以直接在将 `::: card` 写到 `::: card-masonry` 中。

**输入：**

``` md :collapsed-lines
:::: card-masonry

::: card title="卡片1"
卡片内容
:::

::: card title="卡片2"
卡片内容

卡片内容
:::

::: card title="卡片3"
卡片内容
:::

::: card title="卡片4"
卡片内容
:::

::: card title="卡片5"
卡片内容

卡片内容
:::

::: card title="卡片6"
卡片内容
:::

::::
```

**输出：**

:::: card-masonry

::: card title="卡片1"
卡片内容
:::

::: card title="卡片2"
卡片内容

卡片内容
:::

::: card title="卡片3"
卡片内容
:::

::: card title="卡片4"
卡片内容
:::

::: card title="卡片5"
卡片内容

卡片内容
:::

::: card title="卡片6"
卡片内容
:::

::::

### 代码块瀑布流

**输入：**

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

**输出：**

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
