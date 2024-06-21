---
title: plugin-content-update
author: pengzhanbo
createTime: 2024/03/12 19:53:34
permalink: /plugins/plugin-content-update/
tags:
  - 插件
  - 内容更新
---

## 指南

用于解决在 开发运行时， Markdown 内容更新时， 部分依赖解析后的 HTML 内容提供功能的插件，
未对新增的 Markdown 内容提供支持。

如， `plugin-medium-zoom` 需要在 页面渲染完成后，获取当前页面的图片实现 图片放大功能。
但是在 开发运行时，在 markdown 插入新图片后，如果页面未刷新，新增的图片无法实现放大功能。

本插件对 `vuepress` 内置插件 `<Content />` 进行重写替换，并提供了 `onContentUpdated(callback)`
方法，用于在 Markdown 内容更新时，执行回调函数。

::: warning 警告
本插件为 试验性插件，未来会随着 VuePress 的更新进行升级。

本插件主要面向 主题开发者 或 插件开发者。
:::

## 安装

::: code-tabs
@tabs npm

```sh
npm install @vuepress-plume/plugin-content-update
```

@tab pnpm

```sh
pnpm add @vuepress-plume/plugin-content-update
```

@tab yarn

```sh
yarn add @vuepress-plume/plugin-content-update
```

:::

## 使用

在 vuepress 配置文件中引入插件：

::: code-tabs
@tab .vuepress/config.ts

``` ts
import { defineUserConfig } from 'vuepress'
import { contentUpdatePlugin } from '@vuepress-plume/plugin-content-update'

export default defineUserConfig({
  plugins: [
    contentUpdatePlugin()
  ]
})
```

:::

在 客户端文件中使用：

``` vue
<script lang="ts" setup>
import { onContentUpdated } from '@vuepress-plume/plugin-content-update/client'

onContentUpdated(() => {
  // do something
})
</script>
```

## 示例

获取 `medium-zoom` 实例， 当 markdown 内容更新时， 刷新 `medium-zoom` 实例，使新增的图片可放大

```vue
<script lang="ts" setup>
import { onContentUpdated } from '@vuepress-plume/plugin-content-update/client'
import { useMediumZoom } from '@vuepress/plugin-medium-zoom/client'

const mediumZoom = useMediumZoom()

onContentUpdated(() => {
  mediumZoom?.refresh()
})
</script>
```
