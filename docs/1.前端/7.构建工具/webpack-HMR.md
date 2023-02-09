---
title: webpack模块热替换（HMR）
createTime: 2021/03/24 05:14:18
author: pengzhanbo
permalink: /article/knagbtgd/
---

**模块热替换（Hot Module Replacement）** 是 webpack 的一个 十分有用且强大的 特性。
当我们对 文件代码进行修改并保存后，webpack 会重新编译打包文件代码，并将新的模块代码发送给客户端，
浏览器通过将旧模块替换为新模块，实现在浏览器不刷新的情况下，对应用进行更新。

<!-- more -->

## 前言

在还没有 HMR 之前，我们对文件代码进行更新保存后，想要查看更新后的内容，常常需要手动刷新浏览器。

但还好的是，也有一些 **live reload** 的工具库，这些库能够监听文件的变化，通知浏览器刷新页面，
从而帮助我们减少了重复的操作。

但是为什么还需要 HMR 呢？ 

当浏览器刷新，也意味着当前页面的状态丢失了。
比如，我们打开了一个弹窗，然后我们对弹窗的代码逻辑进行了修改并保存，浏览器刷新后，弹窗被关闭了，
我们需要重新进行交互打开弹窗。
这无疑会增加非常多的重复且无意义工作量、时间。

HMR 的作用，就是不仅帮助我们在无刷新的情况下更新了应用代码，同时还保留了应用的状态，让我们能避免了
大量重复操作，从而提高开发效率。

## 模块热替换

模块热替换(HMR - Hot Module Replacement)功能会在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。

### 启用
启用 HMR 的方式很简单，[查看官方文档](https://www.webpackjs.com/guides/hot-module-replacement/)

### 特性

HMR有几个特性：

- 保留在完全重新加载页面时丢失的应用程序状态。
- 只更新变更内容，以节省宝贵的开发时间。
- 调整样式更加快速 - 几乎相当于在浏览器调试器中更改样式。


## HMR基本流程

- **Step 1:**
  
  webpack watch 模式下，监听文件系统中的某个文件是否发生修改。当监听到文件发生变更时，
  根据配置文件**对模块进行重新编译打包**，并将打包后的代码 通过 JavaScript 对象保存在内存中。

- **Step 2:**
  
  webpack-dev-middleware 调用 webpack 的API 对代码的变化进行监控，并通知webpack，将代码打包到内存中。
  
- **Step 3:**

  webpack-dev-server 监听文件变化，不同于第一步的是，这一步不监听代码变化进行重新编译打包。
  当配置文件中配置了 `devServer.watchContentBase` 为 `true` 时，
  Server会监听配置的文件夹中静态文件的变化，如果发生变化，通知浏览器进行 `live reload`,即刷新页面。

- **Step 4:**

  webpack-dev-server 通过 sockjs 在浏览器和服务器端之间建立一个 websocket 长连接，
  将webpack编译打包的各个阶段的状态信息告知浏览器端，也包括第三步中 Server 监听静态文件变化的信息。
  浏览器端根据这些socket消息进行不同的操作。
  其中，服务器传递的最主要的信息，是新模块的 hash 值，后续步骤根据 hash值 进行模块的替换。

- **Step 5:**

  webpack-dev-server 虽然会告知浏览器打包状态，但在 webpack-dev-server/client 端并不会去请求更新的代码，
  也不会执行热模块替换的操作，这些工作会交回给 webpack/hot/dev-server。
  webpack/hot/dev-server 根据 webpack-dev-server/client 传给它的信息，以及 dev-server 的配置信息，
  来决定是刷新浏览器，还是执行 热模块替换。

- **Step 6:**

  在客户端中，HotModuleReplacement.runtime 接受到 上一步传递给它的新模块的 hash 值，
  通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，server 端返回一个 json。
  该 json 包含了所有要更新的模块的 hash 值，获取到需要更新的模块列表后，再发送一个 jsonp 请求，
  获取最新的模块代码。

- **Step 7:**

  HotModulePlugin 会对新旧模块进行对比，决定是否更新模块。
  在决定更新模块后，检查模块之间的依赖关系，更新模块的同时，也更新模块间的依赖引用。
  这个步骤也决定了 HMR 是否成功。

- **Step 8:**

  如果 HMR 失败，则回退到 live reload 操作，通过刷新浏览器来获取最新打包的代码。

