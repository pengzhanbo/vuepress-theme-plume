---
title: WebComponent——template
lang: zh-CN
tags: 
  - WebComponent
  - javascript
createTime: 2018/8/2 11:15:27
permalink: /article/5fmy4kla/
author: pengzhanbo
---

在web开发领域中，模板并不少见。从服务器端的模板语言，如`Django`、`jsp`等，应用十分广泛，存在了很长时间。又如前端，早期例如`art(artTemplate)`，以及近年来，大多数的MV*框架涌现，绝大多数在展现层使用了同样的渲染机制：模板。

<!-- more -->

> __定义__   
>模板，一个拥有预制格式的文档或者文件，可作为特定应用的出发点，这样就避免在每次使用格式的时候都重复创建。

从模板的定义中，我们可以发现，“避免在每次使用格式的时候重复创建”，从这句话来看，模板可以让我们避免重复的工作。那么，web平台有没有提供原生支持呢？

答案是，有，在 [WhatWG HTML 模板规范](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)中，它定义了一个新的`<template>` 元素，用于描述一个标准的以DOM为基础的方案来实现客户端模板。该模板允许你定义一段可以被转为 HTML 的标记，在页面加载时不生效，但可以在后续进行动态实例化。

### 声明

跟普通的html标签一样，`template`标签包含的内容，即是声明的模板内容。
``` html
<template>
    <img src="" />
    <p>content</p>
</template>
```
“模板内容”本质上，是 __一大块的惰性可复制DOM__。在这个例子中，标签内的元素并不会被渲染，图片资源也不会发出请求。模板可以理解为单个零件，在整个应用的生命周期中，你都可以使用、以及重用它。

### 特性

使用`<template>`标签包裹我们的内容，可以为我们提供一下几个重要的特性。
1. __它的内容在激活前都是惰性的。__ template标签默认是隐藏的，它的内容也是不可见的，同时也不会被渲染。
2. __处于模板中的内容不会产生副作用。__ 放在模板中的脚本、音频、视频、图片资源不会被加载，不会被播放，直到模板中的内容被使用。
3. __内容不在文档中。__ 在主页面使用`document.getElementById()`，不会返回模板子节点。
4. __模板能够放置在任何位置。__ 你可以把`<template>` 放置在`<head>`、`<body>`、`<frameset>`，并且任何能够出现在以上元素的内容，都可以放置在模板中。__“任何位置”__ 意味着`<template>`标签可以出现在HTML解析器不允许出现的位置 _(必须是在`<html>`标签内)_，几乎可以作为任何元素的子节点。它也可以作为`<table>`、`<select>`的子节点。当然，如果写在声明`type="text/javascript"`的`<script>`标签中，绝对报错，原因我就不说了。（同时实测发现，如果`<template>`标签放在`<head>`、`<body>`同级，放在`<body>`前面，都会被解析到`<head>`标签内，放在`<body>`后，会被解析到`<body>`内）。
    ``` html
    <table>
        <tr>
            <templete>
                <td>content</td>
            </templete>
        </tr>
    </table>
    ```

### 使用模板

想要使用模板，首先需要激活模板，否则它的内容将无法被渲染。模板对象包含了一个`content`属性，该属性是只读属性，关联一个包含模板内容的`DocumentFragment`，
我们可以使用`document.importNode()`对模板的`.content`进行深拷贝。
``` html
<template id="template1">
    <img src="" />
    <p>content</p>
</template>
```
``` javascript
var tmp = document.querySelector('#template1');
// 可以在获取模板的时候，对内容进行填充
tmp.content.querySelector('img').scr = 'logo.png';
var clone = document.importNode(tmp.content, true);
document.body.appendChild(clone);
```
模板中的资源，比如图片资源，只有被激活后，才会发出请求。

### 浏览器支持

想要检测浏览器是否支持该标签，需要创建一个template元素，并检查它是否拥有`.content`属性。
``` javascript
function supportTemplate() {
    return 'content' in document.createElement('template');
}
if (supportsTemplate()) {
    // 浏览器支持 template 元素
} else {
    // 浏览器不支持template元素
}
```

从目前来看，IE13+开始支持，低于此版本的IE均无法使用，如果有项目只需要考虑 webkit内核的浏览器，template标签还是可以一用。

::: caniuse mdn-html__elements__template
:::

如果浏览器不支持template标签，那么就会认为是一个普通的自定义元素，内部的标签会被作为一般的标签被渲染。

### 模板标准之路

HTML 模板标准化进程耗时十分长久。从过去到现在，出现了很多各种各样的方法去创建可重用的模板。

__方法一：使用隐藏的DOM元素，将模板内容放在某个标签内，使用`display:none`隐藏元素。__
``` html
<div style="display:none">
    <img src="" />
</div>
```
使用这种方式，有利有弊：
1. √ 使用DOM，浏览器能够很好的处理DOM结构，我们可以方便的复制、使用DOM。
2. √ 没有内容渲染，`display: none` 阻止了内容渲染。
3. × 非惰性， 图片资源依然会发出请求。
4. x 难以设置样式和主题，需要为所有CSS增加规则。

__方法二：使用textarea 标签，并使用`display:none`隐藏元素。__
``` html
<textarea style="display:none">
    <img src="" />
</textarea>
```
这种方法是对方法一的一种改进，但也有新的利弊：
1. √ 没有内容渲染，`display: none` 阻止了内容渲染。
2. √ 惰性，由于模板内容是字符串，图片资源不会发出请求。
3. x 模板内容是字符串，需要进一步将其转为DOM。

__方法三： 重载脚本__
``` html
<script type="text/x-handlebars-template">
    <img src="" />
</script>
```
利弊：
1. √ 没有内容渲染，script 标签默认`display:none`。
2. √ 惰性，脚本类型不为 `text/javascript`，浏览器不会认为是脚本，不会将其作为JS解析。
3. x 安全问题，由于使用 `innerHTML`获取内容，对用户提供的字符串进行运行时解析，很容易倒是 XSS漏洞。

### 总结

模板标准化，使得我们在做web开发整个过程更加健全，更容易维护。
