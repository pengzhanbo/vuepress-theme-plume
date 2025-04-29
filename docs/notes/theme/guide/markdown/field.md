---
title: 字段容器
icon: solar:text-field-linear
createTime: 2025/04/29 09:55:17
permalink: /guide/markdown/field/
badge: 新
---

## 概述

在 markdown 中，使用 `::: field` 容器，用于描述字段信息，包括字段名称、字段类型、是否必填、默认值、详情等信息。

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

```md
<!-- 单个字段 -->
::: field name="字段名" type="类型" required default="默认值"
字段描述信息
:::

<!-- 字段组合 -->
:::: field-group

::: field name="字段名" type="类型" required default="默认值"
字段描述信息
:::

::: field name="字段名" type="类型" required default="默认值"
字段描述信息
:::

::::
```

## 属性

::: field name="name" required type="string"
字段名称
:::

::: field name="type" type="string" optional
字段类型
:::

::: field name="required" type="boolean" optional
是否必填
:::

::: field name="optional" type="boolean" optional
是否可选
:::

::: field name="default" type="string" optional
默认值
:::

## 示例

**输入：**

```md
::: field name="theme" type="ThemeConfig" required default="{}"
主题配置
:::

::: field name="enabled" type="boolean" optional default="true"
是否启用
:::
```

**输出：**

::: field name="theme" type="ThemeConfig" required default="{}"
主题配置
:::

::: field name="enabled" type="boolean" optional default="true"
是否启用
:::

**输入：**

```md
:::: field-group
::: field name="theme" type="ThemeConfig" required default="{ base: '/' }"
主题配置
:::

::: field name="enabled" type="boolean" optional default="true"
是否启用
:::

::: field name="callback" type="(...args: any[]) => void" optional default="() => {}"
回调函数
:::
::::
```

**输出：**

:::: field-group
::: field name="theme" type="ThemeConfig" required default="{ base: '/' }"
主题配置
:::

::: field name="enabled" type="boolean" optional default="true"
是否启用
:::

::: field name="callback" type="(...args: any[]) => void" optional default="() => {}"
回调函数
:::
::::
