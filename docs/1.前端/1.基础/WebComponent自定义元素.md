---
title: WebComponent——custom elements
tags: 
  - html
  - javascript
createTime: 2018/08/01 11:15:27
permalink: /article/m63fd7lf
author: pengzhanbo
top: false
type: null
---


在我们的web应用开发中，HTML标签为我们提供了基础的应用和交互，我们使用HTML标签构建了各种各样丰富的web应用。

然而在我们开发web应用的过程中，html标签提供的语义化并不能完全满足我们的场景。虽然在HTML5标准中，也增加了不少包括`<header>`、`<section>`、`<article>`、`<nav>`、`<container>`、`<footer>`等语义化标签，但它们主要是为内容或布局添加的通用语义化标签，在实际的场景中，我们还需要使用 `class` 等一些属性或者辅助说明，声明该标签的具体语义。  

<!-- more -->

``` html
<div class="login-wrapper"></div>
```
如果可以这么做呢：
``` html
<login></login>
```
使用更加语义化的标签，满足我们各种场景，甚至是扩展已有标签的特性。那么我们该怎么做呢？

接下来是我们的主角： __[自定义元素（custom Elements）](http://w3c.github.io/webcomponents/spec/custom/)__

### 自定义元素

> 自定义元素能够帮助web开发者创建拥有自身特性的自定义标签。

### 创建自定义元素

_创建自定义元素有两种方式，这里只讨论 __DOM LEVEL 3__ 提供的 `customElements`，在 __DOM LEVEL 2__ 中的 `document.registerElement` 将作为补充内容在本文最后补充。_

[Custom Element API 规范](http://w3c.github.io/webcomponents/spec/custom/) 定义了`customElements`作为统一的对象管理自定义元素，并对ES6 class提供了更完善的支持。
>规范还定义了 `CustomElementRegistry`, 并且 `customElements instanceof CustomElementRegistry`。

我们可以通过 `customElements.define()` 方法来注册一个custom element，该方法接受以下参数：
`customElements.define(tarName, class[, option])`
- `tarName`: `DOMString`，用于表示所创建的元素名称。名称必须是小写字母开头，且必须包含至少一个`-`，任何不含`-`的自定义标签都会导致错误。例如`my-tag`,`my-list-item`为合法标签，`my_tag`,`myTag`都是非法的自定义标签名称；
- `class`: 类对象，用于定义元素行为.
- `option`: 包含 `extends` 属性的配置对象，可以指定所创建的元素继承自那个内置元素，可以继承任何内置元素；

`customElements`的类对象可以通过 ES 2015的类语法定义：
``` javascript
class MyTag extends HTMLElement {
    constructor() {
        super();
    }
}
customElements.define("my-tag", MyTag);
```

### 使用自定义元素的生命周期回调函数

在`customElements`的构造函数中，我们可以指定多个不同的回调函数，他们会在不同的声明周期被触发。

- `connectedCallback`: 元素首次插入到文档DOM时回调；
- `discannectedCallback`: 元素从文档DOM中删除时回调；
- `attributeChangedCallback`： 元素增加、删除、修改自身属性时回调；
- `adoptedCallback`：元素被移动到新的文档时回调；

``` javascript
class MyCustom extends HTMLElement {
    // 自定义元素开始提升时调用
    // 元素提升并不说明元素已插入到文档中
    // 在此阶段尽量避免进行DOM操作
    constructor() {
        super();
    }
    // 元素插入到文档时回调
    connectedCallback() {
        // do something...
    }
    // 元素从文档中删除时回调
    discannectedCallback() {
        // do something...
    }
    /*
     * 元素属性变化回调
     * @param name {string} 变化的属性名
     * @param oldValue {any} 变化前的值
     * @param newVlalue {any} 变化后的值
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // do something...
    }
    // 元素被移动到新的文档中时调用
    // （When it is adopted into a new document, its adoptedCallback is run.）
    // 具体场景示例：通过document.adoptNode方法修改元素ownerDocument属性时可以触发
    adoptedCallback() {
        // do something...
    }
}
```

如果需要在元素属性发生变化后触发 `attributeChangedCallback`，就必须监听这些属性。 我们可以通过定义静态属性`observedAttributed`的 get函数来添加需要监听的属性：
``` javascript
static get observedAttributed() {
    return ['name'];
}
```

### 使用自定义元素

我们可以在文档的任何地方使用`customElements.define`注册的自定义元素，即使是在自定义元素注册之前。
``` html
<my-tag></my-tag>
```
或者：
``` js
class MyTag extends HTMLElement {
    constructor() {
        super();
    }
}
customElements.define("my-tag", MyTag);

// 方式一：
var tag = document.createElement('my-tag');
document.appendChild(tag);
// 方式二：
var tag = new MyTag();
document.appendChild(tag);
```

### 元素提升

浏览器是如何解析非标准的标签的？为什么对非标准的标签，浏览器不会报错？

> HTML规范：  
> 非规范定义的元素必须使用 _HTMLUnknownElement_ 接口。

我们在页面中声明一个 `<myTag>`标签，由于它是非标准标签，所以会继承 `HTMLUnknownElement`。

对于自定义元素，情况有所不同。 拥有合法元素名称的自定义元素继承自`HTMLElement`。   
对于不支持自定义元素的浏览器，拥有合法元素名称的标签，仍然继承`HTMLUnknownElement`。

### 扩展内置元素特性

在创建自定义元素时，置顶所需的扩展的元素，使用时，在内置元素上声明`is`属性指定自定义元素名称：
``` js
class CustomButton extends HTMLButtonElement {
    constructor() {
        super();
    }
}
customElements.define("custom-button", CustomButton, {
    extends: 'button'
});
```
``` html
<button is="custom-button"></button>
```

### 自定义元素样式

自定义元素和内置元素一样，可以使用CSS各类选择器定义样式。

自定义元素规范还提出了一个新的CSS伪类`:unresolved`。在浏览器调用你的`createdCallback()` 之前，这个伪类可以匹配到未完成元素提升的自定义元素。
``` css
custom-button{
    opacity: 1;
    transition: opacity 300ms;
}
custom-button:unresolved{
    opacity: 0
}
```
> :unresolved 不能用于继承自HTMLUnkownElement的元素。


### 浏览器支持

`Chrome`和`Opera`默认支持custom elements。`Firefox`计划在60/61的版本中默认支持自定义元素。`Safair`目前不支持自定义元素对内置元素的扩展。`Edge`在实现中。


### 补充内容：`document.registerElement`

使用`document.registerElement()` 创建自定义元素
``` javascript
var MyTag = document.registerElement('my-tag');
```
添加自定义元素特性：
``` javascript
var proto = Object.create(HTMLElement.prototype);
proto.hello = 'hello';
proto.sayHello = function () {
    alert(this.hello);
};
var MyTag = document.registerElement('my-tag', {
    prototype: proto
});
```
扩展原生元素特性

`document.registerElement()` 的第二个参数还允许我们为扩展原生素的特性。

``` javascript
var MyButton = document.registerElement('my-button', {
    extend: 'button',
    prototpye: Object.create(HTMLButtonElement.prototype)
});
```
``` html
<button is="my-button"><button>
```
生命周期以及回调方法

1. createdCallback(): 元素创建后回调。
2. attachCallback(): 元素附加到文档后调用。
3. detachCallback(): 元素从文档移除后调用。
4. attributeChangedCallback(): 元素任意属性变化后调用。
``` javascript
var myTagProto = Object.create(HTMLElement.prototype);

myTagProto.createdCallback = function() {
    // 元素创建后回调。
    this.textContent = '我被创建了';
};

var MyTag = document.registerElement('my-tag', {
    prototype: myTagProto
});
```

### 结语

自定义元素作为 `webComponent` 规范中的一部分，为web应用开发提供了更多的可能性，配合`webComponent` 规范的其他内容，可以为web开发者提供更强大的能力。
