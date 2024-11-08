---
title: 介绍
author: Plume Theme
createTime: 2024/03/06 8:26:44
permalink: /config/plugins/
---

主题内置的使用的插件，扩展了主题的众多功能，你可以在 `plugins` 配置中， 实现对内部使用的各个插件的自定义配置。

## 配置

所有主题内部使用的插件， 均在 `plugins` 字段中进行配置。

::: code-tabs
@tab .vuepress/config.ts

``` js
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      // more options...  // [!code ++]
    }
  }),
})
```

:::

:::tip
您无需重复安装这些内置插件，也无需在 [vuepress配置 > plugins](https://v2.vuepress.vuejs.org/zh/reference/config.html#plugins) 中添加它们。主题已在内部完成了这些工作。
:::
