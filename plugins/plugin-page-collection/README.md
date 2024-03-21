# `@vuepress-plume/plugin-page-collection`

这是一个使用了 `netlify functions` + `leancloud` 的 `VuePress2` 插件示例。

- 功能： 进入页面时，记录访问次数，并提供一个 组件展示页面访问次数。

## Why ？

- 为什么是在 `netlify functions` 中 连接 `leancloud` ，而不是直接在 web客户端中请求 `leancloud` ?

  这是出于数据安全的角度考虑，避免直接在浏览器可见的代码中暴露私密的鉴权信息。

## 使用方式

> (仅示例，本插件未发布到 npm)

- 在 vuepress 配置插件

  ``` ts
  export default defineUserConfig({
    plugins: [
      pageCollectionPlugin()
    ]
  })
  ```

- 在需要做页面记录的路由级组件中引入`<PageCollection>`组件

  ``` html
  <Page>
    <PageCollection />
  </Page>
  ```

- 在项目根目录 新建 `.env` 文件
  > 开发时使用，发布到生产时，需要在 netlify 中配置 环境变量。
  > 同时，需要将 `.env` 文件添加到 `.ignore`中，避免暴露

  ```sh
  LEAN_CLOUD_APP_ID='your leancloud appId'
  LEAN_CLOUD_APP_KEY='your leancloud appKey'
  LEAN_CLOUD_MASTER_KEY='your leancloud masterKey'
  ```

效果：

``` html
阅读数：99
```

## 结构

``` SH
.
├── database # leancloud-storage
│   └── Page.json # Object Page 在 leancloud控制台中导入即可使用
├── src # 源码
│   ├── client
│   │   ├── clientAppEnhance.ts # 注入全局组件
│   │   ├── components
|   |   |   └── PageCollection.ts # 组件
│   │   └── composables
|   |       ├── index.ts
|   |       └── usePageCollection.ts # 请求 functions
│   ├── node
│   │   ├── functions # netlify functions 文件夹
|   |   |   └── page_collection.ts # 连接 leancloud 获取 page数据
│   │   ├── index.ts
│   │   └── plugin.ts # 插件配置
│   └── shared
│       └── index.ts
└── package.json
```

## 主要代码说明

请查看源码注释
