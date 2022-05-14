---
title: 指南
createTime: 2022/05/13 01:28:38
author: pengzhanbo
permalink: /note/vuepress-plugin/netlify-functions/
---

项目地址： [vuepress-plugin-caniuse](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/packages/plugin-netlify-functions)

![npm version](https://badge.fury.io/js/@vuepress-plume%2Fvuepress-plugin-netlify-functions.svg)

![npm download](https://img.shields.io/npm/dy/@vuepress-plume/vuepress-plugin-netlify-functions)

如果你的 vuepress 站点是部署在 netlify 的，而且希望能够使用netlify functions 来做 serverless。

那么你可能需要本插件提供支持。

本插件仅 提供 `Netlify Functions` 开发环境和 打包构建 支持，不提供具体的 `functions` 函数。

- 你可以基于此插件 在你的 vuepress 项目中 自定义 `functions` 
- 也可以基于此插件作为你的 vuepress plugin 依赖，开发自定义 `functions` 提供给其他 vuepress项目使用。

## 安装

:::: code-group
::: code-group-item  npm
``` sh
npm install @vuepress-plume/vuepress-plugin-netlify-functions
```
:::
::: code-group-item yarn:active
``` sh
yarn add @vuepress-plume/vuepress-plugin-netlify-functions
```
:::
::: code-group-item pnpm
``` sh
pnpm add @vuepress-plume/vuepress-plugin-netlify-functions
```
:::
::::
