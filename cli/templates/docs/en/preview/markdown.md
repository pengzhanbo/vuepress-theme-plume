---
title: Markdown
tags:
  - markdown
---

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

Bold: **Bold text**

Italic: _Italic text_

~~Deleted text~~

Content ==Highlight==

Mathematical expression: $-(2^{n-1})$ ~ $2^{n-1} -1$

$\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right)
= \left(\frac {y^{\omega}} {\omega}\right) \left\{(\log y)^r + \sum_{i=1}^r \frac {(-1)^ Ir \cdots (r-i+1) (\log y)^{ri}} {\omega^i} \right\}$

19^th^

H~2~O

::: center
content center
:::

::: right
content right
:::

- Unordered List 1
- Unordered List 2
- Unordered List 3

1. Ordered List 1
2. Ordered List 2
3. Ordered List 3

- [ ] Task List 1
- [ ] Task List 2
- [x] Task List 3
- [x] Task List 4

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

> quote content
>
> quote content

[links](/)

[outside links](https://github.com/pengzhanbo)

**Badge：**

- <Badge type="info" text="info badge" />
- <Badge type="tip" text="tip badge" />
- <Badge type="warning" text="warning badge" />
- <Badge type="danger" text="danger badge" />

**icons：**

- home - <Icon name="material-symbols:home" color="currentColor" size="1em" />
- vscode - <Icon name="skill-icons:vscode-dark" size="2em" />
- twitter - <Icon name="skill-icons:twitter" size="2em" />

**demo wrapper：**

::: demo-wrapper title="Demo" no-padding height="200px"
<style scoped>
.open-door {
  display: flex;
  gap: 20px;
  padding: 20px;
}
.open-door .main {
  background: #ccc;
}
</style>

<div class="open-door">
  <div class="main">main</div>
  <div class="aside">aside</div>
</div>

:::

**code block：**

```js whitespace
const a = 1
const b = 2
const c = a + b

// [!code word:obj]
const obj = {
  toLong: {
    deep: {
      deep: {
        deep: {
          value: 'this is to long text. this is to long text. this is to long text. this is to long text.', // [!code highlight]
        }
      }
    }
  }
}
```

**code groups：**

::: code-tabs
@tab tab1

```js
const a = 1
const b = 2
const c = a + b
```

@tab tab2

```ts
const a: number = 1
const b: number = 2
const c: number = a + b
```

:::

**code highlight：**

```ts
function foo() {
  const a = 1 // [!code highlight]

  console.log(a)

  const b = 2 // [!code ++]
  const c = 3 // [!code --]

  console.log(a + b + c) // [!code error]
  console.log(a + b) // [!code warning]
}
```

**code focus：**

```ts
function foo() {
  const a = 1 // [!code focus]
}
```

::: note
note content [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

::: info
content [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

::: tip
content [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

::: warning
content [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

::: caution
content [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

::: important
content [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

**GFM alert：**

> [!note]
> note

> [!info]
> info

> [!tip]
> tip

> [!warning]
> warning

> [!caution]
> caution

> [!important]
> important

**code demo:**

::: normal-demo Demo 演示

```html
<h1>Hello Word!</h1>
<p><span id="very">Very</span>Powerful!</p>
```

```js
document.querySelector('#very').addEventListener('click', () => {
  alert('Very Powerful')
})
```

```css
span {
  color: red;
}
```

:::

**tab card：**

::: tabs
@tab title 1
content block

@tab title 2
content block
:::

:::: warning
::: tabs
@tab title 1
content block

@tab title 2
content block
:::
::::

**footnote：**

footnote 1 link[^first]。

footnote 2 link[^second]。

inline footnote ^[^first] definition。

Repeated footnote definition[^second]。

[^first]: footnote **you can contain special mark**

    also can contain paragraph

[^second]: footnote content.
