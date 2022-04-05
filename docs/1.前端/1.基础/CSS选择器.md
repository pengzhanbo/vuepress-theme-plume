---
title: CSS选择器
createTime: 2018/09/20 03:29:20
permalink: /article/8vev8ixl
author: pengzhanbo
tags: 
  - css
top: false
type: null
---

## Basic Selectors 基础选择器

### Element selector
根据 element type 匹配 一组元素
``` html
...
  <style>
    p { color: red; }
  </style>
...
  <p>content</p>
...
```

### Class selector
根据 element 声明的 class属性值 匹配一组元素
``` html
...
  <style>
    .red { color: red; }
  </style>
...
  <p class="red">content</p>
...
```

### ID selector
根据 element 声明的 ID属性值，匹配一个元素（一个页面中，ID具有唯一性）
``` html
...
  <style>
    #red { color: red; }
  </style>
...
  <p id="red">content</p>
...
```

### Universal selector
通配符，匹配所有 element
``` html
...
  <style>
    * { color: red; }
  </style>
...
  <p>content</p>
  <span>span</span>
...
```

## Attribute Selectors

### \[attribute\] selector
匹配声明了该attribute的 一组 element
``` html
...
  <style>
    [href] { color: red; }
  </style>
...
  <a href="">content</a>
...
```

### \[attribute="x"\] selector
匹配声明了该attribute，且值为 x 的一组 element
``` html
...
  <style>
    [title="a"] { color: red; }
  </style>
...
  <abbr title="a">abbr</abbr>
...
```

### \[attribute~="x"\] selector
匹配声明了该attribute，且值包含了 单词 x 的一组 element
``` html
...
  <style>
    [title~="style"] { color: red; } /* 匹配包含了 独立单词  style 的 element， */
  </style>
...
  <abbr title="sheet style">abbr</abbr>
  <abbr title="sheetstyle"></abbr> <!-- no match -->
...
```

### \[attribute|="x"\] selector
匹配声明了该attribute，且值包含了一个 `x-` 开头的连字符拼接的词 的一组 element
``` html
...
  <style>
    /* lang的值必须 包含 en 通过连接符 - 连接另一个单词的 词 */
    [lang|="en"] { color: red; }
  </style>
...
  <abbr lang="en-US">abbr</abbr>
  <!-- no match  lang="en" lang="enUS" -->
...
```

### \[attribute^="x"\] selector
匹配声明了该attribute，且值是以 x 作为开头的 一组 element
``` html
...
  <style>
    [href^="https://"] { color: red; }
  </style>
...
  <a href="https://example.com">content</a>
...
```

### \[attribute$="x"\] selector
匹配声明了该attribute，且值是以 x 作为结尾的 一组 element

``` html
...
  <style>
    [href$=".pdf"] { color: red; }
  </style>
...
  <a href="https://example.com/a.pdf">content</a>
...
```

### \[attribute*="x"\] selector
匹配声明了该attribute，且值包含了子串 x 的 一组 element

``` html
...
  <style>
    [href*="example"] { color: red; }
  </style>
...
  <a href="https://example.com">content</a>
...
```

## Combinators 关系选择器

关系选择器适用于 任意选择器 的组合

### selector1 selector2 后代关系选择器
匹配 selector1 的元素中，所有 selector2 的 元素
``` html
...
  <style>
    section span { color: red; }
  </style>
...
  <section>
    <span></span> <!-- match -->
    <p><span></span></p>  <!-- match -->
  </section>
...
```

### selector1 > selector2 子代关系选择器
匹配 selector1 的下一级满足 selector2 的 一组元素
``` html
...
  <style>
    section > span { color: red; }
  </style>
...
  <section>
    <span></span> <!-- match -->
    <p><span></span></p>  <!--  no match -->
  </section>
...
```

### selector1 + selector2 相邻兄弟选择器
匹配selector1后同级的紧跟的selector2的一个元素
``` html
...
  <style>
    h2 + p { color: red; }
  </style>
...
  <p></p> <!--  no match -->
  <h2></h2>
  <p></p> <!-- match -->
  <p></p> <!--  no match -->
...
```

