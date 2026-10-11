---
title: 卡片容器
icon: vaadin:grid-h
createTime: 2024/08/18 23:38:33
permalink: /guide/components/card-grid/
---

## 概述

当你需要将多个卡片排列，可以使用 `<CardGrid>` 组件。在空间足够时，多个卡片会自动排列。

## Props

:::: field-group
::: field cols
@type `string | number | { sm?: number, md?: number, lg?: number }`
@default `{ sm: 1, md: 2, lg: 2 }`
卡片排列列数。

组件默认会根据屏幕宽度自动调整列数。在空间足够时，默认显示双列，小屏幕下显示单列。

你可以通过 `cols` 配置列数。当传入 `number`（或可被 `Number()` 转换的 `string`）时，所有尺寸均显示为该列数。
传入 `{ sm: number, md: number, lg: number }` 时，根据屏幕宽度自动调整列数，缺省的键沿用默认值。

- `sm` : `< 768px`
- `md` : `>= 768px < 960px`
- `lg` : `>= 960px`

建议传入的 `number` 不超过 `3`。

:::
::::

## Slots

### `default`

卡片网格通过 `default` 插槽接收子卡片。子元素会被均分为 `cols` 指定的列数：

```vue
<CardGrid :cols="3">
  <Card title="卡片 1" />
  <Card title="卡片 2" />
  <Card title="卡片 3" />
</CardGrid>
```

::: tip
列数由 `cols` 决定，**无需手动换行或分列** —— 放几列就渲染几列，超出部分自动换行。响应式切换时列数会重新计算，无需额外处理。
:::

在 Markdown 中，可用[卡片容器](../markdown/v-card.md)语法 `:::: card-grid` 代替。

## 示例

**输入：**

```md :no-line-numbers
<CardGrid>
  <Card title="卡片标题" icon="twemoji:astonished-face">
    这里是卡片内容。
  </Card>
  <Card title="卡片标题" icon="twemoji:astonished-face">
    这里是卡片内容。
  </Card>
</CardGrid>

<CardGrid>
  <LinkCard title="卡片标题" href="/" />
  <LinkCard icon="twemoji:astonished-face" title="卡片标题" href="/" />
</CardGrid>
```

**输出：**

<CardGrid>
  <Card title="卡片标题" icon="twemoji:astonished-face">
    这里是卡片内容。
  </Card>
  <Card title="卡片标题" icon="twemoji:astonished-face">
    这里是卡片内容。
  </Card>
</CardGrid>

<CardGrid>
  <LinkCard title="链接卡片" href="/" />
  <LinkCard icon="twemoji:astonished-face" title="链接卡片" href="/" />
</CardGrid>
