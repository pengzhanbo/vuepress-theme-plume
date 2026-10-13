---
title: 首页布局容器
icon: tabler:container
createTime: 2024/08/18 23:49:40
permalink: /guide/components/home-box/
---

## 概述

`<HomeBox>` 是自定义首页每个**区域**的包装容器，负责背景图、内边距与全屏高度控制。

主题内置的所有首页区域类型（`banner`、`hero`、`features` 等）内部都使用它。你在[自定义区域类型](../custom/home.md#自定义区域类型)时会直接用到它。

```md
<HomeBox :background-image="bg" :full="true">
  <div>任意内容</div>
</HomeBox>
```

## Props

:::: field-group

::: field type
@type `'banner' | 'hero' | 'doc-hero' | 'text-image' | 'image-text' | 'features' | 'profile' | 'custom' | 'posts'`
@required
区域类型。由主题在渲染区域时传入，一般无需手动设置。
:::

::: field index
@type `number`
@required
区域在首页中的排列顺序，由主题根据 `config` 数组顺序自动计算。
:::

::: field full
@type `boolean`
@default `false`
是否占满屏幕高度（`100vh` 减去导航栏高度）。常用于首屏的 `hero`、`banner`。
:::

::: field backgroundImage
@type `string | { light: string, dark?: string }`

背景图片。传对象时可分别为浅色/深色模式指定不同图片。
:::

::: field backgroundAttachment
@type `'fixed' | 'local'`

背景图定位方式。`fixed` 表示背景图相对视口固定，滚动时不随之移动。
:::

::: field containerClass
@type `string | string[] | Record<string, boolean>`

内部 `.container` 的附加类名，用于自定义内容区宽度与间距。
:::

::: field onlyOnce
@type `boolean`

是否只显示一次（不重复渲染）。主题内部区域使用，一般无需手动设置。
:::

::::

## Slots

组件提供 3 个插槽，其中 `before` 与 `after` 位于内容容器**之外**（不受最大宽度限制），可用于全宽装饰。

| 插槽名 | 位置 | 用途 |
| --- | --- | --- |
| `before` | 容器之前，背景图之上 | 全宽装饰，如顶部横幅、分隔线 |
| `default` | `.container` 内部 | 主要内容，受最大宽度 1152px 居中限制 |
| `after` | 容器之后 | 全宽装饰，如底部横幅 |

### `default`

最常用的插槽，放置区域的主要内容。这也是 `backgroundImage` / `full` 等属性实际作用的内容区。

```vue
<HomeBox :background-image="bg">
  <div class="my-hero">
    <h1>标题</h1>
    <p>描述</p>
  </div>
</HomeBox>
```

### `before`

位于 `.container` **之外**，不受最大宽度限制。适合需要通栏的背景装饰。

```vue
<HomeBox>
  <template #before>
    <div class="top-banner">通栏横幅</div>
  </template>

  <div>常规内容</div>
</HomeBox>
```

### `after`

位于 `.container` **之后**，同样不受宽度限制。

```vue
<HomeBox :full="true">
  <div>首屏内容</div>

  <template #after>
    <div class="bottom-banner">底部通栏内容</div>
  </template>
</HomeBox>
```

## 与首页区域配置的关系

在 `README.md` 的 frontmatter 中配置区域时，`type` 会自动传递给组件：

```md title="README.md" frontmatter
---
home: true
config:
  -
    type: hero
    full: true
    backgroundImage:
      light: /images/hero-light.jpg
      dark: /images/hero-dark.jpg
---
```

对应的 frontmatter 字段会作为 props 传入。完整区域配置见 [自定义首页](../custom/home.md)。

## 在自定义区域类型中使用

编写自定义区域组件时，用 `<HomeBox>` 包裹你的内容，即可自动获得背景图与全屏支持：

```vue title="your-component.vue"
<script setup lang="ts">
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'

const props = defineProps<ThemeHomeConfigBase>()
</script>

<template>
  <VPHomeBox
    :type="type"
    :index="index"
    :full="full"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
  >
    <template #before>
      <slot name="before" />
    </template>

    <slot />

    <template #after>
      <slot name="after" />
    </template>
  </VPHomeBox>
</template>
```

::: tip
`VPHomeBox` 与 `HomeBox` 是同一个组件的两个名称。`HomeBox` 供 Markdown 直接使用，`VPHomeBox` 供 Vue 组件中导入使用。
:::

## 相关

- [自定义首页](../custom/home.md) —— 区域配置与自定义区域类型
- [首页背景特效](../custom/home-hero-effect.md) —— hero 区域的动画背景
- [自定义样式](../custom/style.md) —— `containerClass` 依赖的自定义样式
