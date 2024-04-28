---
title: plugin-caniuse
author: pengzhanbo
createTime: 2024/03/11 17:22:52
permalink: /plugins/plugin-caniuse/
---

:::warning Deprecated
该插件功能已整合到 [vuepress-plugin-md-power](/plugins/plugin-md-power) 。
因此，此插件不再更新维护，并标记为 弃用。
:::

## 指南

为你的 vuepress 站点，在编写文章时， 提供嵌入 [can-i-use](https://caniuse.com/) WEB feature 各平台支持说明 的功能。

方便在描述某个 WEB feature 时，能更直观的表述 该特性的支持程度。

## 安装

::: code-tabs
@tab  npm

``` sh
npm install @vuepress-plume/plugin-caniuse
```

@tab:active yarn

``` sh
yarn add @vuepress-plume/plugin-caniuse
```

@tab pnpm

``` sh
pnpm add @vuepress-plume/plugin-caniuse
```

:::

## 使用

### Step1：添加插件

将插件添加到你的 vuepress 项目的配置文件中：

::: code-tabs
@tab .vuepress/config.ts

``` ts
import { defineUserConfig } from 'vuepress'
import { caniusePlugin } from '@vuepress-plume/plugin-caniuse'

export default defineUserConfig({
  plugins: [
    caniusePlugin()
  ]
})
```

:::

### Step2：在markdown中使用

在你的 文章 markdown文件中，使用以下格式：

``` md
::: caniuse <feature> {browser_versions}
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

## Markdown 语法

``` md
::: caniuse <feature> {browser_versions}
:::
```

### `<feature>`

必填。 正确取值请参考 [https://caniuse.bitsofco.de/](https://caniuse.bitsofco.de/)

### `{browser_versions}`

可选。当前特性在多个版本中的支持情况。

默认值为: `{-2,-1,1}`

格式： `{number,number,...}`  取值范围为 `-5 ~ 3`

- 小于`0` 表示低于当前浏览器版本的支持情况
- `0` 表示当前浏览器版本的支持情况
- 大于`0` 表示高于当前浏览器版本的支持情况
