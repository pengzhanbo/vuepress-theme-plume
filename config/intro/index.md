---
url: /config/intro/index.md
---
## 概述

\==vuepress-theme-plume== 是基于 [VuePress](https://v2.vuepress.vuejs.org/) 开发的主题，其配置完全遵循 VuePress 的配置规范。

**VuePress 提供三种配置类型：**

* **站点配置**：在配置文件（如 `.vuepress/config.ts`）中直接导出的对象
* **主题配置**：传递给 `plumeTheme()` 函数的参数对象
* **页面配置**：基于 YAML 语法在页面 Frontmatter 中定义

## VuePress 配置文件

VuePress 的基础配置文件通常是 `.vuepress/config.js`，同时也支持 TypeScript 配置文件。使用 `.vuepress/config.ts` 可以获得更完善的类型提示。

VuePress 按以下优先顺序解析配置文件：

**当前工作目录 (cwd) 下：**

* `vuepress.config.ts`
* `vuepress.config.js`
* `vuepress.config.mjs`

**源文件目录 (sourceDir) 下：**

* `.vuepress/config.ts`&#x20;
* `.vuepress/config.js`
* `.vuepress/config.mjs`

**基础配置示例：**

```ts title=".vuepress/config.ts" twoslash
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  // [!code hl:5]
  // VuePress 基础配置
  lang: 'zh-CN',
  title: '你好， VuePress ！',
  description: '这是我的第一个 VuePress 站点',
  // ...

  // 使用 Vite 作为构建工具
  bundler: viteBundler(),

  // 启用 Plume 主题
  theme: plumeTheme({ // [!code ++:4]
    // 主题配置项
    // ...
  }),
})
```

## 主题配置文件

通常我们在 `.vuepress/config.ts` 中配置主题：

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 主题配置
  }),
  // ...
})
```

然而，修改此文件会导致 VuePress 服务重启并全量刷新。对于小型站点，这个过程很快；但对于内容较多的站点，每次重启都需要较长时间。

频繁修改配置文件还容易导致 VuePress ==服务崩溃=={.caution} ::twemoji:angry-face::，需要手动重启服务，严重影响内容编写效率。

**解决方案：主题热更新配置**：

主题提供了 `plume.config.ts` 配置文件，==对该文件的修改支持热更新，无需重启服务=={.tip} ::twemoji:confetti-ball::。

你可以在其中配置支持热更新的字段，如 `navbar`、`profile` 等。

::: tip
这些字段仍可在 VuePress 配置文件的 `theme` 中配置，但主题配置文件的设置最终会合并到主配置中。

为避免数据重复，请勿在两地同时配置同一字段。
:::

::: details 什么是热更新？

**热更新** 是一种开发技术，在 VuePress 中体现为：

* 配置修改实时生效，无需重启服务，浏览器不刷新页面
* 页面修改实时生效，浏览器无刷新更新内容

:::

### 配置方法

在 VuePress 配置文件同级目录下创建 `plume.config.ts` 文件：

::: file-tree

* docs
  * .vuepress
    * config.ts
    * **plume.config.ts**
      :::

```ts title="plume.config.ts" twoslash
// @filename: ./navbar.ts
export default []
// ---cut---
import { defineThemeConfig } from 'vuepress-theme-plume'
import navbar from './navbar'

export default defineThemeConfig({
  // 主题配置
  profile: {
    name: 'Your name',
  },
  navbar,
})
```

`defineThemeConfig(config)` 函数提供完整的类型提示。除 `plugins` 外，大多数配置都可在此文件中定义。

::: warning 注意事项

* 主题配置文件仅支持部分热更新字段
* 避免在 VuePress 配置文件中重复配置已在主题配置文件中设置的字段
  :::

### 自定义配置文件路径

如需使用非默认路径，可在 VuePress 配置中指定：

```ts title=".vuepress/config.ts" twoslash
import path from 'node:path'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 自定义配置文件路径
    configFile: path.join(__dirname, 'custom/config.ts'), // [!code ++]
  }),
})
```

::: warning 新手不建议自定义路径，可能引发意外问题
:::

## 页面配置

通过页面顶部的 YAML Frontmatter，可为每个页面单独配置主题：

```md {1,5} title="article.md"
---
title: 文章标题
createTime: 2024/09/08 22:53:34
permalink: /article/xxx/
---
```

在 Markdown 文件顶部，使用 `---` 分隔符包裹的部分即为 Frontmatter，采用 YAML 语法配置。

:::tip 如需了解 YAML 基础语法，可参考[这篇博客](/article/ecxnxxd0/)
:::
