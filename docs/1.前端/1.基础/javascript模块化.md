---
title: javascript模块化 发展历程
createTime: 2022/04/10 03:00:41
author: pengzhanbo
permalink: /article/javascript-modules/
---

javascript模块化的发展，距今已有10个年头左右。

## 无模块化

在早期，javascript作为一门脚本语言，仅为协助表单校验等界面辅助增强，那时候的前端也比较简单， javascript不需要模块化。

## 命名空间

后来随着 javascript 需要承担更多的功能，代码量开始上升，为了避免全局命名冲突等问题，提出了使用命名空间的方案，将符合某种规则或者约定的代码，放到同一个命名空间下。 这算是 javascript模块化最早期的雏形。

``` js
YAHOO.util.Event.stopPropagation(e);
```

## 基本的模块化

在这个时期，出现了比较清晰的模块定义，通过闭包来做模块运行空间
``` js
// 定义模块
YUI.add('hello', function(Y) {
    Y.sayHello = function() {
        Y.DOM.set(el, 'innerHTML', 'hello!');
    }
}, '1.0.0', 
    requires: ['dom']);

...
// 使用模块
YUI().use('hello', function(Y) {
  Y.sayHello('entry'); // <div id="entry">hello!</div>
})
```

## CommonJs

CommonJs 其实是一个项目，其目标是为 JavaScript 在网页浏览器之外创建模块约定， 在当年 javascript 的模块化思想还在官方的讨论中， 缺乏普遍可接受形式的javascript脚本模块单元。

CommonJs规范和当时出现的NodeJs相得益彰，共同走入了开发者的实现。

但 CommonJs 其实是面向网页浏览器之外的（如NodeJs，即面向服务端的模块化规范），并不适用于浏览器端。

### CommonJs 规范简介

在CommonJs 规范中， 每个文件都是一个模块，有自己的作用域，在文件中定义的变量、函数、类等，都是私有的，对其他文件不可见。

在每个模块中，有两个内部变量可以使用， `require` 和 `module`

- `require` 用于加载某个模块。
- `module` 表示当前模块，是一个对象。这个对象中保存了当前模块的信息。`exports` 是 `module` 上的一个属性，保存了当前模块要导出的接口或者变量，使用 `require` 加载的某个模块获取到的值就是那个模块使用 `exports` 导出的值。

::: code-tabs

@tab a.js
``` js
var name = 'Mark';
var age = 18;

module.exports.name = name;
module.exports.getAge = function () {
  return age;
}
```

@tab:active b.js
``` js
var moduleA = require('./a.js')
console.log(moduleA.a); // Mark
// 使用了未导出的变量，获取不到值
console.log(moduleA.age) // undefined
console.log(moduleA.getAge()); // 18
```
:::


在NodeJs环境中，CommonJs的模块由于在服务器环境下，可以从本地进行加载，即 同步加载。

## AMD、CMD

::: note 注释
在我的印象中， CommonJs规范 和 AMD规范 出现的时间点 相差不远。

*AMD 早于 CommonJs*

按我个人理解，CMD 在当年算是从 AMD 衍生出来的一个方案。
:::
::: warning 注意
CommonJs 和 CMD 是两种方案！不是一样的！
:::

### AMD规范
AMD规范，即 异步模块定义([Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki/AMD))。

AMD 采用 __异步加载模块__ 的方式。

AMD规范仅定义了一个 `define` 函数，它是一个全局变量：
```
define(id?, dependencies?, factory);
```
- `id` 描述的是当前模块的标识符;
- `dependencies` 则是当前模块的依赖数组， 它们会在 factory工厂方法被调用前被加载并执行，
  并且执行的结果必须以依赖数组定义的顺序，依此顺序作为参数传入 factory工厂方法。
- `factory`为模块初始化要执行的函数或者对象。如果函数返回一个值，则该值应该设置为该模块的输出值。

### CMD规范