### selector ~ selector2 一般兄弟选择器
匹配selector1后同级的selector2的一组元素
``` html
...
  <style>
    h2 ~ p { color: red; }
  </style>
...
  <p></p> <!--  no match -->
  <h2></h2>
  <p></p> <!-- match -->
  <p></p> <!-- match -->
  <span></span>
  <p></p> <!-- match -->
...
```

## Group Selectors 组合选择器

### selector1, selector2, ...
匹配用`,` 隔开的所有选择器
``` html
...
  <style>
    p, span { color: red; }
  </style>
...
  <section>
    <span></span>
    <p><span></span></p>  
  </section>
...
```

## Pseudo-elements 伪元素选择器

### ::first-letter
匹配 element中的首个字符（字母、中文字、符号均可）
``` html
...
  <style>
    p::first-letter { color: red; }
  </style>
...
  <p>One</p>  <!-- match: O -->
...
```

### ::first-line
匹配 element中的首行文字
``` html
...
  <style>
    p::first-line { color: red; }
  </style>
...
  <p>
    One Two  <br> <!-- match -->
    Three
  </p>
...
```

### ::before
和 `content` 属性一起使用，在匹配的元素内容之前生成的内容

``` html
...
  <style>
    p::before { content: 'before ' }
  </style>
...
  <p>
    One Two   <!-- render: before One Two -->
  </p>
...
```

### ::after
和 `content` 属性一起使用，在匹配的元素内容之后生成的内容

``` html
...
  <style>
    p::after { content: ' after' }
  </style>
...
  <p>
    One Two   <!-- render: One Two after -->
  </p>
...
```
 
## Pseudo-classes 伪类选择器

### :link
匹配一个没有被访问过的链接
``` html
...
  <style>
    a:link { color: red }
  </style>
...
  <a href="">link</a>
...
```

### :visited
匹配一个已访问过的链接
``` html
...
  <style>
    a:visited { color: red }
  </style>
...
  <a href="">link</a>
...
```
### :active
匹配一个正在被激活的链接
``` html
...
  <style>
    a:active { color: red }
  </style>
...
  <a href="">link</a>
...
```

### :hover
匹配一个被光标悬停的链接
``` html
...
  <style>
    a:hover { color: red }
  </style>
...
  <a href="">link</a>
...
```
### :focus
匹配一个具有焦点的元素
``` html
...
  <style>
    input:focus { color: red }
  </style>
...
 <input type="text">
...
```
### :target
匹配一个已被链接到的元素。
例如通过`<a href="#heading"></a>`链接的head元素
``` html
...
  <style>
    h2:target { color: red }
  </style>
...
 <h2 id="heading">heading</h2>
...
```
### :first-child
匹配在同一个父元素内的的第一个子元素
``` html
...
  <style>
    p:first-child { color: red }
  </style>
...
  <p>first child</p> <!-- match -->
  <p>second child</p>
...
```
### :last-child
匹配在同一个父元素内的的最后一个子元素
``` html
...
  <style>
    p:last-child { color: red }
  </style>
...
  <p>first child</p>
  <p>last child</p> <!-- match -->
...
```
### :nth-child(n)
匹配在同一个父元素内的从上往下数的第N子个元素
``` html
...
  <style>
    p:nth-child(2) { color: red }
  </style>
...
  <p>first child</p>
  <p>second child</p> <!-- match -->
...
```
### :nth-last-child(n)
匹配在同一个父元素内的从下往上数的第N个子元素
``` html
...
  <style>
    p:nth-last-child(2) { color: red }
  </style>
...
  <p>first child</p> <!-- match -->
  <p>second child</p> 
...
```
### :first-of-type
匹配在同一个父元素中的同类型的第一个元素
``` html
...
  <style>
    p:first-of-type { color: red }
  </style>
...
  <p>first child</p> <!-- match -->
  <p>second child</p>
...
```
### :last-of-type
匹配在同一个父元素中的同类型的最后一个元素
``` html
...
  <style>
    p:last-of-type { color: red }
  </style>
...
  <p>first child</p> <!-- match -->
  <p>second child</p>
...
```
### :nth-of-type(n)
匹配在同一个父元素中的同类型的从上往下数的第N个元素
``` html
...
  <style>
    p:nth-of-type(2) { color: red }
  </style>
...
  <p>first child</p>
  <p>second child</p>  <!-- match -->
...
```
### :nth-last-of-type(n)
匹配在同一个父元素中的同类型的从下往上数的第N个元素
``` html
...
  <style>
    p:nth-last-of-type(2) { color: red }
  </style>
...
  <p>first child</p> <!-- match -->
  <p>second child</p> 
...
```
### :only-child
如果元素是其父元素的唯一子元素，则匹配该元素
``` html
...
  <style>
    section p:only-child { color: red }
  </style>
...
  <section>
    <p> only child </p>
  </section>
...
```
### :only-type
如果元素是其父元素的唯一的同类型的子元素，则匹配该元素
``` html
...
  <style>
    section p:only-of-type { color: red }
  </style>
...
  <section>
    <p> only </p> <!-- match -->
    <span></span>
  </section>
...
```
### :lang(lang)
匹配给定语言的元素
``` html
...
  <style>
    div:lang(fr) { color: red }
  </style>
...
  <section>
    <div lang="fr"><q>This French quote has a <q>nested</q> quote inside.</q></div>
  </section>
...
```
### :empty
匹配没有子元素或内容的元素
``` html
...
  <style>
    div:empty { background-color: red }
  </style>
...
  <section>
    <div></div>
  </section>
...
```
### :root
匹配文档的根元素， （即匹配的 `<html>`元素）
### :enabled
匹配未被禁用的表单控件元素
### :disabled
匹配被禁用的表单控件元素
### :checked
匹配选中的单选或复选框类型的输入元素。
### :not(selector)
协商伪类。匹配不匹配选择器的元素。

