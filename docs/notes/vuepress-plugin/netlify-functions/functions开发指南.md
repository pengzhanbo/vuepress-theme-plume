---
title: functions开发指南
createTime: 2022/05/13 05:45:24
author: pengzhanbo
permalink: /note/vuepress-plugin/netlify-functions/develop-functions/
---

## 说明

### 在一个 vuepress 项目中

在默认配置下，如果你 packages.json
``` json
{
  "scripts": {
    "serve": "vuepress dev src",
    "build": "vuepress build src"
  }
}
```
即， 你的 `sourceDir` 为 `src` 目录， 那么，你的functions目录则为 `src/.vuepress/functions`。

在这个目录下，直属的 `ts/js` 文件，均为一个个独立的 `function`， 不包括这个目录下的子目录。

``` sh
src/.vuepress/functions
├─my_function.ts # 这是一个function 通过 /api/my_function 调用
├─verify_phone.ts # 这是一个 function， 通过 /api/verify_phone 调用
└─utils # 子目录中的不会被识别为function
    └─index.ts
```

### 在一个 vuepress plugin 项目中

以官方仓库插件的基本组织结构为例
``` sh
src/node
├─functions
│   ├─my_function.ts # 这是一个function 通过 /api/my_function 调用
│   ├─verify_phone.ts # 这是一个 function， 通过 /api/verify_phone 调用
│   └─utils # 子目录中的不会被识别为function
│       └─index.ts
├─index.ts
└─plugin.ts # 在这个文件中配置了 directory 为 path.resolve(__dirname, 'functions')
```

## 依赖

如果你是使用 typescript 作为开发语言，那么可以引入 `@netlify/functions` 模块提供类型检查支持。

如果你的 function 依赖其他的第三方模块，请在配置在项目`package.json` 的 `dependencies` 字段中作为生产依赖。

如果你是通过插件提供 function，请在 插件的使用指南中 说明，你的插件function依赖了哪些第三方模块，
提醒使用者安装这些依赖。

## function

`functions` 通过 导出一个 `handler` 函数 提供给 云函数服务调用。

一个 function 的内容一般如下：

- 异步函数
  
  在异步函数中，支持直接返回一个对象作为 响应体报文

  ``` ts
  import { Handler } from '@netlify/functions'
  export const handler: Handler = async function (event, context) {
    // do something
    return {
      statusCode: 200,
      body: JSON.stringify({})
    }
  }
  ```

- 非异步函数
  
  在非异步函数中，通过 `callback` 函数参数返回响应体报文

  ``` ts
  import { Handler } from '@netlify/functions'
  export const handler: Handler = function (event, context, callback) {
    // do something
    callback{
      statusCode: 200,
      body: JSON.stringify({})
    })
  }
  ```

## 示例

[plugin-page-collection](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/packages/plugin-page-collection)
页面访问次数插件