CMD规范，即 公共模块定义([Common Module Definition](https://github.com/cmdjs/specification/blob/master/draft/module.md))

CMD规范 定义了 一个 `define` 函数，它是一个全局变量：

```
define(id?, dependencies?, factory);
```

- `id` 描述的是当前模块的标识符;
- `dependencies` 是当前模块的依赖数组， 他们会在 factory 工厂方法被调用前完成加载，但并不立即执行。
- `factory`为模块初始化要执行的函数或者对象。
  - 如果是一个函数，则函数接受三个参数：
    ``` js
    define(function (require, exports, module))
    ```
    `require` 用于同步加载并执行已经定义好的其他模块；获取模块的输出值，
    `exports`是`module.exports`的别名，用于导出当前模块的输出值；`module`存储了当前模块的信息。
  - 如果是一个对象，则直接作为当前模块的输出值。

::: tip 两者的差异

AMD规范 和 CMD规范 从规范定义上来看，主要的差异为：

- AMD 的模块在加载后是立即执行的，并且会按照依赖顺序依次传入 factory，
  而 CMD的模块在加载后并不立即执行，而是在 factory方法中，通过 `require` 方法调用执行模块获取结果；
:::

### 规范的实现

- AMD流行的实现库是 [require.js](https://github.com/requirejs/requirejs);
- CMD流行的实现库是 [sea.js](https://github.com/seajs/seajs);

::: warning 提示
由于在当下已经越来越少会去选择使用 `require.js` 以及 `sea.js`， 这里就不多对这两个库做介绍说明。
:::

## NodeJs前端工具链

得益于 NodeJs 的能力，开源社区在模块化方面又再次向前继续迈进。 特别是在推出了 `NPM` 包管理工具后，前端的工具、模块化出现了井喷式发展。

### grunt gulp

既然 CommonJs 不适用于 浏览器端的一个主要原因是同步加载和异步加载之间的问题，那么借助于 `grunt` 或 `gulp` 提供的前端工具，在开发时，还是以文件一模块，然后构建时，将模块文件打包在一起，那么由于都是在同一个文件中，则模块之间的加载则可以是同步的。

在这个时期，`grunt`、`gulp` 并没有提供直接的模块化打包能力，但是在其基础上，通过插件实现了文件合并，从而能够在开发时，以 某种模块规范进行项目架构和管理，再进行打包构建。

### webpack NPM

真正让 前端模块化得到质的飞跃的，是 NPM的推出，内置到了 NodeJS 中。

而 webpack 的出现，这块 真正意义上的 模块打包工具，配合 NPM， 让模块化越来越得以更方便的运用于应用开发中。

webpack 作为一个 模块打包器， 在内部根据 CommonJs规范实现了 模块加载器，使得应用于浏览器端的javascript代码，也能够像 Node端的 javascript代码，拥有类似甚至相同的文件组织结构。

实现了一文件一模块，模块之间通过 `require` 函数进行 访问。

而 NPM的推出与流行，在前端引入了 `package` 包的概念，模块以包的形式进行管理， 让越来越多的开发者，能够共享各自开发的模块，开发者可以通过 NPM 安装其他开发者已开发好的模块，然后通过 `webpack` 实现开发时加载这些模块。

webpack 内部实现了 不同的 模块化规范，包括 匿名函数闭包`iife`, `AMD`, `CMD`,`CommonJs`等。

`webpack` 不仅将 javascript 作为模块，而是将一切资源都作为模块进行处理。

### 其他的模块打包工具

- [rollup](https://github.com/rollup/rollup) 轻量且快速的模块打包工具
- [parcel](https://github.com/parcel-bundler/parcel) 零配置的开箱即用的模块打包工具
- [vite](https://github.com/vitejs/vite) 基于rollup的前端工具
- more...

### 其他包管理工具

- [yarn](https://classic.yarnpkg.com/lang/en/)
- [pnpm](https://pnpm.io/)
- more...

::: info 说明
与`npm` 对比，都是社区对于 包管理 的不同理念、不同实践 下所产生的工具。
三者互相发展，并都有各自的特色。
:::

## ES Modules

[ES Modules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

随着 javascript的发展，ECMAScript将模块加载添加到了标准之中，浏览器也开始支持 模块加载。

使用 Javascript 模块依赖于 `import` 和 `export` 进行导入和导出。

在 `html` 导入 javascript模块脚本是，需要在 `<script>` 标签中添加 `type="module"` 的属性声明
``` html
<script type="module" src="/moduleA.js"></script>
```
::: code-tabs

@tab moduleA.js
``` js
import { name, getAge } from './moduleB.js';

console.log(name);
console.log(getAge());
```

@tab moduleB.js
``` js
export const name = 'Mark';

const age = 18;

export function getAge() {
  return age;
}
```
:::



## Deno模块加载

Deno与 Node在模块加载上最大的差别， 就是 放弃了 项目中的`node_modules` 作为第三方包的存放目录，也抛弃了 类似于 NPM 的中心化管理的 模块管理工具。

Deno 推荐使用的是 去中心化的模块加载管理，支持直接从远程的任意站点加载提供的模块。

如从 官方的 [deno.lang](https://deno.land/)，或者从 [unpkg.com](https://unpkg.com/) 加载第三方模块。

::: info 说明
这种去中心化模块管理的模块加载方案，相对来说会比较依赖于网络环境，虽然远程的模块首次加载后也会被缓存，但进行生产部署时，往往生产服务器跟公网是隔离的，在这种情况下，就需要自建一个内部服务器作为代理，托管第三方的模块包。
:::
