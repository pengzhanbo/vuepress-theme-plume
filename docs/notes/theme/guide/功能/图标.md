---
title: 图标
icon: raphael:smile2
author: pengzhanbo
createTime: 2024/07/22 10:45:47
permalink: /guide/features/icon/
---

## 概述

主题支持 [iconify](https://icon-sets.iconify.design/) 的所有图标，并提供了不同的方式来使用它们：

- [导航栏图标](../../config/导航栏配置.md#配置)
- [侧边栏图标](../../guide/知识笔记.md#侧边栏图标)
- [图标组件](#图标组件)
- [图标语法糖](../../guide/markdown/进阶.md#iconify-图标)
- [文件树图标](../../guide/markdown/进阶.md#文件树)
- [代码分组标题图标](../代码/代码组.md#分组标题图标)

::: tip 主题对图标的优化
上述的不同的使用图标的方式，主题在内部都采取了相同的解析策略，即使您在不同的位置使用了相同的图标，
也不会重复加载相同的图标资源。

图标默认是通过远程请求加载，主题也非常建议您在本地项目中安装 `@iconify/json` 包，以便主题能够将图标全部解析为本地资源，
这可以有效的提高页面的访问体验。
:::

## 图标组件

通过 `<Icon />` 组件来使用图标。

你可以在 markdown 文件中使用该 组件。

### 属性

`<Icon />` 组件接受一个 `name` 属性，用于指定图标的名称。还支持传入 `color` 和 `size` 属性来设置图标的颜色和大小。
但对于 彩色图标，`color` 属性设置无效。

| 属性  | 类型               | 描述                                                                       |
| ----- | ------------------ | -------------------------------------------------------------------------- |
| name  | `string`           | 图标名称，在 [iconify](https://icon-sets.iconify.design/) 可获取对应的名称 |
| color | `string`           | 图标颜色，仅纯色图标支持设置颜色                                           |
| size  | `number \| string` | 设置图标大小，默认单位为 `px` ，可自定义单位                               |

**示例：**

````md
- 纯色图标：<Icon name="octicon:smiley-16" />
- 定义纯色图标的颜色和大小：<Icon name="octicon:smiley-16" color="red" size="2em" />
- 彩色图标：<Icon name="noto:smiling-face-with-open-hands" />
- 定义彩色图标的大小：<Icon name="noto:smiling-face-with-open-hands" size="2em" />
````

- 纯色图标：<Icon name="octicon:smiley-16" />
- 定义纯色图标的颜色和大小：<Icon name="octicon:smiley-16" color="red" size="2em" />
- 彩色图标：<Icon name="noto:smiling-face-with-open-hands" />
- 定义彩色图标的大小：<Icon name="noto:smiling-face-with-open-hands" size="2em" />

### 加载图标

`<Icon />` 组件默认通过 远程请求 `CDN` 获取图标资源，但这可能受到网络环境的影响，出现加载失败
或者延迟显示的情况。

为了解决这一问题，主题建议 在你的站点项目中安装 `@iconify/json` 包。
主题会检查当前项目是否安装了 `@iconify/json`，如果安装了该包，则主题自动解析所使用到的图标，
并处理为本地图标资源，在构建时打包到 `dist` 目录中。

由于 `@iconify/json` 包比较大，需要手动进行安装：

::: npm-to

```sh
npm install @iconify/json
```

:::

## markdown 语法糖

相关内容请查看 [iconify-图标 语法糖](../markdown/图标.md)

---

::: tip 说明
[navbar](../../config/主题配置.md#navbar) 配置和 [notes](../../config/主题配置.md#notes) 配置
中的 `icon` 选项，也支持传入 iconify 图标名，并且当安装了 `@iconify/json`，也会自动解析为本地图标资源。
:::
