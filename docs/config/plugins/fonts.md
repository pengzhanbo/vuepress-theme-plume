---
title: 特殊字符字体
createTime: 2024/03/06 10:21:47
permalink: /config/plugins/fonts/
---

## 概述

`vuepress-theme-plume` 内置了 `plugin-fonts` 插件，用于加载 [Inter](https://rsms.me/inter/) 字体，以支持特殊字符的渲染。

某些特殊字符（如连字 ligatures、特定 Unicode 符号等）在某些系统字体中可能无法正确显示，Inter 字体提供了对这些字符的良好支持，确保文档中的特殊字符能够正确渲染。

## 特性

- 自动加载 Inter 字体
- 无需任何配置
- 由主题自动启用

## 配置

该插件无需任何配置，由主题自动启用。您无需在主题配置中添加任何与字体相关的选项。

::: tip
如果您不需要特殊字符支持，可以忽略此插件，它不会对您的站点产生任何负面影响。
:::
