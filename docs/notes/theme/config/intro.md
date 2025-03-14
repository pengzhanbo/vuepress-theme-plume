---
title: 配置说明
createTime: 2024/03/02 10:48:14
permalink: /config/intro/
---

## VuePress 配置文件

### 概述

VuePress 站点的基本配置文件是 `.vuepress/config.js` ，但也同样支持 TypeScript 配置文件。
你可以使用 `.vuepress/config.ts` 来得到更好的类型提示。

具体而言，VuePress 对于配置文件的路径有着约定（按照优先顺序）：

当前工作目录 `cwd` 下：

- `vuepress.config.ts`
- `vuepress.config.js`
- `vuepress.config.mjs`

源文件目录 `sourceDir` 下：

- `.vuepress/config.ts`
- `.vuepress/config.js`
- `.vuepress/config.mjs`

基础配置文件示例：

```ts
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  bundler: viteBundler(),

  theme: plumeTheme({
    // 在这里配置主题
  }),

  lang: 'zh-CN',
  title: '你好， VuePress ！',
  description: '这是我的第一个 VuePress 站点',
})
```

### 类型

在 VuePress 中，有三种配置类型:

- 站点配置: 这是你在 配置文件 中直接导出的对象
- 主题配置: 传递给 `plumeTheme` 的对象参数
- 页面配置: 由在页面顶部基于 YAML 语法的 Frontmatter 提供

## 主题配置文件

### 概述

一般我们使用 `.vuepress/config.js` 或者 `.vuepress/config.ts` 来配置主题。

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // 在这里配置主题
  }),
})
```

但是当我们已经启动了 VuePress 服务，对该文件的修改会导致 VuePres 服务重启，然后站点进行全量刷新，
这可能需要等待一段时间才能恢复， 如果你的站点内容不多还能够接受，
而对于一些较大的站点，可能需要等待漫长的时间。

特别是当我们频繁修改，或者修改的间隔较短时，很容易使 VuePress 服务 崩溃，我们不得不手动重启。

**这给我们在编写站点内容时带来的极大的不便。**

为了解决这一问题，主题支持在 单独的 主题配置文件中进行配置。

**对该文件的修改将通过热更新的方式实时生效。**

### 配置

你可以直接在 [VuePress 配置文件](#vuepress-配置文件) 相同的路径下创建一个 `plume.config.js` 文件，这样就可以在该文件中进行主题配置。
你也可以使用 TypeScript 来创建一个 `plume.config.ts` 文件，以获得更好的类型提示。

::: file-tree

- docs
  - .vuepress
    - config.ts
    - **plume.config.ts**
:::

::: code-tabs
@tab plume.config.ts

```ts
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

:::

主题提供了 `defineThemeConfig(config)` 函数，为主题使用者提供主题配置的类型帮助。
你可以直接在这个文件中配置除了 `plugins` 字段外的其他配置。

### 自定义配置文件路径

如果你不希望按照 VuePress 默认的配置文件路径管理你的主题配置文件，
你也可以在 VuePress 配置文件中指定自己的主题配置文件路径。

```ts
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

::: tip
更推荐 使用 主题配置文件 来单独管理 主题配置，你不必再为频繁修改配置而一直等待
VuePress 重启。
:::
