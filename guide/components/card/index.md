---
url: /guide/components/card/index.md
---
## 概述

使用 `<Card>` 组件在页面中显示卡片。

也可以使用 markdown [卡片容器](../markdown/card.md) 语法，替代 `<Card>` 组件。

## Props

:::: field-group

::: field name="title" type="string" default="''" optional
卡片标题
:::

::: field name="icon" type="string | { svg: string }" default="''" optional
显示在标题左侧的图标，支持 iconify 所有图标，也可以使用 图片链接
:::

::::

## 插槽

| 名称    | 说明       |
| ------- | ---------- |
| default | 卡片内容   |
| title   | 自定义标题 |

## 示例

**输入：**

```md :no-line-numbers
<Card title="卡片标题" icon="twemoji:astonished-face">
  这里是卡片内容。
</Card>

<Card>
  <template #title>
    <p style="color: red">卡片标题</p>
  </template>
  这里是卡片内容。
</Card>
```

**输出：**

:::info
在插槽内也可以使用 markdown 语法，但需要注意的是，markdown 语法需要与 标签之间间隔一行。
否则将被识别为普通文本。
:::
