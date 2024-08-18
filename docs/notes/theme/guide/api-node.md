---
title: Node
author: pengzhanbo
icon: fa6-brands:node
createTime: 2024/03/07 21:59:13
permalink: /guide/api/node/
---

## 使用

```ts
import { plumeTheme } from 'vuepress-theme-plume'
```

## `plumeTheme(options)`

__options__ : `PlumeThemeOptions`

主题配置函数。

查看 [主题配置](../config/主题配置.md) 了解更多。

## `defineThemeConfig(options)`

主题配置帮助函数，用于在单独的 `plume.config.ts` 中使用。

查看 [主题配置文件](../config/配置说明.md#主题配置文件) 了解更多。

## `defineNavbarConfig(options)`

主题导航栏配置类型帮助函数。

查看 [主题配置](../config/导航栏配置.md) 了解更多。

## `defineNotesConfig(options)`

__options:__ `NotesOptions`

主题 notes 配置类型帮助函数

查看 [主题配置](../config/notes配置.md) 了解更多。

## `defineNoteConfig(options)`

__options:__ `NoteItem`

主题 单个 note (`NoteItem`) 配置类型帮助函数

查看 [主题配置](../config/notes配置.md) 了解更多。
