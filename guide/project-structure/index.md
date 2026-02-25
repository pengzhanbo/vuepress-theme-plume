---
url: /guide/project-structure/index.md
---
本指南详细说明使用 VuePress 和 Plume 主题创建的项目文件结构，帮助您更好地组织和管理项目文件。

通过[命令行工具创建](./usage.md#命令行安装)的项目，其典型文件结构如下：

::: file-tree

* .git/
* **docs** # 文档源目录
  * .vuepress  # VuePress 配置目录
    * public/ # 静态资源
    * client.ts # 客户端配置（可选）
    * collections.ts # Collections 配置（可选）
    * config.ts # VuePress 主配置
    * navbar.ts # 导航栏配置（可选）
    * plume.config.ts # 主题配置文件（可选）
  * demo # `doc` 类型 collection
    * foo.md
    * bar.md
  * blog # `post` 类型 collection
    * preview # 博客分类
      * markdown.md # 分类文章
    * article.md # 博客文章
  * README.md # 站点首页
  * …
* package.json
* pnpm-lock.yaml
* .gitignore
* README.md
  :::

::: tip 手动创建的项目也可参考此结构进行组织
:::

## 文档源目录

**文档源目录**包含站点的所有 Markdown 源文件。在使用命令行工具启动 VuePress 时需指定此目录：

```sh
# [!code word:docs]
vuepress dev docs
#            ↑ 文档源目录
```

对应的 package.json 脚本配置：

```json title="package.json"
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

VuePress 仅处理文档源目录内的文件，其他目录将被忽略。

## `.vuepress` 配置目录

`.vuepress/` 是 VuePress 的核心配置目录，您可在此配置项目、创建自定义组件和样式。

### `client.ts` - 客户端配置

用于扩展 VuePress 客户端功能，如注册全局组件：

```ts title=".vuepress/client.ts"
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    // app: Vue 应用实例
    // router: Vue Router 实例
    // siteData: 站点数据

    // 注册全局组件
    app.component('MyComponent', MyComponent)
  },
  setup() {
    // Vue 根组件的 setup 方法
  }
})
```

### `config.ts` - 主配置文件

VuePress 的核心配置文件，设置主题、插件和构建工具：

```ts title=".vuepress/config.ts" twoslash
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
  theme: plumeTheme({
    // 主题配置...
  }),
  bundler: viteBundler(),
})
```

### `plume.config.ts` - 主题配置

专为主题提供的配置文件，支持热更新，修改后无需重启服务：

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
  // 更多配置...
})
```

@tab .vuepress/navbar.ts

```ts twoslash
import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  // 导航项配置...
])
```

@tab .vuepress/collections.ts

```ts twoslash
import { defineCollections } from 'vuepress-theme-plume'

export default defineCollections([
  {
    type: 'post',
    dir: 'blog',
    title: '博客',
    link: '/blog/'
  },
  {
    type: 'doc',
    dir: 'demo',
    linkPrefix: '/demo/',
    title: '文档示例',
    sidebar: 'auto'
  },
])
```

:::
