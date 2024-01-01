# `vuepress-theme-plume`

一款基于 VuePress@2 的博客皮肤。

[查看使用文档](https://pengzhanbo.cn/note/vuepress-theme-plume)

## Install

``` sh
# npm
npm i vuepress-theme-plume
# or pnpm
pnpm add vuepress-theme-plume
# or yarn
yarn add vuepress-theme-plume
```

## Usage

``` js
// .vuepress/config.ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // theme config
  })
})
```
