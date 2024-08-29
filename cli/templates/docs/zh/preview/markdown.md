---
title: Markdown
tags:
  - markdown
---

## 标题 2

### 标题 3

#### 标题 4

##### 标题 5

###### 标题 6

加粗：**加粗文字**

斜体： _斜体文字_

~~删除文字~~

内容 ==标记==

数学表达式： $-(2^{n-1})$ ~ $2^{n-1} -1$

$\frac {\partial^r} {\partial \omega^r} \left(\frac {y^{\omega}} {\omega}\right)
= \left(\frac {y^{\omega}} {\omega}\right) \left\{(\log y)^r + \sum_{i=1}^r \frac {(-1)^ Ir \cdots (r-i+1) (\log y)^{ri}} {\omega^i} \right\}$

19^th^

H~2~O

::: center
内容居中
:::

::: right
内容右对齐
:::

- 无序列表1
- 无序列表2
- 无序列表3

1. 有序列表1
2. 有序列表2
3. 有序列表3

- [ ] 任务列表1
- [ ] 任务列表2
- [x] 任务列表3
- [x] 任务列表4

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

> 引用内容
>
> 引用内容

[链接](/)

[外部链接](https://github.com/pengzhanbo)

**Badge：**

- <Badge type="info" text="info badge" />
- <Badge type="tip" text="tip badge" />
- <Badge type="warning" text="warning badge" />
- <Badge type="danger" text="danger badge" />

**图标：**

- home - <Icon name="material-symbols:home" color="currentColor" size="1em" />
- vscode - <Icon name="skill-icons:vscode-dark" size="2em" />
- twitter - <Icon name="skill-icons:twitter" size="2em" />

**demo wrapper：**

::: demo-wrapper title="示例" no-padding height="200px"
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

**代码：**

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

**代码分组：**

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

**代码块高亮：**

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

**代码块聚焦：**

```ts
function foo() {
  const a = 1 // [!code focus]
}
```

::: note 注释
注释内容 [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

::: info 信息
信息内容 [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

::: tip 提示
提示内容 [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

::: warning 警告
警告内容 [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

::: caution 错误
错误内容 [link](https://github.com/pengzhanbo) `inline code`

```js
const a = 1
const b = 2
const c = a + b
```

:::

::: important 重要
重要内容 [link](https://github.com/pengzhanbo) `inline code`

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

**代码演示：**

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

**选项卡：**

::: tabs
@tab 标题1
内容区块

@tab 标题2
内容区块
:::

:::: warning
::: tabs
@tab 标题1
内容区块

@tab 标题2
内容区块
:::
::::

**脚注：**

脚注 1 链接[^first]。

脚注 2 链接[^second]。

行内的脚注^[行内脚注文本] 定义。

重复的页脚定义[^second]。

[^first]: 脚注 **可以包含特殊标记**

    也可以由多个段落组成

[^second]: 脚注文字。
