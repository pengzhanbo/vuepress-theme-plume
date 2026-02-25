---
url: /guide/components/card-grid/index.md
---
## 概述

当你需要将多个卡片排列，可以使用 `<CardGrid>` 组件。在空间足够时，多个卡片会自动排列。

## Props

:::: field-group
::: field name="cols" type="number | { sm: number, md: number, lg: number }" default="2"

卡片排列列数。

组件默认会根据屏幕宽度自动调整列数。在空间足够时，默认显示双列，小屏幕下显示单列。

你可以通过 `cols` 配置列数。当传入 `number` 时，所有尺寸均显示为 `number` 个卡片。
传入 `{ sm: number, md: number, lg: number }` 时，根据屏幕宽度自动调整列数。

* `sm` : `< 768px`
* `md` : `>= 768px < 960px`
* `lg` : `>= 960px`

建议传入的 `number` 不超过 `3`。

:::
::::

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
