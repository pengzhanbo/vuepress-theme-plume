---
title: 客户端
author: pengzhanbo
createTime: 2024/03/07 21:58:48
permalink: /guide/api/client/
---

## 使用

```ts
import { useDarkMode } from 'vuepress-theme-plume/client'
```


## `useDarkMode()`

- 类型： `() => Ref<boolean>`

Composable `useDarkMode()` 用于获取当前的 `dark` 状态。


```ts
import { useDarkMode } from 'vuepress-theme-plume/client'

const isDark = useDarkMode()
```

## `<HomeBox />`

- 类型：`Component`

自定义首页时，提供给 区域 的 包装容器。


### Props

| 名称                  | 类型               | 默认值    | 说明             |
| --------------------- | ------------------ | --------- | ---------------- |
| type                  | string             | `''`      | 区域类型         |
| full                  | boolean            | `false`   | 是否全屏         |
| background-image      | string             | `''`      | 区域背景图片     |
| background-attachment | `'fixed'\|'local'` | `'local'` | 区域背景定位方式 |
