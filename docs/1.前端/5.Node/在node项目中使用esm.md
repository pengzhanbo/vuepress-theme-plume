---
title: 在NodeJs项目中使用ECMAScript module
createTime: 2022/06/17 02:04:57
author: pengzhanbo
permalink: /article/7jzjudus/
---

随着 `Nodejs v16` 成为长期稳定支持的版本，`ESM` 也随之成为 `NodeJs` 正式支持的标准化模块系统，这允许我们通过
`ESM` 来开发我们的 `NodeJs` 项目，并在项目中通过`ESM` 来导入其他的`ESM`包。

<!-- more -->

## 创建项目

我们以新建一个 NodeJs 项目为例， 它有如下的结构：
```sh
./my-esm-package
├── lib
│   ├── resolve.js
│   └── index.js
└── package.json
```

这个项目的功能是导出一个 resolve 方法，是 `path.resolve` 的封装实现。

::: code-tabs
@tab lib/index.js
```js
export * from './resolve.js'

```

@tab lib/resolve.js
```js
import path from 'path'

export const resolve = (...arg) => path.resolve(...arg)
```
:::

## package.json

在 `package.json` 中，我们需要进行以下声明：

- 声明 `type` 字段值为 `module`
  
  这个字段声明了你的包将作为一个 `ECMAScript module` 被`NodeJs` 加载并解析，并允许使用`.mjs`格式的文件。

- 声明 `exports` 字段
  
  该字段描述了 项目如何导出模块给到其他包使用。

  - 默认导出
    
    ::: code-tabs
    @tab package.json
    ```json
    {
      "exports": "./lib/index.js"
    }
    ```
    :::

    即当使用`import { resolve } from 'my-esm-package'`时，默认引入的文件是 `lib/index.js`。
  
  - 导出多个模块
    
    ::: code-tabs
    @tab package.json
    ```json
    {
      "exports": {
        ".": "./lib/index.js",
        "resolve": "./lib/resolve.js"
      }
    }
    ```
    :::

    声明了导出了两种模块：一个是默认导出，使用`"."` 作为key；一个是具名导出。

    当使用`import { resolve } from 'my-esm-package'`时，默认引入的文件是 `lib/index.js`。

    当使用`import { resolve } from 'my-esm-package/resolve'` 时，引入的文件是 `lib/resolve.js`。

  - `exports` 还支持其他形式的值，这里暂不赘述。

- 声明 `engines` 字段
  
  由于 `Nodejs` 并不是全版本支持`esm`的，而是从`v14.16.0`版本开始试验性的支持，并到了`v16`版本才作为正式支持，
  且当前`v16`版本作为目前的长期稳定支持的版本。这个项目运行环境的`NodeJs` 版本，最低应该推荐使用 `v16` 以上的版本。
  即它的值应该为 `{ "node": ">=16" }`

到这里，这个项目的`package.json` 文件，包含以下内容:

::: code-tabs
@tab package.json
```json
{
  "name": "my-esm-package",
  "description": "My first esm package.",
  "type": "module",
  "exports": {
    ".": "./lib/index.js",
    "resolve": "./lib/resolve.js"
  },
  "engines": {
    "node": ">=16"
  }
}
```
:::

## 编写项目代码

1. 由于是一个 `esm` 项目，所以理所当然的不能项目中使用 `require()`/`module.exports` 来导入导出模块。
而是应该全部使用`import`/`export` 的方式来导入导出模块。

2. 不需要在项目代码中 使用 `use strict`。

3. 由于 `esm` 项目中，`NodeJs` 不再支持 `__dirname`/`__filename`，所以有相关场景需要使用时，需要使用其他的方式来实现相同功能：
  ```js
  import { dirname, basename } from 'path'
  import { fileURLToPath } from 'url'

  const _dirname = typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url))
  
  const _filename = typeof __filename !== 'undefined'
    ? __filename
    : basename(fileURLToPath(import.meta.url))
  ```
## TypeScript

如果在项目中使用了 `TypeScript`，那么除了需要遵循以上的内容，还需要在 `tsconfig.json` 配置文件中补充以下配置：

```json
{
  "module": "node16",
  "moduleResolution": "node16"
}
```

并且，应该将 `.ts` 文件，编译为 `.js` 文件，`package.json` 配置的 `exports` 导出的，是编译后的 `.js` 文件。

## 最后

当完成了以上步骤，就可以得到一个`NodeJs ESM` 项目。它也只能在另一个支持 `esm` 的项目中使用。
