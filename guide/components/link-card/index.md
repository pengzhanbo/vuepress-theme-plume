---
url: /guide/components/link-card/index.md
---
## 概述

使用 `<LinkCard>` 组件在页面中显示链接卡片。

## Props

:::: field-group

::: field name="title" type="string" default="''" optional
链接卡片标题
:::

::: field name="icon" type="string | { svg: string }" default="''" optional
显示在标题左侧的图标，支持 [markdown.icon](../features/icon.md) 配置的提供商的图标，也可以使用 图片链接
:::

::: field name="href" type="string" default="''" optional
链接卡片跳转地址
:::

::: field name="description" type="string" default="''" optional
链接卡片描述，建议使用组件默认插槽添加描述内容
:::

::: field name="target" type="string" default="''" optional
链接跳转方式
:::

::::

## 插槽

| 名称    | 说明         |
| ------- | ------------ |
| default | 卡片详情内容 |
| title   | 自定义标题   |

## 示例

**输入：**

```md :no-line-numbers
<LinkCard title="卡片标题" href="/" description="这里是卡片内容" />
<LinkCard icon="twemoji:astonished-face" title="卡片标题" href="/" />
```

**输出：**

使用组件插槽，可以实现更丰富的表现。

**输入：**

```md :no-line-numbers
<LinkCard title="卡片标题" href="/">

  - 这里是卡片内容
  - 这里是卡片内容

</LinkCard>

<LinkCard href="/">
  <template #title>
    <span style="color: red" >卡片标题</span>
  </template>

  - 这里是卡片内容
  - 这里是卡片内容

</LinkCard>
```

**输出：**


* 这里是卡片内容
* 这里是卡片内容

- 这里是卡片内容
- 这里是卡片内容

:::info
在插槽内也可以使用 markdown 语法，但需要注意的是，markdown 语法需要与 标签之间间隔一行。
否则将被识别为普通文本。
:::
