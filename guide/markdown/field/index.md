---
url: /guide/markdown/field/index.md
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

支持 `@name`、`@type`、`@default`、`@required`、`@deprecated`、`@optional`、`@description` 标签。

| 标签 | 描述 |
| --- | --- |
| `@name` | 覆盖字段名称（默认使用 `:::field` 行后跟随的文本作为名称） |
| `@type` | 字段类型注解 |
| `@default` | 默认值 |
| `@required` | 标记为必填字段 |
| `@deprecated` | 标记为已弃用字段 |
| `@optional` | 标记为可选字段 |
| `@description` | 显式描述文本，任何非标签行也会被纳入描述 |

## 示例

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
@optional
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
@optional
@default true

是否启用
:::

**输入：**

```md
:::: field-group
::: field theme
@type ThemeConfig
@required
@default { base: '/' }
主题配置
:::

::: field enabled
@type boolean
@optional
@default true

是否启用
:::

::: field callback
@type (...args: any[]) => void
@optional
@default () => (){}
<Badge type="tip" text="v1.0.0 新增"  />
回调函数
:::

::: field other
@type string
@deprecated

<Badge type="danger" text="v0.9.0 弃用"  />
已弃用属性
:::
::::
```

**输出：**

:::: field-group
::: field theme
@type ThemeConfig
@required
@default { base: '/' }
主题配置
:::

::: field enabled
@type boolean
@optional
@default true

是否启用
:::

::: field callback
@type (...args: any\[]) => void
@optional
@default () => (){}

回调函数
:::

::: field other
@type string
@deprecated
