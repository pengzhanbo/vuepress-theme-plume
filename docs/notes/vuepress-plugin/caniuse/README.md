---
title: plugin-caniuse
createTime: 2022/05/13 01:02:51
author: pengzhanbo
permalink: /note/vuepress-plugin/caniuse/
---

项目地址： [vuepress-plugin-caniuse](https://github.com/pengzhanbo/vuepress-theme-plume/tree/main/packages/plugin-caniuse)

![npm version](https://badge.fury.io/js/@vuepress-plume%2Fvuepress-plugin-caniuse.svg)

![npm download](https://img.shields.io/npm/dy/@vuepress-plume/vuepress-plugin-caniuse)

## 指南

为你的 vuepress 站点，在编辑 技术文章时， 提供 嵌入 [can-i-use](https://caniuse.com/) WEB feature 各平台支持说明图标 的功能。

方便在描述某个 WEB feature 时，能更直观的表述 该特性的支持程度。

## 安装

:::: code-group
::: code-group-item  npm
``` sh
npm install @vuepress-plume/vuepress-plugin-caniuse
```
:::
::: code-group-item yarn:active
``` sh
yarn add @vuepress-plume/vuepress-plugin-caniuse
```
:::
::: code-group-item pnpm
``` sh
pnpm add @vuepress-plume/vuepress-plugin-caniuse
```
:::
::::

## 使用

### Step1：添加插件

将插件添加到你的 vuepress 项目的配置文件中：

:::: code-group
::: code-group-item .vuepress/config.ts
``` ts {2,6}
import { defineUserConfig } from 'vuepress'
import { caniusePlugin } from '@vuepress-plume/vuepress-plugin-caniuse'

export default defineUserConfig({
  plugins: [
    caniusePlugin()
  ]
})
```
:::
::: code-group-item .vuepress/config.js
``` js {1,5}
const { caniusePlugin } = require('@vuepress-plume/vuepress-plugin-caniuse')

module.exports = {
  plugins: [
    caniusePlugin()
  ]
}
```
:::
::::

### Step2：在markdown中使用

在你的 文章 markdown文件中，使用以下格式：

``` md
::: caniuse <feature>
:::
```

__示例： 获取 css 伪类选择器 `:dir()` 在各个浏览器的支持情况图标：__

``` md
::: caniuse css-matches-pseudo
:::
```
效果：

::: caniuse css-matches-pseudo
:::

## Method

`caniusePlugin([options])`

插件注册函数

__options:__ `[CanIUsePluginOptions]`

- `options.mode`: 配置 can-i-use 在 文章中的 嵌入模式, 默认： `image`
  - `image`： 嵌入 特性图表图片
  - `embed`:  嵌入 iframe， 实时的，可交互的模式
