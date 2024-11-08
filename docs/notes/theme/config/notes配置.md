---
title: notes配置
author: pengzhanbo
createTime: 2024/03/02 14:00:06
permalink: /config/notes/
---

## 概述

主题默认将 `sourceDir` 目录下的 `notes` 目录作为 文档/知识笔记 的存放目录，
该目录下的所有文件都会被排除在 博客文章之外。

默认配置如下：

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    notes: { link: '/', dir: 'notes', notes: [] }, // [!code highlight]
  })
})
```

如果启用了 多语言配置， 你 也可以在 `locales` 字段中 分别配置 `notes`

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': {
        notes: { link: '/', dir: 'notes', notes: [] }, // [!code highlight]
      },
      '/zh/': {
        notes: { link: '/zh/', dir: 'notes', notes: [] }, // [!code highlight]
      }
    }
  })
})
```

## 配置

```ts
interface NotesOptions {
  /**
   * 保存所有笔记的目录
   * @default '/notes/'
   */
  dir: string
  /**
   * 所有笔记的默认链接前缀
   * @default '/'
   */
  link: string
  /**
   * 笔记配置
   */
  notes: NoteItem[]
}

interface NoteItem {
  /**
   * 保存笔记的目录
   */
  dir: string
  /**
   * 当前笔记的链接前缀，将会与 `notes.link` 合并
   */
  link: string
  /**
   * 当前笔记名称
   */
  text?: string
  /**
   * 当前笔记的侧边栏配置
   * - `'auto'` 根据目录结构自动生成侧边栏
   * - `string` 侧边栏文件路径, 如 `'/notes/sidebar.md'`，主题将会读取该文件作为侧边栏
   * - `SidebarItem` 单项侧边栏配置
   */
  sidebar?: 'auto' | (string | SidebarItem)[]
}

export interface SidebarItem {
  /**
   * 侧边栏文本
   */
  text?: string

  /**
   * 侧边栏链接
   */
  link?: string

  /**
   * 侧边栏图标
   */
  icon?: ThemeIcon

  /**
   * 次级侧边栏分组
   * 不超过 3 层
   */
  items?: 'auto' | (string | SidebarItem)[]

  /**
   * 如果未指定，组不可折叠。
   *
   * 如果为`true`，组可折叠，并默认折叠。
   *
   * 如果为`false`，组可折叠，但默认展开。
   */
  collapsed?: boolean

  /**
   * 当前分组的链接前缀
   */
  prefix?: string

  rel?: string
  target?: string
}

/**
 * - 支持 iconify 图标，直接使用 iconify name 即可自动加载
 * @see https://icon-sets.iconify.design/
 *
 * - 如果 iconify 图标不满足您的需求，也可以支持传入 svg 字符串。
 * - 还支持使用 本地图片 或 远程图片，本地图片的路径需要以 `/` 开头。
 */
export type ThemeIcon = string | { svg: string }
```

### 自动生成侧边栏

当配置某个 笔记 的 `sidebar` 为 `auto` 时，会自动根据目录结构生成侧边栏。

排序根据 [文件夹命名约定](/guide/write/#文件夹命名约定) 。

### 侧边栏图标

主题不仅可以通过 侧边栏配置中 `icon` 配置图标，还可以通过 文件中的 frontmatter 中 `icon` 字段 配置图标，
与 侧边栏配置中的 `icon` 一致。

```md
---
title: 主题介绍
icon: mdi:tooltip-text-outline
---
```

完整侧边栏使用说明，请查看 [此文档](../guide/知识笔记.md) 。
