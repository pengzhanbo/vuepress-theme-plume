---
title: 单仓库实现同时导出esm、cjs
createTime: 2022/04/06 08:33:04
author: pengzhanbo
permalink: /article/exports-esm-and-cjs/
---

在开发一些公共模块作为一个独立仓库时，有时候可能会在一个使用 es 的项目中通过 `import` 导入，
有可能在一个 cjs 项目中通过 `require` 导入。

如何实现单个仓库能够同时被 cjs 和 esm 项目导入呢？

<!-- more -->

## 为什么这么做？

在过去的时间里，JavaScript 并没有一套标准的模块化系统，并且在过去的时间里，逐渐发展出了各种模块化解决方案，
其中最主流的有两种模块化方案：

- `CommonJs`： 即`cjs`,通过 `require('package')` 导出，`module.exports` 导入。
  这套模块化系统应用与在`NodeJs` 和 `NPM packages`。

  ```js
  // in cjs
  const _ = require('lodash')
  console.log(`assignIn: ` _.assignIn({ b: '2'}, { a: '1' }))
  // { a: '1', b: '2' }
  ```

- `Ecmascript modules`: 即`esm`，在2015年，`esm` 最终确定为标准模块化系统，浏览器以及各个社区开始逐渐
  迁移并支持`esm`。

  ```js
  import { assignIn } from 'lodash'
  console.log(`assignIn: ` assignIn({ b: '2'}, { a: '1' }))
  // { a: '1', b: '2' }
  ```

  `ESM`使用 `named exports`，能够更好的支持静态分析，对各种打包工具有利于做`tree-shaking`，
  而且浏览器原生支持，作为一个标准，代表的是JavaScript的未来。

  同时，在`NodeJs` 的 `v12.22.0`、`v14.17.0`版本，开始实验性的支持`ESM`，并在`16.0.0`版本开始正式支持`ESM`。


::: note
- ESM - [ECMAScrip modules](https://nodejs.org/api/esm.html)
- CJS - [CommonJs](https://nodejs.org/api/modules.html#modules-commonjs-modules)
:::

目前有很多包仅支持 `CJS` 或者 `ESM`  格式。 但同时，也有越来越多的包推荐并仅支持导出 `ESM` 格式。

但是相对来说，就目前而言，作为一个库，仅支持`ESM` 格式还是过于激进了。即使在 `NodeJs v16`已开始正式支持`ESM`，
但是整个社区的迁移还是需要大量的时间成本和人力成本的，如果某个版本破坏性的从`CJS`支持迁移到`ESM`，
那么可能导致一系列问题。

所以，如果一个库，能够同时支持`ESM`以及`CJS`，是一种相对来说更为安全的迁移方案。

## 共存问题

我们知道，`Nodejs` 能够很好的同时支持 `ESM` 和 `CJS` 进行工作，但是，有一个最主要的问题是，不能在一个 `CJS` 中
导入`ESM`，这时候会抛出一个错误：
```js
// cjs package
const pkg = require('esm-only-package')
```
```
Error [ERR_REQUIRE_ESM]: require() of ES Module esm-only-package not supported.
```

因为`ESM` 模块本质上是一个异步模块，所以不能用 `require()` 方法同步的导入一个异步的模块。
但是这并不意味着完全不能在 `CJS` 模块中使用`ESM` 模块，我们可以使用 动态 `import()` 的方式，来异步的导入`ESM` 模块。
`import()` 会返回一个 `Promise`：

```js
// CJS
const { default: pkg } = await import ('esm-only-package')
```

但是，这并不是一个令人满意的解决方案，它与我们日常使用的模块导入方式来说，显得有点笨拙，不符合一般使用习惯，
我们还是更期望能够符合一般习惯的导入方式：

```js
// ESM
import { named } from 'esm-package'
import cjs from 'cjs-package' 
```

## 如何做？

### package.json

在现在的稳定版本的`NodeJs` 中，已经支持同时在一个包中导出两种不同的格式。
在`package.json` 文件中，有一个`exports` 字段，提供给我们有条件的导出不同格式。

``` js
{
  "name": "package",
  "exports": {
    ".": {
      "require": "./index.js",
      "import": "./index.mjs"
    }
  }
} 
```

这一段声明描述了， 当进行导入包的默认模块时，如果是通过 `require('package')` 进行导入，那么引入的是 `./index.js` 文件，如果是通过`import pkg from 'package'`进行导入，那么引入的是 `./index.mjs` 文件。

`Nodejs` 会根据当前运行环境，选择合适的导入方式将包进行导入。

所以我们可以借助这一特性，来完成我们单仓库支持两个格式的第一步。

然后，下一个要解决的，就是如何构建两个格式的导出文件。

### Building

我们当然不可能为了同时支持`CJS`和 `ESM`，而编写两份代码。

但我们可以借助一些构建打包工具，来生成`ESM`和`CJS`代码。

通常情况下，我们可能会使用 `rollup` 来构建打包我们的模块。
或者也可以使用 `tsup` 来构建。

#### rollup

当我们会选择 `rollup` 来构建一个库时，可能配置如下：

```js
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: './dist/index.js',
  }
}
```

由于`rollup` 是支持多配置打包的，所以我们可以使用多配置的方式，同时打包输出两种格式的文件：
```js
// rollup.config.js
export default [
  {
    input: 'src/index.js',
    output: {
      file: './dist/index.js',
      format: 'cjs',
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: './dist/index.mjs',
      format: 'es',
    }
  }
]
```


#### tsup

`tsup` 是一个面向 `TypeScript` 的打包工具，基于 `esbuild`， 可以很方便的将我们的库打包成多种模式进行输出：

`tsup` 可以支持零配置，直接使用命令行即可输出两种格式

``` sh
tsup src/index.ts --format esm,cjs
```

执行完成后，将会得到两个文件：`cjs` 格式文件`dist/index.js` 和 `esm`格式文件`dist/index.mjs` 。


使用构建工具构建完成后，接下来就是完善 `package.json`，

建议在使用 `type` 字段声明为 `module`, 来声明当前库时一个标准的 esm 库，以及添加 `main`,`module`,`exports`字段,
以便向下兼容：

```json
{
  "name": "my-package",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs"
    }
  },
  "types": "./dist/index.d.ts",
  "files": ["dist"]
}
```

最后，你的 `CJS` 项目中，或者 `ESM` 项目中，均可以根据环境要求，导入这个包。

```js
// cjs
const pkg = require('my-package')
```

```js
// esm
import pkg from 'my-package'
```

## 总结

虽然 `Nodejs` 从 `v14.22.0` 版本开始试验性的支持 `esm` ，并且到 `v16` 版本，正式支持 `esm`。
但将库升级到仅支持`esm` 还是一个比较激进的做法，建议从相对安全的 双格式支持 开始迁移，在合适的时机，过渡到仅支持`esm`。

