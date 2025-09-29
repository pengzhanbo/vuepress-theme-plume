---
title: 项目结构
icon: ph:tree-structure-bold
createTime: 2024/09/16 21:59:30
permalink: /guide/project-structure/
---

本指南将向您说明 VuePress 和 Plume 创建的项目的文件结构，以及如何在项目中使用它们。

当您 [使用命令行工具创建](./usage.md#命令行安装) 的项目，它的文件结构是这样的：

::: file-tree

- .git/
- **docs** \# 文档源目录
  - .vuepress  \# vuepress 配置文件夹
    - public/ \# 静态资源目录
    - client.ts \# 客户端配置 (可选)
    - collections.ts \# collections 配置 (可选)
    - config.ts \# vuepress 配置
    - navbar.ts \# 导航栏配置 (可选)
    - plume.config.ts \# 主题配置文件  (可选)
  - demo \# doc 类型的 collection 目录
    - foo.md
    - bar.md
  - blog \# post 类型的 collection 目录，这里作为博客
    - preview \# 博客分类之一
      - markdown.md \# 分类下的博客文章
    - article.md \# 博客文章
  - README.md \# 首页
  - …
- package.json
- pnpm-lock.yaml
- .gitignore
- README.md
:::

::: tip 如果你是手动创建的，也可以参考此文件结构管理您的项目
:::

## 文档源目录

**文档源目录** 指的是，你的站点的所有 markdown 文件所在的目录。该目录一般在使用 命令行工具 启动 VuePress
时指定：

```sh
# [!code word:docs]
vuepress dev docs
#            这里声明了文档源目录为 docs
```

```json title="package.json"
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    //                        ^^^^
    "docs:build": "vuepress build docs"
    //                            ^^^^
  }
}
```

一般而言，VuePress 仅会接管 该目录，非源目录下的其它文件会被忽略。

## `.vuepress` 目录

`.vuepress/` 目录是 VuePress 配置文件夹，你还可以在这里创建 自己的组件、自定义主题样式等。

**在此目录中：**

### `client.ts`

客户端配置文件，你可以在这里扩展 VuePress 的功能，比如声明新的全局组件等。

```ts title=".vuepress/client.ts"
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    // app: vue app 实例
    // router: vue router 实例
    // siteData: vuepress 站点配置

    // 注册全局组件
    app.component('MyComponent', MyComponent)
  },
  setup() {
    // 等同于 vue 根组件 上的  setup 方法
  }
})
```

### `config.ts`

为 VuePress 配置文件，你需要在这里进行一些必要的配置，比如 主题、插件、构建工具等。

```ts title=".vuepress/config.ts" twoslash
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
  theme: plumeTheme({
    // more...
  }),
  bundler: viteBundler(),
})
```

### `plume.config.ts`

主题配置文件，由于每次修改 `.vuepress/config.ts`，都需要重启 VuePress 服务，然而实际上大多数时候都不需要这么做。

主题将不需要重启服务的配置移动到了这里。在这里修改配置时，仅通过热更新的方式更新主题。

::: code-tabs
@tab .vuepress/plume.config.ts

```ts twoslash
// @filename: ./navbar.ts
export default []

// @filename: ./collections.ts
export default []
// ---cut---
import { defineThemeConfig } from 'vuepress-theme-plume'
import collections from './collections'
import navbar from './navbar'

export default defineThemeConfig({
  logo: '/logo.svg',
  profile: {
    name: 'Theme Plume',
  },
  navbar,
  collections,
  // ... more
})
```

@tab .vuepress/navbar.ts

```ts twoslash
import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  // ...
])
```

@tab .vuepress/collections.ts

```ts twoslash
import { defineCollections } from 'vuepress-theme-plume'

export default defineCollections([
  { type: 'post', dir: 'blog', title: '博客', link: '/blog/', },
  { type: 'doc', dir: 'demo', linkPrefix: '/demo/', title: '文档示例', sidebar: 'auto' },
])
```

:::
