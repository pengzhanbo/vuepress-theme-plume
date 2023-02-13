---
title: webpack原理的简单入门
createTime: 2021/03/21 06:13:07
author: pengzhanbo
permalink: /article/gq88mn6a/
---

::: center
![webpack](https://www.webpackjs.com/32dc115fbfd1340f919f0234725c6fb4.png){width="100px"}
:::

## 前言

我们知道， `webpack` 作为前端工程化中，主流的模块打包工具之一，应用于各种各样的前端工程化项目中。

虽然大多数项目都或多或少会使用到 `webpack`， 但是可能对于大多数的 前端开发人员来说，
可能只是改改 `webpack` 的配置， 或者甚至从未动过 `webpack` 的相关文件,
或多或少对 `webpack` 的配置以及功能感到陌生。

还有类似于 `vue-cli`、`create-react-app` 、 `umi.js` 等各种基于 `webpack` 封装的 脚手架，
提供了各种开箱即用的功能，这使得 `webpack` 离我们好像越来越远。

但是当我们的某个项目面临了不得不去 深入 `webpack` 才能解决的问题，或者 面试时，被问起 `webpack` 相关的问题，
就难以解决或者回答。

所以我们需要对 `webpack` 至少有基本的了解，了解它的原理、如何编写 `loader` 、 `plugin` 等。

## webpack是什么

> 引用 [webpack官网](https://webpack.js.org/concepts/) ：
>
> At its core, webpack is a static module bundler for modern JavaScript applications. When webpack processes your application, it internally builds a dependency graph from one or more entry points and then combines every module your project needs into one or more bundles, which are static assets to serve your content from.
> 
> 本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

从作用上讲，webpack 的功能就是将不同模块的文件，打包整合到一起，并且保证它们之间引用的正确，且有序执行。
这使得我们在做项目架构时，能够从模块的角度去做文件拆分，然后交给 webpack 打包整合。

而一个项目中的文件，不仅有 html文件、CSS文件、JavaScript文件、图片资源、Vue特有的`.vue`文件，typescript的`.ts` 文件等，以及项目的中的代码还需要进行压缩混淆、浏览器兼容、等等必要的处理，启动一个本地的开发服务器、模块的热更新替换等， 可以通过`webpack` 提供的各种机制，来一一实现。

对于 `webpack` 来说， 它自身只能识别 JavaScript 文件， 而对于其他的资源，可以通过 webpack提供的 `Loader` 特性来实现
识别。 通过 `Loader`，可以把其它类型的资源文件，转换为 webpack能够处理的有效模块。

而对于 代码混淆、本地开发服务器、模块热更新，则可以通过 webpack 提供的 `Plugin` 特性来实现功能上的扩展。

## 模块打包原理

在 webpack 中，有四个基础且核心的概念：

- **入口（entry）**
- **输出（output）**
- **加载器（Loader）**
- **插件（Plugin）**

### 入口（entry）
  
  指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。

### 输出(output)
  
  告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件

### 加载器（Loader）
  
  webpack 自身只能理解 JavaScript 文件 和 json 文件， loader 可以将其他类型的资源文件转换为 webpack能够处理的有效模块。

  本质上，webpack loader 将所有类型的文件，转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

### 插件（Plugin）

  用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。
  插件接口功能极其强大，可以用来处理各种各样的任务。


### 模块（modules）

在模块化编程中，开发者将程序分解成离散功能块(discrete chunks of functionality)，并称之为模块。

对于 webpack ，任何文件都可以是一个模块。

### 模块打包运行原理

在说 webpack 的 **模块打包运行原理** 之前， 先看下 我们是如何使用 webpack的，
一般情况下， 我们通过编写一个 配置文件`webpack.config.js`， 对 webpack 进行本地化的配置，
大致的配置如下：
``` js
module.exports = {
  // 声明模块的入口文件
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js', // 文件名称
  },
  module: {
    rules: [
      // 配置 使用 babel-loader 对 .js 资源进行转换
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      // ...more loader
    ],
  },
  // 插件配置
  plugins: [
    new EslintWebpackPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // ...more plugin
  ],
  // ...more config
}
```

`webpack` 读取了 配置文件后，运行的流程大致如下：

1. 读取 `webpack` 的配置参数；
2. 启动 `webpack` , 创建 `compiler` 对象，开始解析项目；
3. 从入口文件 `entry` 开始解析，并找到其导入的**依赖模块**，递归遍历分析，形成**依赖关系树**；
4. 对不同的文件类型资源的依赖模块文件，使用对应的 `Loader` 进行转换，最终转为 webpack的有效模块；
5. 在编译过程中， `webpack` 通过 发布订阅模式，向外抛出一些 `hooks` ，`webpack` 的 `Plugin` 通过监听各个 `hooks` ，
   执行插件任务，扩展 `webpack` 的功能，干预输出结果。
6. 根据 输出配置 `output` ，将打包构建好的资源文件 输出。

`compiler` 对象是一个全局单例，负责控制整个 webpack 构建流程。

在构建过程中，还会产生一个当前构建的上下文对象 `compilation`, 它包含了当前构建的所有信息，在每个热更新或重新构建时， `compiler` 都会产生一个新的`compilation` 对象，负责当前构建过程。

每个模块间的依赖关系，则依赖于`AST`语法树。每个模块文件在通过`Loader`解析完成之后，
会通过`acorn`库生成模块代码的`AST`语法树，通过语法树就可以分析这个模块是否还有依赖的模块，
进而继续循环执行下一个模块的编译解析。

最终， webpack 打包构建出来的 bundle 文件，是一个 IIFE 执行函数。

```js
// webpack5下进行的最小化打包输出文件
(() => { 
  // webpack 模块文件内容
  var __webpack_modules__ = ({
    "entry.js": ((modules) => { /* ... */ }),
    "other.js": ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => { /* ... */ })
  });

  // 模块缓存
  var __webpack_module_cache__ = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // Create a new module (and put it into the cache)
    var module = __webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {}
    };

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  // startup
  // Load entry module and return exports
  // This entry module can't be inlined because the eval devtool is used.
  var __webpack_exports__ = __webpack_require__("entry.js");
    
})();
```
在上面的打包demo中，整个立即执行函数里边只有三个变量和一个函数方法，`__webpack_modules__`存放了编译后的各个文件模块的JS内容，`__webpack_module_cache__` 用来做模块缓存，`__webpack_require__` 是Webpack内部实现的一套依赖引入函数。最后一句则是代码运行的起点，从入口文件开始，启动整个项目。

`__webpack_require__`模块引入函数，我们在模块化开发的时候，通常会使用`ES Module`或者`CommonJS`规范导出/引入依赖模块，webpack打包编译的时候，会统一替换成自己的`__webpack_require__`来实现模块的引入和导出，从而实现模块缓存机制，以及抹平不同模块规范之间的一些差异性。
