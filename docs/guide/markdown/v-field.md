---
title: 字段容器
icon: solar:text-field-linear
createTime: 2025/04/29 09:55:17
permalink: /guide/markdown/field/
badge:
  type: warning
  text: 变更
---

## 概述

在 markdown 中，使用 `::: field` 容器，配合 JSDoc 风格标签， 用于描述字段信息，包括字段名称、字段类型、是否必填、默认值、详情等信息。

它适用于 描述配置中的字段、组件的 Props 等场景。

还可以使用额外的 `:::: field-group` 容器，用于组合多个 `::: field`。

## 启用

该功能默认不启用，您需要在 `theme` 配置中启用它。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      field: true, // [!code ++]
    },
  })
})
```

## 语法

在 `::: field` 容器中，使用 JSDoc 风格标签来描述字段信息，每个标签应独占一行。

对于非标签行，默认合并到 `@description` 标签作为字段描述。

```md
<!-- 单个字段 -->
::: field 字段名
@type 类型
@required
@default 默认值
@description 字段描述信息
多行字段描述信息
:::

<!-- 字段组合 -->
:::: field-group

::: field 字段名
@type 类型
@required
@default 默认值
@description 字段描述信息
多行字段描述信息
:::

::: field 字段名
@type 类型
@required
@default 默认值
@description 字段描述信息
:::

::::
```

## 字段标签

支持以下标签：

| 标签 | 描述 |
| --- | --- |
| `@name` | 覆盖字段名称（默认使用 `:::field` 行后跟随的文本作为名称） |
| `@type` | 字段类型注解 |
| `@typeLink` | 字段类型参考链接，为 `@type` 渲染超链接 |
| `@required` | 标记为必填字段 |
| `@deprecated` | 标记为已弃用字段，可附带弃用版本或日期 |
| `@experimental` | 标记为实验性字段，可附带版本或日期 |
| `@default` | 默认值 |
| `@enum` | 可选值列表，多个候选值以 `\|` 分隔，支持多个 `@enum` 行追加 |
| `@since` | 标记字段自某版本起可用（重复标记时仅首个生效） |
| `@unit` | 单位注解 |
| `@format` | 格式注解 |
| `@constraint` | 约束注解 |
| `@description` | 显式描述文本，任何非标签行也会被纳入描述 |

字段默认即为可选，仅在标记 `@required` 时才显示为必填。

## 示例

### 基础用法

单个 `::: field` 容器用于描述一个字段，字段名默认取自容器标题，非标签行自动合并为字段描述。

**输入：**

```md
::: field theme
@type ThemeConfig
@required
@default {}

主题配置
:::

::: field enabled
@type boolean
@default true

是否启用
:::
```

**输出：**

::: field theme
@type ThemeConfig
@required
@default {}

主题配置
:::

::: field enabled
@type boolean
@default true

是否启用
:::

### 标记字段状态

`@deprecated` 和 `@experimental` 标签既可以单独声明，用于标记字段的弃用或实验性状态；
也可以附带额外的版本或日期信息。

**输入：**

```md
::: field legacy
@deprecated

旧版字段，不再推荐使用
:::

::: field beta
@experimental

实验性字段，接口可能发生变更
:::
```

**输出：**

::: field legacy
@deprecated

旧版字段，不再推荐使用
:::

::: field beta
@experimental

实验性字段，接口可能发生变更
:::

### 标签组合

使用 `:::: field-group` 容器组合多个字段，并搭配各类标签描述字段的完整信息：

**输入：**

```md
:::: field-group
::: field theme
@type ThemeConfig
@typeLink https://theme-plume.vuejs.press/zh/config/
@required
@default { base: '/' }
主题配置
:::

::: field fontSize
@type number
@required
@since v1.2.0
@default 14
@unit px
@format integer
@constraint 12 ~ 48

字体大小
:::

::: field mode
@type 'light' | 'dark' | 'auto'
@experimental v2.0.0-beta
@enum light | dark | auto
@default auto

主题模式
:::

::: field callback
@type (...args: any[]) => void
@default () => (){}
@description 回调函数，在特定时机触发
<Badge type="tip" text="v1.0.0 新增" />
:::

::: field other
@type string
@deprecated v0.9.0

已弃用属性
:::
::::
```

**输出：**

:::: field-group
::: field theme
@type ThemeConfig
@typeLink https://theme-plume.vuejs.press/zh/config/
@required
@default { base: '/' }
主题配置
:::

::: field fontSize
@type number
@required
@since v1.2.0
@default 14
@unit px
@format integer
@constraint 12 ~ 48

字体大小
:::

::: field mode
@type 'light' | 'dark' | 'auto'
@experimental v2.0.0-beta
@enum light | dark | auto
@default auto

主题模式
:::

::: field callback
@type (...args: any[]) => void
@default () => (){}
@description 回调函数，在特定时机触发
<Badge type="tip" text="v1.0.0 新增" />
:::

::: field other
@type string
@deprecated v0.9.0

已弃用属性
:::
::::