## 实验中的 Selectors

这些选择器在某些浏览器中尚处于开发中，功能对应的标准文档可能被修改，在未来的版本中可能发生变化，谨慎使用。

### :any-link
匹配有链接锚点的元素，而不管元素是否被访问过。
即会匹配每一个有 `href`属性的`<a>`，`<area>`，`<link>`的元素，匹配到所有的`:link`或`:visited`。
``` html
...
  <style>
    a:any-link {
      border: 1px solid blue;
      color: orange;
    }
  </style>
...
  <a href="https://example.com">External link</a><br>
  <a href="#">Internal target link</a><br>
  <a>Placeholder link (won't get styled)</a>
...
```
::: caniuse css-any-link
:::

### :dir(dir)
如果元素的内容的书写方向是 dir , 则匹配该元素

*dir* : ltr | rtl

``` html
...
  <style>
    :dir(ltr) {
      background-color: yellow;
    }

    :dir(rtl) {
      background-color: powderblue;
    }
  </style>
...
  <div dir="rtl">
    <span>test1</span>
    <div dir="ltr">test2
      <div dir="auto">עִבְרִית</div>
    </div>
  </div>
...
```
::: caniuse css-dir-pseudo
:::

### :has(selector)
如果一个元素A恰好满足包含了selector 匹配的元素，则匹配元素A
``` html
...
  <style>
    a:has(> img) {
      background-color: yellow;
    }
  </style>
...
  <a><img src="example.jpg"></a> <!-- match -->
  <a></a>
...
```
::: caniuse css-has
:::

### :is()  / :any()
匹配一组选择器选中的元素。

优先级是由它的选择器列表中优先级最高的选择器决定。

``` html
...
  <style>
    :is(header, main, footer) p:hover {
      color: red;
      cursor: pointer;
    }
  </style>
...
  <!-- 等价于 -->
  <style>
    header p:hover,
    main p:hover,
    footer p:hover {
      color: red;
      cursor: pointer;
    }
  </style>
...
```
::: caniuse css-matches-pseudo
:::

### :where()
匹配一组选择器选中的元素。

:where() 的优先级总是为 0。
``` html
...
  <style>
    :where(header, main, footer) p:hover {
      color: red;
      cursor: pointer;
    }
  </style>
...
  <!-- 等价于, 但优先级不同 -->
  <style>
    header p:hover,
    main p:hover,
    footer p:hover {
      color: red;
      cursor: pointer;
    }
  </style>
...
```