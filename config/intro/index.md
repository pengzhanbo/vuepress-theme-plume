---
url: /config/intro/index.md
---
## 概述

\==vuepress-theme-plume== 是基于 [VuePress](https://v2.vuepress.vuejs.org/) 的主题。
因此，配置需要遵循 VuePress 的配置规范。

**在 VuePress 中，有三种配置类型:**

* **站点配置**: 这是你在 配置文件 *（如 `.vuepress/config.ts`）* 中直接导出的对象
* **主题配置**: 传递给 `plumeTheme()` 的对象参数
* **页面配置**: 由在页面顶部基于 YAML 语法的 Frontmatter 提供

## VuePress 配置文件

VuePress 站点的基本配置文件是 `.vuepress/config.js` ，但也同样支持 TypeScript 配置文件。
你可以使用 `.vuepress/config.ts` 来得到更好的类型提示。

具体而言，VuePress 对于配置文件的路径有着约定（按照优先顺序）：

当前工作目录 `cwd` 下：

* `vuepress.config.ts`
* `vuepress.config.js`
* `vuepress.config.mjs`

源文件目录 `sourceDir` 下：

* `.vuepress/config.ts`&#x20;
* `.vuepress/config.js`
* `.vuepress/config.mjs`

基础配置文件示例：

```ts title=".vuepress/config.ts" twoslash
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  // [!code hl:5]
  // VuePress 的基本配置
  lang: 'zh-CN',
  title: '你好， VuePress ！',
  description: '这是我的第一个 VuePress 站点',
  // ...

  // 使用 vite 作为构建工具
  bundler: viteBundler(),

  // 告诉 VuePress 使用 Plume 主题
  theme: plumeTheme({ // [!code ++:4]
    // 在这里配置主题
    // ...
  }),
})
```

## 主题配置文件

一般我们使用 `.vuepress/config.js` 或者 `.vuepress/config.ts` 来配置主题。

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 在这里配置主题
  }),
  // ...
})
```

但是当我们已经启动了 VuePress 服务后，每次对该文件的修改，都会导致 VuePress 服务重启，
然后站点进行全量刷新，这可能需要等待一段时间才能恢复， 当站点内容较少时，这个过程很快，
而对于一些较大的站点，可能需要等待较长的时间。

特别是频繁修改时，很容易使 VuePress ==服务崩溃=={.caution} ::twemoji:angry-face::，不得不手动重启。

**这给我们在编写站点内容时带来的极大的不便。**

实际上，主题配置中的一部分字段，并不需要重启 VuePress 服务，
比如 `navbar`、`profile` 等字段，可以通过 热更新 的方式实时生效。

主题添加主题配置文件 `plume.config.ts` 的支持，
\==对该文件的修改将通过热更新的方式实时生效。=={.tip} ::twemoji:confetti-ball::

你可以在这个文件中配置支持热更新的字段，比如 `navbar`、`profile` 等字段。

::: tip
这些支持热更新的字段依然可以在 VuePress 配置文件的 `theme` 中进行配置，主题配置文件的配置
最终会合并到 VuePress 配置文件中。

在 主题配置文件配置的字段，避免在 VuePress 配置文件的 `theme` 配置中重复配置。
因为在合并过程可能会出现数据重复的情况。
:::

::: details 什么是 热更新？

**热更新** 是编程的一种技术，在 VuePress 中，体现为：

* 对配置的修改实时生效，不需要重启 VuePress 服务，浏览器不会自动刷新页面
* 对页面的修改实时生效，在浏览器中页面无需刷新即可看到修改后的效果

:::

### 配置

在 [VuePress 配置文件](#vuepress-配置文件) 相同的路径下创建一个 `plume.config.js` 文件，
你也可以使用 TypeScript 来创建一个 `plume.config.ts` 文件，以获得更好的类型提示。

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
  // 在这里配置主题
  profile: {
    name: 'Your name',
  },
  navbar,
})
```

主题提供了 `defineThemeConfig(config)` 函数，为主题使用者提供主题配置的类型帮助。
你可以直接在这个文件中配置除了 `plugins` 字段外的其他配置。

::: warning 主题配置文件仅能配置部分支持热更新的配置字段
:::

::: warning 配置会被合并到 VuePress 配置的主题配置中，已经在主题配置文件中配置的字段，不需要在 VuePress 配置文件中的 `theme` 配置中重复配置
:::

### 自定义配置文件路径

如果你不希望按照 VuePress 默认的配置文件路径管理你的主题配置文件，
你也可以在 VuePress 配置文件中指定自己的主题配置文件路径。

```ts title=".vuepress/config.ts" twoslash
import path from 'node:path'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 在这里定义自己的主题配置文件路径
    configFile: path.join(__dirname, 'custom/config.ts'), // [!code ++]
  }),
})
```

::: warning 如果你是新手用户，不推荐自定义配置文件路径，这可能带来意想不到的问题。
:::

## 页面配置

使用在页面的顶部使用 YAML 语法的 Frontmatter，可以为每个页面进行单独配置主题。

```md {1,5} title="article.md"
---
title: 文章标题
createTime: 2024/09/08 22:53:34
permalink: /article/xxx/
---
```

在 Markdown 文件的顶部，使用 `---` 分隔符，在两个 `---` 之间的部分被称为 Frontmatter。
这部分通过 `YAML` 语法进行配置。

:::tip 如果你不了解 `YAML`，可以通过 [这篇博客](/article/ecxnxxd0/) 了解它的基本用法。
:::
