# vuepress-theme-plume

<p align="center">
<img src="https://github.com/pengzhanbo/vuepress-theme-plume/raw/main/docs/plume.svg" width="200px" />
</p>

[![npm version](https://img.shields.io/npm/v/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&label=npm)](https://www.npmjs.com/package/vuepress-theme-plume)
[![npm download](https://img.shields.io/npm/dy/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&label=downloads)](https://www.npmjs.com/package/vuepress-theme-plume)
![GitHub License](https://img.shields.io/github/license/pengzhanbo/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A)

一个简约的，干净的，容易上手的 vuepress 主题，适用于博客和文档。

开箱即用，仅需少量配置即可使用，让您更专注于 内容的创作，更好的表达你的想法，形成你的知识笔记。

内置了丰富的强大的功能，旨在让内容更具有表现力。

### [查看文档](https://pengzhanbo.cn/note/vuepress-theme-plume)

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

### `plumeTheme(options)`

__options__ : `PlumeThemeOptions`

[查看 options 详细说明](https://pengzhanbo.cn/note/vuepress-theme-plume/theme-config/)

## LICENSE

[MIT](https://github.com/pengzhanbo/vuepress-theme-plume/blob/main/LICENSE)
