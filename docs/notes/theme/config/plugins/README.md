---
title: 介绍
author: Plume Theme
createTime: 2024/03/06 8:26:44
permalink: /config/plugins/
---

主题内置的使用的插件，扩展了主题的众多功能，你可以在这个 字段中， 实现对内部使用的各个插件的自定义配置。

## 配置

所有主题内部使用的插件， 均在 `plugins` 字段中进行配置。

``` js
import { plumeTheme } from 'vuepress-theme-plume'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      // more options...  // [!code ++]
    }
  }),
})
```
