---
title: Markdown Power
author: pengzhanbo
createTime: 2024/04/04 06:56:33
permalink: /config/plugin/markdown-power/
---

## 概述

提供 Markdown 增强功能。

关联插件: [@vuepress-plume/plugin-md-power](/)

默认配置：

```ts
import { plumeTheme } from 'vuepress-theme-plume'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        // 默认不启用任何功能，你需要手动开启它们
        // pdf: true, // @[pdf](url)  嵌入 PDF 文件
        // icons: true, // :[collect:name]:   内联 iconify 图标
        // bilibili: true, // @[bilibili](bvid)  嵌入 bilibili 视频
        // youtube: true, // @[youtube](id)  嵌入 youtube 视频
        // codepen: true, // @[codepen](user/slash)  嵌入 codepen
        // replit: true, // @[replit](user/repl-name)  嵌入 Replit
        // codeSandbox: true, // @[codesandbox](id)  嵌入 CodeSandbox
        // jsfiddle: true, // @[jsfiddle](id)  嵌入 jsfiddle
        // caniuse: true, // @[caniuse](feature)  嵌入 caniuse
        // repl: true, // :::go-repl   :::kotlin-repl  :::rust-repl
      }
    }
  }),
})
```

## 配置

查看 [文档](/plugins/plugin-md-power/)
